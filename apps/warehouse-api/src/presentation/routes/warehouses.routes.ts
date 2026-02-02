import { DEFAULT_CORS_HEADERS, getCategoryLogger } from "@scos/shared";
import { z } from "zod";
import { InventoryUpdateDtoSchema } from "../../application/dto/warehouse.dto";
import type { WarehousesController } from "../controllers/warehouses.controller";

const logger = getCategoryLogger(["warehouse-api", "routes"]);

const InventoryUpdateArraySchema = z.array(InventoryUpdateDtoSchema);

export function createWarehouseRoutes(controller: WarehousesController) {
  return {
    "/list": async (req: Request) => {
      if (req.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: DEFAULT_CORS_HEADERS,
        });
      }
      if (req.method !== "GET") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: DEFAULT_CORS_HEADERS,
        });
      }
      const result = await controller.getWarehouses();

      return Response.json(result, { headers: DEFAULT_CORS_HEADERS });
    },

    "/inventory": async (req: Request) => {
      if (req.method !== "POST") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: DEFAULT_CORS_HEADERS,
        });
      }
      try {
        const body = InventoryUpdateArraySchema.parse(await req.json());
        logger.debug`POST /inventory - body: ${JSON.stringify(body)}`;
        await controller.updateInventory(body);

        return new Response("Inventory updated", {
          status: 200,
          headers: DEFAULT_CORS_HEADERS,
        });
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "ZodError") {
          logger.warn`Validation error: ${error.message}`;
          return new Response(error.message, {
            status: 400,
            headers: DEFAULT_CORS_HEADERS,
          });
        }
        logger.error`Unexpected error: ${error instanceof Error ? error.message : String(error)}`;

        return new Response(error instanceof Error ? error.message : "Unknown error", {
          status: 500,
          headers: DEFAULT_CORS_HEADERS,
        });
      }
    },
  };
}
