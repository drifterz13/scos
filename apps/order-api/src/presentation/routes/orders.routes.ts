import { DEFAULT_CORS_HEADERS, getCategoryLogger } from "@scos/shared";
import { VerifyOrderSchema } from "../../application/dto/verify-order.dto";
import type { OrdersController } from "../controllers/orders.controller";

const logger = getCategoryLogger(["order-api", "routes"]);

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

export function createOrderRoutes(controller: OrdersController) {
  return {
    "/verify": async (req: Request) => {
      if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: DEFAULT_CORS_HEADERS });
      }
      if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers: DEFAULT_CORS_HEADERS });
      }

      try {
        const body = VerifyOrderSchema.parse(await req.json());
        logger.debug`POST /verify - body: ${JSON.stringify(body)}`;
        const result = await controller.verifyOrder(body);

        return Response.json(result, { headers: DEFAULT_CORS_HEADERS });
      } catch (error: unknown) {
        return handleErrorResponse(error);
      }
    },

    "/submit": async (req: Request) => {
      if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: DEFAULT_CORS_HEADERS });
      }
      if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers: DEFAULT_CORS_HEADERS });
      }

      try {
        const body = VerifyOrderSchema.parse(await req.json());
        logger.debug`POST /submit - body: ${JSON.stringify(body)}`;
        const result = await controller.submitOrder(body);

        return Response.json(result, { status: 201, headers: DEFAULT_CORS_HEADERS });
      } catch (error: unknown) {
        return handleErrorResponse(error);
      }
    },
  };
}
