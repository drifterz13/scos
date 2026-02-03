import { createScalarHtml, DEFAULT_CORS_HEADERS, OpenAPIRegistry, OpenApiGeneratorV31 } from "@scos/shared";
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
