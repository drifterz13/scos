import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export interface StaticWebsiteArgs {
  appName: string;
  siteName: string;
}

/**
 * StaticWebsite component encapsulates S3 bucket configuration for static website hosting.
 * Includes bucket, public access configuration, and bucket policy.
 */
export class StaticWebsite extends pulumi.ComponentResource {
  public readonly bucket: aws.s3.Bucket;
  public readonly bucketName: pulumi.Output<string>;
  public readonly websiteUrl: pulumi.Output<string>;

  constructor(name: string, args: StaticWebsiteArgs, opts?: pulumi.ComponentResourceOptions) {
    super("scos:components:StaticWebsite", name, args, opts);

    // S3 bucket
    this.bucket = new aws.s3.Bucket(
      `${args.appName}-${args.siteName}-bucket`,
      {
        forceDestroy: true, // Allow destroy even with files (dev environment)
      },
      { parent: this },
    );

    // S3 bucket website configuration (separate resource)
    const websiteConfiguration = new aws.s3.BucketWebsiteConfiguration(
      `${args.appName}-${args.siteName}-website-config`,
      {
        bucket: this.bucket.id,
        indexDocument: {
          suffix: "index.html",
        },
        errorDocument: {
          key: "index.html", // SPA routing: all errors return index.html
        },
      },
      { parent: this },
    );

    // Disable block public access (required for public website)
    const publicAccessBlock = new aws.s3.BucketPublicAccessBlock(
      `${args.appName}-${args.siteName}-public-access`,
      {
        bucket: this.bucket.id,
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      { parent: this },
    );

    // Bucket policy for public read access
    const bucketPolicy = new aws.s3.BucketPolicy(
      `${args.appName}-${args.siteName}-policy`,
      {
        bucket: this.bucket.id,
        policy: this.bucket.arn.apply((arn) =>
          JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: "*",
                Action: ["s3:GetObject"],
                Resource: [`${arn}/*`],
              },
            ],
          }),
        ),
      },
      { parent: this, dependsOn: [publicAccessBlock] },
    );

    this.bucketName = this.bucket.id;
    this.websiteUrl = websiteConfiguration.websiteEndpoint.apply((endpoint) => `http://${endpoint}`);

    this.registerOutputs({
      bucketName: this.bucketName,
      websiteUrl: this.websiteUrl,
    });
  }
}
