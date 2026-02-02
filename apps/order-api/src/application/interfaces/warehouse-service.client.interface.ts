import type { WarehouseDto } from "../dto/warehouse.dto";

export interface IWarehouseServiceClient {
  getAllWarehouses(): Promise<WarehouseDto[]>;
  updateInventory(updates: Array<{ warehouseId: string; quantity: number }>): Promise<void>;
}
