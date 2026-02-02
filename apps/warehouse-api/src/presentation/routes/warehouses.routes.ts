import { InventoryUpdateDtoSchema } from "../../application/dto/warehouse.dto";
import type { WarehousesController } from "../controllers/warehouses.controller";

const InventoryUpdateArraySchema = z.array(InventoryUpdateDtoSchema);

import { z } from "zod";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function createWarehouseRoutes(controller: WarehousesController) {
  return {
    "/warehouses": async (req: Request) => {
      if (req.method !== "GET") {
        return new Response("Method Not Allowed", { status: 405, headers });
      }
      const result = await controller.getWarehouses();
      return Response.json(result, { headers });
    },

    "/inventory/update": async (req: Request) => {
      if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers });
      }
      try {
        const body = InventoryUpdateArraySchema.parse(await req.json());
        await controller.updateInventory(body);
        return new Response("Inventory updated", { status: 200, headers });
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "ZodError") {
          return new Response(error.message, { status: 400, headers });
        }
        return new Response(error instanceof Error ? error.message : "Unknown error", { status: 500, headers });
      }
    },
  };
}
