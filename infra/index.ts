import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const appName = "scos";

const vpc = new awsx.ec2.Vpc(`${appName}-vpc`, {
  natGateways: {
    strategy: awsx.ec2.NatGatewayStrategy.Single,
  },
});

const cluster = new aws.ecs.Cluster(`${appName}-cluster`, {});

const orderRepo = new awsx.ecr.Repository(`${appName}-order-repo`, {
  forceDelete: true,
});
const warehouseRepo = new awsx.ecr.Repository(`${appName}-warehouse-repo`, {
  forceDelete: true,
});

// Reference existing images from ECR (built by GitHub Actions)
const imageTag = config.get("imageTag") || "latest";
const orderImageUri = pulumi.interpolate`${orderRepo.url}:${imageTag}`;
const warehouseImageUri = pulumi.interpolate`${warehouseRepo.url}:${imageTag}`;

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

const orderService = new awsx.ecs.FargateService(`${appName}-order-service`, {
  cluster: cluster.arn,
  desiredCount: 1,
  networkConfiguration: {
    subnets: vpc.publicSubnetIds,
    securityGroups: [ecsSecurityGroup.id],
    assignPublicIp: true,
  },
  taskDefinitionArgs: {
    container: {
      name: "order",
      image: orderImageUri,
      cpu: 256,
      memory: 512,
      essential: true,
      portMappings: [
        {
          containerPort: 3001,
          hostPort: 3001,
          protocol: "tcp",
        },
      ],
      environment: [
        {
          name: "PORT",
          value: "3001",
        },
      ],
    },
  },
});

const warehouseService = new awsx.ecs.FargateService(`${appName}-warehouse-service`, {
  cluster: cluster.arn,
  desiredCount: 1,
  networkConfiguration: {
    subnets: vpc.publicSubnetIds,
    securityGroups: [ecsSecurityGroup.id],
    assignPublicIp: true,
  },
  taskDefinitionArgs: {
    container: {
      name: "warehouse",
      image: warehouseImageUri,
      cpu: 256,
      memory: 512,
      essential: true,
      portMappings: [
        {
          containerPort: 3002,
          hostPort: 3002,
          protocol: "tcp",
        },
      ],
      environment: [
        {
          name: "PORT",
          value: "3002",
        },
      ],
    },
  },
});

export const vpcId = vpc.vpcId;
export const clusterName = cluster.name;
export const clusterArn = cluster.arn;
export const orderServiceName = orderService.service.name;
export const warehouseServiceName = warehouseService.service.name;
