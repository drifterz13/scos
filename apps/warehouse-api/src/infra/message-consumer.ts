import { InventoryUpdateMessageSchema, MESSAGE_TYPE } from "../application/dto/inventory-update-message.dto";
import type { ProcessInventoryUpdateMessageUseCase } from "../application/use-cases/process-inventory-update-message.use-case";
import { getCategoryLogger } from "./logging/logger";
import type { QueueMessage, QueueService } from "./queue";

const logger = getCategoryLogger(["warehouse-api", "consumer"]);

export class MessageConsumer {
  private isRunning = false;

  constructor(
    private queueService: QueueService,
    private processInventoryUpdateMessageUseCase: ProcessInventoryUpdateMessageUseCase,
  ) {}

  async start(): Promise<void> {
    this.isRunning = true;
    logger.info`Message consumer started`;

    while (this.isRunning) {
      try {
        const messages = await this.queueService.receiveMessage(10);

        for (const message of messages) {
          await this.processMessage(message);
          await this.queueService.deleteMessage(message.receiptHandle);
        }
      } catch (error) {
        logger.error`Error receiving messages: ${error}`;
        await Bun.sleep(5000);
      }
    }
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    logger.info`Message consumer stopped`;
  }

  private async processMessage(message: QueueMessage): Promise<void> {
    try {
      const body = JSON.parse(message.body);
      const parsed = InventoryUpdateMessageSchema.parse(body);

      if (parsed.messageType !== MESSAGE_TYPE) {
        logger.warn`Unknown message type: ${parsed.messageType}, skipping`;
        return;
      }

      logger.debug`Processing inventory update for order ${parsed.orderNumber}`;
      await this.processInventoryUpdateMessageUseCase.execute(parsed);
      logger.info`Successfully processed inventory update for order ${parsed.orderNumber}`;
    } catch (error) {
      logger.error`Error processing message ${message.messageId}: ${error}`;
      throw error;
    }
  }
}
