import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import { BastionHost } from "./components/bastionHost";
import { Database } from "./components/database";
import { EcsService } from "./components/ecsService";
import { Queue } from "./components/queue";
import { StaticWebsite } from "./components/staticWebsite";

const config = new pulumi.Config();
const appName = "scos";

const vpc = new awsx.ec2.Vpc(`${appName}-vpc`, {
  natGateways: {
    strategy: awsx.ec2.NatGatewayStrategy.Single,
  },
  enableDnsHostnames: true,
  enableDnsSupport: true,
});
const cluster = new aws.ecs.Cluster(`${appName}-cluster`, {});

const orderRepo = new awsx.ecr.Repository(`${appName}-order-repo`, {
  forceDelete: true,
});
const warehouseRepo = new awsx.ecr.Repository(`${appName}-warehouse-repo`, {
  forceDelete: true,
});

const imageTag = config.get("imageTag") || "latest";
const orderImageUri = pulumi.interpolate`${orderRepo.url}:${imageTag}`;
const warehouseImageUri = pulumi.interpolate`${warehouseRepo.url}:${imageTag}`;

const rdsSecurityGroup = new aws.ec2.SecurityGroup(`${appName}-rds-sg`, {
  vpcId: vpc.vpcId,
  ingress: [
    {
      protocol: "tcp",
      fromPort: 5432,
      toPort: 5432,
      securityGroups: [],
      description: "Allow PostgreSQL access from ECS tasks",
    },
  ],
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
});

const ecsSecurityGroup = new aws.ec2.SecurityGroup(`${appName}-ecs-sg`, {
  vpcId: vpc.vpcId,
  ingress: [
    {
      protocol: "tcp",
      fromPort: 3001,
      toPort: 3001,
      cidrBlocks: ["0.0.0.0/0"],
      description: "Allow HTTP access to order service",
    },
    {
      protocol: "tcp",
      fromPort: 3002,
      toPort: 3002,
      cidrBlocks: ["0.0.0.0/0"],
      description: "Allow HTTP access to warehouse service",
    },
  ],
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
});

new aws.ec2.SecurityGroupRule(`${appName}-rds-from-ecs`, {
  type: "ingress",
  fromPort: 5432,
  toPort: 5432,
  protocol: "tcp",
  securityGroupId: rdsSecurityGroup.id,
  sourceSecurityGroupId: ecsSecurityGroup.id,
});

const bastionHost = new BastionHost(`${appName}-bastion`, {
  appName,
  vpcId: vpc.vpcId,
  subnetId: vpc.publicSubnetIds[0],
  rdsSecurityGroupId: rdsSecurityGroup.id,
});

new aws.ec2.SecurityGroupRule(`${appName}-rds-from-bastion`, {
  type: "ingress",
  fromPort: 5432,
  toPort: 5432,
  protocol: "tcp",
  securityGroupId: rdsSecurityGroup.id,
  sourceSecurityGroupId: bastionHost.securityGroupId,
});

const dbSubnetGroup = new aws.rds.SubnetGroup(`${appName}-db-subnet-group`, {
  subnetIds: vpc.privateSubnetIds,
  tags: {
    Name: `${appName}-db-subnet-group`,
  },
});

// AWS Secrets Manager secrets for database passwords
const orderDbSecret = new aws.secretsmanager.Secret(`${appName}-order-db-password`, {
  description: "Order database password",
});
new aws.secretsmanager.SecretVersion(`${appName}-order-db-password-version`, {
  secretId: orderDbSecret.id,
  secretString: config.requireSecret("orderDbPassword"),
});

const warehouseDbSecret = new aws.secretsmanager.Secret(`${appName}-warehouse-db-password`, {
  description: "Warehouse database password",
});
new aws.secretsmanager.SecretVersion(`${appName}-warehouse-db-password-version`, {
  secretId: warehouseDbSecret.id,
  secretString: config.requireSecret("warehouseDbPassword"),
});

const orderDb = new Database("order", {
  appName,
  dbName: "orderdb",
  username: "orderadmin",
  password: config.requireSecret("orderDbPassword"),
  subnetGroupName: dbSubnetGroup.name,
  securityGroupIds: [rdsSecurityGroup.id],
  publiclyAccessible: false,
});

const warehouseDb = new Database("warehouse", {
  appName,
  dbName: "warehousedb",
  username: "warehouseadmin",
  password: config.requireSecret("warehouseDbPassword"),
  subnetGroupName: dbSubnetGroup.name,
  securityGroupIds: [rdsSecurityGroup.id],
  publiclyAccessible: false,
});

const orderToWarehouseQueue = new Queue(`${appName}-order-to-warehouse-queue`, {
  tags: {
    Name: `${appName}-order-to-warehouse-queue`,
  },
});
const warehouseToOrderQueue = new Queue(`${appName}-warehouse-to-order-queue`, {
  tags: {
    Name: `${appName}-warehouse-to-order-queue`,
  },
});

// Cloud Map namespace for service discovery
const namespace = new aws.servicediscovery.PrivateDnsNamespace(`${appName}-namespace`, {
  name: "scos.local",
  vpc: vpc.vpcId,
  description: "Private DNS namespace for SCOS services",
});

// IAM Role for ECS Task Execution
const taskExecutionRole = new aws.iam.Role(`${appName}-task-execution-role`, {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: "ecs-tasks.amazonaws.com",
  }),
});
new aws.iam.RolePolicyAttachment(`${appName}-task-execution-policy`, {
  role: taskExecutionRole.name,
  policyArn: "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
});

