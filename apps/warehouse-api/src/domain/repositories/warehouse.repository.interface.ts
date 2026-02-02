import type { Warehouse } from "../entities/warehouse.entity";

export interface IWarehouseRepository {
  findAll(): Promise<Warehouse[]>;
  updateStockBatch(updates: Array<{ warehouseId: string; quantity: number }>): Promise<void>;
}
