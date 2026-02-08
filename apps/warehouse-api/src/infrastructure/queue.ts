import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
  type SQSClientConfig,
} from "@aws-sdk/client-sqs";
import { appConfig } from "../config/app-config";

export interface QueueMessage {
  messageId: string;
  body: string;
  receiptHandle: string;
}

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

  async sendMessage(msgBody: string) {
    return this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: msgBody,
      }),
    );
  }

  async receiveMessage(maxMessages: number = 10): Promise<QueueMessage[]> {
    const response = await this.sqsClient.send(
      new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: maxMessages,
        WaitTimeSeconds: 20,
        AttributeNames: ["All"],
      }),
    );

    if (!response.Messages) {
      return [];
    }

    return response.Messages.map((msg) => ({
      messageId: msg.MessageId!,
      body: msg.Body!,
      receiptHandle: msg.ReceiptHandle!,
    }));
  }

  async deleteMessage(receiptHandle: string): Promise<void> {
    await this.sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      }),
    );
  }
}
