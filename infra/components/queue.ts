import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export interface QueueArgs {
  visibilityTimeoutSeconds?: number;
  messageRetentionSeconds?: number;
  tags?: pulumi.Input<{ [key: string]: pulumi.Input<string> }>;
}

/**
 * Queue component encapsulates an SQS queue with standard configuration.
 */
export class Queue extends pulumi.ComponentResource {
  public readonly queue: aws.sqs.Queue;
  public readonly url: pulumi.Output<string>;
  public readonly arn: pulumi.Output<string>;

  constructor(name: string, args?: QueueArgs, opts?: pulumi.ComponentResourceOptions) {
    super("scos:components:Queue", name, args ?? {}, opts);

    this.queue = new aws.sqs.Queue(
      name,
      {
        visibilityTimeoutSeconds: args?.visibilityTimeoutSeconds ?? 300,
        messageRetentionSeconds: args?.messageRetentionSeconds ?? 345600, // 4 days
        tags: args?.tags,
      },
      { parent: this },
    );

    this.url = this.queue.url;
    this.arn = this.queue.arn;

    this.registerOutputs({
      url: this.url,
      arn: this.arn,
    });
  }
}
