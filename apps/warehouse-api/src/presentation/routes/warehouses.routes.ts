import { DEFAULT_CORS_HEADERS, getCategoryLogger } from "@scos/shared";
import type { WarehousesController } from "../controllers/warehouses.controller";

const logger = getCategoryLogger(["warehouse-api", "routes"]);

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
  };
}
