import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export interface DatabaseArgs {
  appName: string;
  dbName: string;
  username: string;
  password: pulumi.Output<string>;
  subnetGroupName: pulumi.Input<string>;
  securityGroupIds: pulumi.Input<pulumi.Input<string>[]>;
  publiclyAccessible?: boolean;
}

/**
 * Database component encapsulates an RDS PostgreSQL instance with standard configuration.
 * This component groups the database instance and its configuration together.
 */
export class Database extends pulumi.ComponentResource {
  public readonly instance: aws.rds.Instance;
  public readonly endpoint: pulumi.Output<string>;
  public readonly address: pulumi.Output<string>;

  constructor(name: string, args: DatabaseArgs, opts?: pulumi.ComponentResourceOptions) {
    super("scos:components:Database", name, args, opts);

    this.instance = new aws.rds.Instance(
      `${args.appName}-${name}-db`,
      {
        allocatedStorage: 20,
        engine: "postgres",
        engineVersion: "17",
        instanceClass: "db.t3.micro",
        dbName: args.dbName,
        username: args.username,
        password: args.password,
        dbSubnetGroupName: args.subnetGroupName,
        vpcSecurityGroupIds: args.securityGroupIds,
        skipFinalSnapshot: true,
        publiclyAccessible: args.publiclyAccessible ?? false,
        tags: {
          Name: `${args.appName}-${name}-db`,
        },
      },
      {
        parent: this,
        deleteBeforeReplace: true,
      },
    );

    this.endpoint = this.instance.endpoint;
    this.address = this.instance.address;

    this.registerOutputs({
      endpoint: this.endpoint,
      address: this.address,
    });
  }
}
