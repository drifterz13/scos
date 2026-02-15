import { createScalarHtml, DEFAULT_CORS_HEADERS, OpenAPIRegistry, OpenApiGeneratorV31 } from "@scos/shared";
import { z } from "zod";
import {
  CreateWarehouseRequestDtoSchema,
  CreateWarehouseResponseDtoSchema,
} from "../../application/dto/create-warehouse.dto";
import {
  UpdateWarehouseRequestDtoSchema,
  UpdateWarehouseResponseDtoSchema,
} from "../../application/dto/update-warehouse.dto";
import { WarehouseDtoSchema, WarehousesResponseDtoSchema } from "../../application/dto/warehouse.dto";

const registry = new OpenAPIRegistry();

registry.register(
  "Warehouse",
  WarehouseDtoSchema.openapi({
    description: "Warehouse with location and stock information",
  }),
);

registry.register(
  "WarehousesResponse",
  WarehousesResponseDtoSchema.openapi({
    description: "Response containing list of warehouses",
  }),
);

registry.register(
  "CreateWarehouseRequest",
  CreateWarehouseRequestDtoSchema.openapi({
    description: "Request to create a new warehouse",
  }),
);

registry.register(
  "CreateWarehouseResponse",
  CreateWarehouseResponseDtoSchema.openapi({
    description: "Response after creating a warehouse",
  }),
);

registry.register(
  "UpdateWarehouseRequest",
  UpdateWarehouseRequestDtoSchema.openapi({
    description: "Request to update warehouse details (partial update)",
  }),
);

registry.register(
  "UpdateWarehouseResponse",
  UpdateWarehouseResponseDtoSchema.openapi({
    description: "Response after updating a warehouse",
  }),
);

registry.registerPath({
  method: "get",
  path: "/list",
  summary: "List all warehouses",
  description: "Returns all warehouses with their current stock levels",
  responses: {
    200: {
      description: "List of warehouses",
      content: {
        "application/json": {
          schema: WarehousesResponseDtoSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/",
  summary: "Create new warehouse",
  description: "Creates a new warehouse with the specified name, location, and optional initial stock",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateWarehouseRequestDtoSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Warehouse created successfully",
      content: {
        "application/json": {
          schema: CreateWarehouseResponseDtoSchema,
        },
      },
    },
    400: {
      description: "Invalid request data",
    },
    500: {
      description: "Internal server error",
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/{id}",
  summary: "Update warehouse",
  description: "Updates an existing warehouse's details. At least one field must be provided.",
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        "application/json": {
          schema: UpdateWarehouseRequestDtoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Warehouse updated successfully",
      content: {
        "application/json": {
          schema: UpdateWarehouseResponseDtoSchema,
        },
      },
    },
    400: {
      description: "Invalid request data",
    },
    500: {
      description: "Warehouse not found or internal server error",
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/{id}",
  summary: "Delete warehouse",
  description: "Deletes a warehouse by ID",
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    204: {
      description: "Warehouse deleted successfully",
    },
    400: {
      description: "Invalid warehouse ID",
    },
    500: {
      description: "Warehouse not found or internal server error",
    },
  },
});

const generator = new OpenApiGeneratorV31(registry.definitions);

const openApiSpec = generator.generateDocument({
  openapi: "3.1.0",
  info: {
    title: "Warehouse API",
    version: "1.0.0",
    description: "API for warehouse and inventory management",
  },
});

export function createDocsRoutes() {
  return {
    "/docs": () => {
      const html = createScalarHtml({
        title: "Warehouse API Documentation",
        specUrl: "./openapi.json",
      });
      return new Response(html, {
        headers: {
          ...DEFAULT_CORS_HEADERS,
          "Content-Type": "text/html",
        },
      });
    },
    "/openapi.json": () => {
      return Response.json(openApiSpec, {
        headers: DEFAULT_CORS_HEADERS,
      });
    },
  };
}
