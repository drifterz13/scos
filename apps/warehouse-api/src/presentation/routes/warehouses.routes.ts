import { DEFAULT_CORS_HEADERS, getCategoryLogger } from "@scos/shared";
import { CreateWarehouseRequestDtoSchema } from "../../application/dto/create-warehouse.dto";
import { DeleteWarehouseParamsDtoSchema } from "../../application/dto/delete-warehouse.dto";
import {
  UpdateWarehouseParamsDtoSchema,
  UpdateWarehouseRequestDtoSchema,
} from "../../application/dto/update-warehouse.dto";
import type { WarehousesController } from "../controllers/warehouses.controller";

const logger = getCategoryLogger(["warehouse-api", "routes"]);

function handleErrorResponse(error: unknown): Response {
  if (error instanceof Error && error.name === "ZodError") {
    logger.warn`Validation error: ${error.message}`;
    return new Response(error.message, { status: 400, headers: DEFAULT_CORS_HEADERS });
  }

  logger.error`Unexpected error: ${error instanceof Error ? error.message : String(error)}`;
  return new Response(error instanceof Error ? error.message : "Unknown error", {
    status: 500,
    headers: DEFAULT_CORS_HEADERS,
  });
}

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
    "/": async (req: Request) => {
      if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: DEFAULT_CORS_HEADERS });
      }

      if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers: DEFAULT_CORS_HEADERS });
      }

      try {
        const body = CreateWarehouseRequestDtoSchema.parse(await req.json());
        logger.debug`POST / - body: ${JSON.stringify(body)}`;
        const result = await controller.createWarehouse(body);
        return Response.json(result, { status: 201, headers: DEFAULT_CORS_HEADERS });
      } catch (error: unknown) {
        return handleErrorResponse(error);
      }
    },
    "/:id": async (req: Request) => {
      if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: DEFAULT_CORS_HEADERS });
      }

      // Extract ID from URL
      const url = new URL(req.url);
      const pathParts = url.pathname.split("/");
      const id = pathParts[pathParts.length - 1];

      if (req.method === "PATCH") {
        try {
          const params = UpdateWarehouseParamsDtoSchema.parse({ id });
          const body = UpdateWarehouseRequestDtoSchema.parse(await req.json());
          logger.debug`PATCH /${id} - body: ${JSON.stringify(body)}`;
          const result = await controller.updateWarehouse(params.id, body);
          return Response.json(result, { headers: DEFAULT_CORS_HEADERS });
        } catch (error: unknown) {
          return handleErrorResponse(error);
        }
      }

      if (req.method === "DELETE") {
        try {
          const params = DeleteWarehouseParamsDtoSchema.parse({ id });
          logger.debug`DELETE /${id}`;
          await controller.deleteWarehouse(params.id);
          return new Response(null, { status: 204, headers: DEFAULT_CORS_HEADERS });
        } catch (error: unknown) {
          return handleErrorResponse(error);
        }
      }

      return new Response("Method Not Allowed", { status: 405, headers: DEFAULT_CORS_HEADERS });
    },
  };
}
