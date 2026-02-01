import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export interface BastionHostArgs {
  appName: string;
  vpcId: pulumi.Input<string>;
  subnetId: pulumi.Input<string>;
  rdsSecurityGroupId: pulumi.Input<string>;
}

export class BastionHost extends pulumi.ComponentResource {
  public readonly instanceId: pulumi.Output<string>;
  public readonly securityGroupId: pulumi.Output<string>;

  constructor(name: string, args: BastionHostArgs, opts?: pulumi.ComponentResourceOptions) {
    super("scos:components:BastionHost", name, {}, opts);

    const ami = aws.ec2.getAmi(
      {
        mostRecent: true,
        owners: ["amazon"],
        filters: [
          { name: "name", values: ["al2023-ami-2023.*-arm64"] },
          { name: "virtualization-type", values: ["hvm"] },
        ],
      },
      { parent: this },
    );

    const securityGroup = new aws.ec2.SecurityGroup(
      `${args.appName}-bastion-sg`,
      {
        vpcId: args.vpcId,
        description: "Security group for bastion host",
        egress: [
          {
            protocol: "tcp",
            fromPort: 443,
            toPort: 443,
            cidrBlocks: ["0.0.0.0/0"],
            description: "Allow HTTPS for SSM",
          },
          {
            protocol: "tcp",
            fromPort: 5432,
            toPort: 5432,
            securityGroups: [args.rdsSecurityGroupId],
            description: "Allow PostgreSQL access to RDS",
          },
        ],
        tags: {
          Name: `${args.appName}-bastion-sg`,
        },
      },
      { parent: this },
    );

    const role = new aws.iam.Role(
      `${args.appName}-bastion-role`,
      {
        assumeRolePolicy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                Service: "ec2.amazonaws.com",
              },
              Action: "sts:AssumeRole",
            },
          ],
        }),
        tags: {
          Name: `${args.appName}-bastion-role`,
        },
      },
      { parent: this },
    );

    new aws.iam.RolePolicyAttachment(
      `${args.appName}-bastion-ssm-policy`,
      {
        role: role.name,
        policyArn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
      },
      { parent: this },
    );

    const instanceProfile = new aws.iam.InstanceProfile(
      `${args.appName}-bastion-profile`,
      {
        role: role.name,
        tags: {
          Name: `${args.appName}-bastion-profile`,
        },
      },
      { parent: this },
    );

    const instance = new aws.ec2.Instance(
      `${args.appName}-bastion`,
      {
        instanceType: "t4g.nano",
        ami: ami.then((a) => a.id),
        subnetId: args.subnetId,
        iamInstanceProfile: instanceProfile.name,
        vpcSecurityGroupIds: [securityGroup.id],
        associatePublicIpAddress: true,
        tags: {
          Name: `${args.appName}-bastion`,
        },
        metadataOptions: {
          httpTokens: "required",
          httpPutResponseHopLimit: 1,
        },
      },
      { parent: this },
    );

    this.instanceId = instance.id;
    this.securityGroupId = securityGroup.id;

    this.registerOutputs({
      instanceId: this.instanceId,
      securityGroupId: this.securityGroupId,
    });
  }
}
