import type { InventoryUpdateMessageDto } from "../dto/inventory-update-message.dto";
import type { UpdateInventoryUseCase } from "./update-inventory.use-case";

export class ProcessInventoryUpdateMessageUseCase {
  constructor(private updateInventoryUseCase: UpdateInventoryUseCase) {}

  async execute(message: InventoryUpdateMessageDto): Promise<void> {
    await this.updateInventoryUseCase.execute(message.updates);
  }
}
