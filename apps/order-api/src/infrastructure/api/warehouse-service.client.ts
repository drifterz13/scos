import { z } from "zod";
import type {
  IWarehouseServiceClient,
  WarehouseDto,
} from "../../application/interfaces/warehouse-service.client.interface";
import { appConfig } from "../../config/app-config";

const WarehousesResponseDtoSchema = z.object({
  data: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      stockQuantity: z.number().nonnegative().int(),
    }),
  ),
});

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
    console.log("JSON data: ", json);
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
