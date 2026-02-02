import type { WarehouseDto } from "../dto/warehouse.dto";

export interface IWarehouseServiceClient {
  getAllWarehouses(): Promise<WarehouseDto[]>;
}
