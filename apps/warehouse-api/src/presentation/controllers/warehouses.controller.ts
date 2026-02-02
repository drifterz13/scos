import type { InventoryUpdateDto } from "../../application/dto/warehouse.dto";
import type { GetWarehousesUseCase } from "../../application/use-cases/get-warehouses.use-case";
import type { UpdateInventoryUseCase } from "../../application/use-cases/update-inventory.use-case";

export class WarehousesController {
  constructor(
    private getWarehousesUseCase: GetWarehousesUseCase,
    private updateInventoryUseCase: UpdateInventoryUseCase,
  ) {}

  async getWarehouses() {
    return await this.getWarehousesUseCase.execute();
  }

  async updateInventory(updates: InventoryUpdateDto[]) {
    return await this.updateInventoryUseCase.execute(updates);
  }
}
