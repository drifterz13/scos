import type { QueueService } from "../../infrastructure/queue";
import { type InventoryUpdateMessageDto, MESSAGE_TYPE } from "../dto/inventory-update-message.dto";

export class PublishInventoryUpdateUseCase {
  constructor(private queueService: QueueService) {}

  async execute(request: {
    orderId: string;
    orderNumber: string;
    updates: Array<{ warehouseId: string; quantity: number }>;
  }): Promise<void> {
    const message: InventoryUpdateMessageDto = {
      messageType: MESSAGE_TYPE,
      messageId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      orderId: request.orderId,
      orderNumber: request.orderNumber,
      updates: request.updates,
    };

    await this.queueService.sendMessage(JSON.stringify(message));
  }
}
