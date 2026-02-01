import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
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

  async sendMessage(msgBody: any) {
    return this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: msgBody,
      }),
    );
  }
}