// Grant taskExecutionRole permission to read secrets from Secrets Manager
const secretsPolicy = new aws.iam.Policy(`${appName}-secrets-policy`, {
  policy: pulumi.all([orderDbSecret.arn, warehouseDbSecret.arn]).apply(([orderSecretArn, warehouseSecretArn]) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["secretsmanager:GetSecretValue"],
          Resource: [orderSecretArn, warehouseSecretArn],
        },
      ],
    }),
  ),
});

new aws.iam.RolePolicyAttachment(`${appName}-task-execution-secrets-policy`, {
  role: taskExecutionRole.name,
  policyArn: secretsPolicy.arn,
});

// IAM Role for ECS Tasks (application permissions)
const taskRole = new aws.iam.Role(`${appName}-task-role`, {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: "ecs-tasks.amazonaws.com",
  }),
});

const sqsPolicy = new aws.iam.Policy(`${appName}-sqs-policy`, {
  policy: pulumi
    .all([orderToWarehouseQueue.arn, warehouseToOrderQueue.arn])
    .apply(([orderQueueArn, warehouseQueueArn]) =>
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: [
              "sqs:SendMessage",
              "sqs:ReceiveMessage",
              "sqs:DeleteMessage",
              "sqs:GetQueueAttributes",
              "sqs:GetQueueUrl",
            ],
            Resource: [orderQueueArn, warehouseQueueArn],
          },
        ],
      }),
    ),
});

new aws.iam.RolePolicyAttachment(`${appName}-task-sqs-policy`, {
  role: taskRole.name,
  policyArn: sqsPolicy.arn,
});

const orderService = new EcsService("order", {
  appName,
  serviceName: "order",
  clusterArn: cluster.arn,
  imageUri: orderImageUri,
  containerPort: 3001,
  cpu: 256,
  memory: 512,
  desiredCount: 1,
  subnetIds: vpc.publicSubnetIds,
  securityGroupIds: [ecsSecurityGroup.id],
  taskRoleArn: taskRole.arn,
  executionRoleArn: taskExecutionRole.arn,
  namespaceId: namespace.id,
  environment: [
    { name: "PORT", value: "3001" },
    { name: "DB_HOST", value: orderDb.address },
    { name: "DB_PORT", value: "5432" },
    { name: "DB_NAME", value: "orderdb" },
    { name: "DB_USER", value: "orderadmin" },
    { name: "ORDER_TO_WAREHOUSE_QUEUE_URL", value: orderToWarehouseQueue.url },
    { name: "WAREHOUSE_TO_ORDER_QUEUE_URL", value: warehouseToOrderQueue.url },
    {
      name: "WAREHOUSE_SERVICE_URL",
      value: "http://warehouse.scos.local:3002",
    },
  ],
  secrets: [
    {
      name: "DB_PASSWORD",
      valueFrom: orderDbSecret.arn,
    },
  ],
});
const warehouseService = new EcsService("warehouse", {
  appName,
  serviceName: "warehouse",
  clusterArn: cluster.arn,
  imageUri: warehouseImageUri,
  containerPort: 3002,
  cpu: 256,
  memory: 512,
  desiredCount: 1,
  subnetIds: vpc.publicSubnetIds,
  securityGroupIds: [ecsSecurityGroup.id],
  taskRoleArn: taskRole.arn,
  executionRoleArn: taskExecutionRole.arn,
  namespaceId: namespace.id,
  environment: [
    { name: "PORT", value: "3002" },
    { name: "DB_HOST", value: warehouseDb.address },
    { name: "DB_PORT", value: "5432" },
    { name: "DB_NAME", value: "warehousedb" },
    { name: "DB_USER", value: "warehouseadmin" },
    { name: "ORDER_TO_WAREHOUSE_QUEUE_URL", value: orderToWarehouseQueue.url },
    { name: "WAREHOUSE_TO_ORDER_QUEUE_URL", value: warehouseToOrderQueue.url },
    { name: "ORDER_SERVICE_URL", value: "http://order.scos.local:3001" },
  ],
  secrets: [
    {
      name: "DB_PASSWORD",
      valueFrom: warehouseDbSecret.arn,
    },
  ],
});

// Web app static website
const webSite = new StaticWebsite("web", {
  appName,
  siteName: "web",
});

export const vpcId = vpc.vpcId;
export const publicSubnetIds = vpc.publicSubnetIds;
export const privateSubnetIds = vpc.privateSubnetIds;
export const internetGatewayId = vpc.internetGateway.id;
export const clusterName = cluster.name;
export const clusterArn = cluster.arn;
export const orderServiceName = orderService.serviceName;
export const warehouseServiceName = warehouseService.serviceName;

// Database exports
export const orderDbEndpoint = orderDb.endpoint;
export const orderDbAddress = orderDb.address;
export const warehouseDbEndpoint = warehouseDb.endpoint;
export const warehouseDbAddress = warehouseDb.address;

// SQS exports
export const orderToWarehouseQueueUrl = orderToWarehouseQueue.url;
export const orderToWarehouseQueueArn = orderToWarehouseQueue.arn;
export const warehouseToOrderQueueUrl = warehouseToOrderQueue.url;
export const warehouseToOrderQueueArn = warehouseToOrderQueue.arn;

// Cloud Map exports
export const namespaceId = namespace.id;
export const namespaceName = namespace.name;
export const orderServiceDiscoveryArn = orderService.serviceDiscovery.arn;
export const warehouseServiceDiscoveryArn = warehouseService.serviceDiscovery.arn;

// Bastion Host exports
export const bastionInstanceId = bastionHost.instanceId;
export const bastionSecurityGroupId = bastionHost.securityGroupId;

// Web app static website exports
export const webBucketName = webSite.bucketName;
export const webUrl = webSite.websiteUrl;
