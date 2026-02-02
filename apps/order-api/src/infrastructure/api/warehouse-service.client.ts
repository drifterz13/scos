import { type WarehouseDto, WarehousesResponseDtoSchema } from "../../application/dto/warehouse.dto";
import type { IWarehouseServiceClient } from "../../application/interfaces/warehouse-service.client.interface";
import { appConfig } from "../../config/app-config";

export class WarehouseServiceClient implements IWarehouseServiceClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = appConfig.warehouseServiceUrl;
  }

  async getAllWarehouses(): Promise<WarehouseDto[]> {
    const response = await fetch(`${this.baseUrl}/warehouses`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch warehouses: ${response.statusText}`);
    }

    const json = await response.json();
    const data = WarehousesResponseDtoSchema.parse(json);
    return data.data;
  }

  async updateInventory(updates: Array<{ warehouseId: string; quantity: number }>): Promise<void> {
    const response = await fetch(`${this.baseUrl}/inventory/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update inventory: ${response.statusText}`);
    }
  }
}
