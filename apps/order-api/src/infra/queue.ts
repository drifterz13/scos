import { type MessageAttributeValue, SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { appConfig } from "../config/app-config";

export class QueueService {
  private sqsClient: SQSClient;
  private queueUrl: string = appConfig.orderToWarehouseQueueUrl;

  constructor() {
    this.sqsClient = new SQSClient({
      region: appConfig.awsRegion,
      endpoint: appConfig.awsSQSEndpoint,
    });
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
