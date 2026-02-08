import type { IWarehouseRepository } from "../../domain/repositories/warehouse.repository.interface";
import type { InventoryUpdateMessageDto } from "../dto/inventory-update-message.dto";

export class ProcessInventoryUpdateMessageUseCase {
  constructor(private warehouseRepository: IWarehouseRepository) {}

  async execute(message: InventoryUpdateMessageDto): Promise<void> {
    await this.warehouseRepository.updateStockBatch(message.updates);
  }
}
