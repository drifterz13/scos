import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export interface ApiGatewayServiceRoute {
  pathPrefix: string;
  serviceDiscoveryArn: pulumi.Input<string>;
}

export interface ApiGatewayArgs {
  appName: string;
  vpcId: pulumi.Input<string>;
  subnetIds: pulumi.Input<pulumi.Input<string>[]>;
  securityGroupIds: pulumi.Input<pulumi.Input<string>[]>;
  services: ApiGatewayServiceRoute[];
  corsAllowOrigins?: string[];
}

/**
 * ApiGateway component creates an HTTP API Gateway with VPC Link
 * for routing traffic to ECS services in private subnets via Cloud Map.
 */
export class ApiGateway extends pulumi.ComponentResource {
  public readonly api: aws.apigatewayv2.Api;
  public readonly vpcLink: aws.apigatewayv2.VpcLink;
  public readonly stage: aws.apigatewayv2.Stage;
  public readonly endpoint: pulumi.Output<string>;
  public readonly invokeUrl: pulumi.Output<string>;

  constructor(name: string, args: ApiGatewayArgs, opts?: pulumi.ComponentResourceOptions) {
    super("scos:components:ApiGateway", name, args, opts);

    // HTTP API
    this.api = new aws.apigatewayv2.Api(
      `${args.appName}-http-api`,
      {
        name: `${args.appName}-api`,
        protocolType: "HTTP",
        corsConfiguration: {
          allowOrigins: args.corsAllowOrigins || ["*"],
          allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
          allowHeaders: ["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key"],
          maxAge: 300,
        },
      },
      { parent: this },
    );

    // VPC Link for private integration
    this.vpcLink = new aws.apigatewayv2.VpcLink(
      `${args.appName}-vpc-link`,
      {
        name: `${args.appName}-vpc-link`,
        subnetIds: args.subnetIds,
        securityGroupIds: args.securityGroupIds,
      },
      { parent: this },
    );

    // Create integrations and routes for each service
    for (const service of args.services) {
      // Convert /api/orders to api-orders for resource naming
      const routeName = service.pathPrefix.replace(/^\//, "").replace(/\//g, "-");

      // Integration for proxy routes - strips the path prefix
      const proxyIntegration = new aws.apigatewayv2.Integration(
        `${args.appName}-${routeName}-proxy-integration`,
        {
          apiId: this.api.id,
          integrationType: "HTTP_PROXY",
          integrationMethod: "ANY",
          integrationUri: service.serviceDiscoveryArn,
          connectionType: "VPC_LINK",
          connectionId: this.vpcLink.id,
          requestParameters: {
            "overwrite:path": "/${request.path.proxy}",
          },
        },
        { parent: this },
      );

      // Integration for root route - maps to /
      const rootIntegration = new aws.apigatewayv2.Integration(
        `${args.appName}-${routeName}-root-integration`,
        {
          apiId: this.api.id,
          integrationType: "HTTP_PROXY",
          integrationMethod: "ANY",
          integrationUri: service.serviceDiscoveryArn,
          connectionType: "VPC_LINK",
          connectionId: this.vpcLink.id,
          requestParameters: {
            "overwrite:path": "/",
          },
        },
        { parent: this },
      );

      // Route for the service (catch-all under the path prefix)
      new aws.apigatewayv2.Route(
        `${args.appName}-${routeName}-route`,
        {
          apiId: this.api.id,
          routeKey: `ANY ${service.pathPrefix}/{proxy+}`,
          target: pulumi.interpolate`integrations/${proxyIntegration.id}`,
        },
        { parent: this },
      );

      // Root route for the service prefix (e.g., /orders without trailing path)
      new aws.apigatewayv2.Route(
        `${args.appName}-${routeName}-root-route`,
        {
          apiId: this.api.id,
          routeKey: `ANY ${service.pathPrefix}`,
          target: pulumi.interpolate`integrations/${rootIntegration.id}`,
        },
        { parent: this },
      );
    }

    // Default stage with auto-deploy
    this.stage = new aws.apigatewayv2.Stage(
      `${args.appName}-stage`,
      {
        apiId: this.api.id,
        name: "$default",
        autoDeploy: true,
      },
      { parent: this },
    );

    this.endpoint = this.api.apiEndpoint;
    this.invokeUrl = pulumi.interpolate`${this.api.apiEndpoint}`;

    this.registerOutputs({
      endpoint: this.endpoint,
      invokeUrl: this.invokeUrl,
      vpcLinkId: this.vpcLink.id,
    });
  }
}
