import type { IWarehouseRepository } from "../../domain/repositories/warehouse.repository.interface";
import type { InventoryUpdateDto } from "../dto/warehouse.dto";

export class UpdateInventoryUseCase {
  constructor(private warehouseRepository: IWarehouseRepository) {}

  async execute(updates: InventoryUpdateDto[]): Promise<void> {
    await this.warehouseRepository.updateStockBatch(updates);
  }
}
