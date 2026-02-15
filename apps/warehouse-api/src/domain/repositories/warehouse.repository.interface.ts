import type { Warehouse } from "../entities/warehouse.entity";
import type { Coordinates } from "../value-objects/coordinates.vo";

export interface IWarehouseRepository {
  findAll(): Promise<Warehouse[]>;
  findById(id: string): Promise<Warehouse | null>;
  create(warehouse: Warehouse): Promise<Warehouse>;
  update(warehouse: Warehouse): Promise<Warehouse>;
  delete(id: string): Promise<void>;
  updateStockBatch(updates: Array<{ warehouseId: string; quantity: number }>): Promise<void>;
}
