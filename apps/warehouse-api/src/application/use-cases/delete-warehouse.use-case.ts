import type { IWarehouseRepository } from "../../domain/repositories/warehouse.repository.interface";

export class DeleteWarehouseUseCase {
  constructor(private warehouseRepository: IWarehouseRepository) {}

  async execute(id: string): Promise<void> {
    const warehouse = await this.warehouseRepository.findById(id);

    if (!warehouse) {
      throw new Error(`Warehouse not found: ${id}`);
    }

    await this.warehouseRepository.delete(id);
  }
}
