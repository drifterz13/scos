import { createScalarHtml, DEFAULT_CORS_HEADERS, OpenAPIRegistry, OpenApiGeneratorV31 } from "@scos/shared";
import { OrderResponseDtoSchema } from "../../application/dto/order-response.dto";
import {
  FulfillmentPlanDtoSchema,
  OrderPreviewDtoSchema,
  VerifyOrderResponseDtoSchema,
  VerifyOrderSchema,
} from "../../application/dto/verify-order.dto";

const registry = new OpenAPIRegistry();

registry.register(
  "VerifyOrderRequest",
  VerifyOrderSchema.openapi({
    description: "Request body for verifying or submitting an order",
  }),
);

registry.register(
  "OrderPreview",
  OrderPreviewDtoSchema.openapi({
    description: "Order pricing preview with discounts and shipping costs",
  }),
);

registry.register(
  "FulfillmentPlan",
  FulfillmentPlanDtoSchema.openapi({
    description: "Fulfillment plan from a single warehouse",
  }),
);

registry.register(
  "VerifyOrderResponse",
  VerifyOrderResponseDtoSchema.openapi({
    description: "Response for order verification",
  }),
);

registry.register(
  "OrderResponse",
  OrderResponseDtoSchema.openapi({
    description: "Response for submitted order",
  }),
);

registry.registerPath({
  method: "post",
  path: "/verify",
  summary: "Verify an order",
  description: "Validates the order and returns pricing preview with fulfillment plan",
  request: {
    body: {
      content: {
        "application/json": {
          schema: VerifyOrderSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Order verification successful",
      content: {
        "application/json": {
          schema: VerifyOrderResponseDtoSchema,
        },
      },
    },
    400: {
      description: "Validation error",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/submit",
  summary: "Submit an order",
  description: "Creates a new order with the specified quantity and shipping location",
  request: {
    body: {
      content: {
        "application/json": {
          schema: VerifyOrderSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Order created successfully",
      content: {
        "application/json": {
          schema: OrderResponseDtoSchema,
        },
      },
    },
    400: {
      description: "Validation error",
    },
  },
});

const generator = new OpenApiGeneratorV31(registry.definitions);

const openApiSpec = generator.generateDocument({
  openapi: "3.1.0",
  info: {
    title: "Order API",
    version: "1.0.0",
    description: "API for order verification and submission",
  },
});

export function createDocsRoutes() {
  return {
    "/docs": () => {
      const html = createScalarHtml({
        title: "Order API Documentation",
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
