import { type MessageAttributeValue, SendMessageCommand, SQSClient, type SQSClientConfig } from "@aws-sdk/client-sqs";
import { appConfig } from "../config/app-config";

export class QueueService {
  private sqsClient: SQSClient;
  private queueUrl: string = appConfig.orderToWarehouseQueueUrl;

  constructor() {
    const config: SQSClientConfig = {
      region: appConfig.awsRegion,
    };
    // Only set custom endpoint if explicitly configured (for LocalStack dev)
    // When using VPC Interface Endpoints with privateDnsEnabled: true,
    // the AWS SDK automatically routes traffic through the VPC endpoint.
    // Setting a custom endpoint overrides this automatic routing.
    if (appConfig.awsSQSEndpoint) {
      config.endpoint = appConfig.awsSQSEndpoint;
    }
    this.sqsClient = new SQSClient(config);
  }

  async sendMessage(msgBody: string, messageAttributes?: Record<string, { stringValue: string; dataType: string }>) {
    const attributes: Record<string, MessageAttributeValue> = {};

    if (messageAttributes) {
      for (const [key, value] of Object.entries(messageAttributes)) {
        attributes[key] = {
          StringValue: value.stringValue,
          DataType: value.dataType,
        };
      }
    }

    return this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: msgBody,
        MessageAttributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      }),
    );
  }
}
