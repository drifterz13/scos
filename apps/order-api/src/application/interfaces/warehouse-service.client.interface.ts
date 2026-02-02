export interface WarehouseDto {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  stockQuantity: number;
}

export interface IWarehouseServiceClient {
  getAllWarehouses(): Promise<WarehouseDto[]>;
  updateInventory(updates: Array<{ warehouseId: string; quantity: number }>): Promise<void>;
}
