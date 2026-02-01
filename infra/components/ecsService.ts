import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

export interface EcsServiceArgs {
  appName: string;
  serviceName: string;
  clusterArn: pulumi.Input<string>;
  imageUri: pulumi.Input<string>;
  containerPort: number;
  cpu: number;
  memory: number;
  desiredCount: number;
  subnetIds: pulumi.Input<pulumi.Input<string>[]>;
  securityGroupIds: pulumi.Input<pulumi.Input<string>[]>;
  taskRoleArn: pulumi.Input<string>;
  executionRoleArn: pulumi.Input<string>;
  namespaceId: pulumi.Input<string>;
  environment: pulumi.Input<awsx.types.input.ecs.TaskDefinitionKeyValuePairArgs>[];
  secrets?: pulumi.Input<awsx.types.input.ecs.TaskDefinitionSecretArgs>[];
}

/**
 * EcsService component encapsulates a Fargate service with service discovery.
 * This groups the service discovery configuration and the Fargate service together.
 */
export class EcsService extends pulumi.ComponentResource {
  public readonly serviceDiscovery: aws.servicediscovery.Service;
  public readonly fargateService: awsx.ecs.FargateService;
  public readonly serviceName: pulumi.Output<string>;

  constructor(name: string, args: EcsServiceArgs, opts?: pulumi.ComponentResourceOptions) {
    super("scos:components:EcsService", name, args, opts);

    // Cloud Map service discovery
    this.serviceDiscovery = new aws.servicediscovery.Service(
      `${args.appName}-${args.serviceName}-discovery`,
      {
        name: args.serviceName,
        dnsConfig: {
          namespaceId: args.namespaceId,
          dnsRecords: [
            {
              ttl: 10,
              type: "A",
            },
          ],
          routingPolicy: "MULTIVALUE",
        },
      },
      {
        parent: this,
        aliases: [
          {
            name: `${args.appName}-${args.serviceName}-discovery`,
            parent: pulumi.rootStackResource,
          },
        ],
      },
    );

    // Fargate Service
    this.fargateService = new awsx.ecs.FargateService(
      `${args.appName}-${args.serviceName}-service`,
      {
        cluster: args.clusterArn,
        desiredCount: args.desiredCount,
        networkConfiguration: {
          subnets: args.subnetIds,
          securityGroups: args.securityGroupIds,
          assignPublicIp: true,
        },
        serviceRegistries: {
          registryArn: this.serviceDiscovery.arn,
        },
        taskDefinitionArgs: {
          taskRole: {
            roleArn: args.taskRoleArn,
          },
          executionRole: {
            roleArn: args.executionRoleArn,
          },
          container: {
            name: args.serviceName,
            image: args.imageUri,
            cpu: args.cpu,
            memory: args.memory,
            essential: true,
            portMappings: [
              {
                containerPort: args.containerPort,
                hostPort: args.containerPort,
                protocol: "tcp",
              },
            ],
            environment: args.environment,
            secrets: args.secrets,
          },
        },
      },
      {
        parent: this,
        aliases: [
          {
            name: `${args.appName}-${args.serviceName}-service`,
            parent: pulumi.rootStackResource,
          },
        ],
      },
    );

    this.serviceName = this.fargateService.service.name;

    this.registerOutputs({
      serviceName: this.serviceName,
      serviceDiscoveryArn: this.serviceDiscovery.arn,
    });
  }
}
