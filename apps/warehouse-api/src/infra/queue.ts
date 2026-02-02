import { DeleteMessageCommand, ReceiveMessageCommand, SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
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
    this.sqsClient = new SQSClient({
      region: appConfig.awsRegion,
      endpoint: appConfig.awsSQSEndpoint,
    });
  }

  async sendMessage(msgBody: any) {
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
