import { VerifyOrderSchema } from "../../application/dto/verify-order.dto";
import type { OrdersController } from "../controllers/orders.controller";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function createOrderRoutes(controller: OrdersController) {
  return {
    "/api/orders/verify": async (req: Request) => {
      if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers });
      }

      try {
        const body = VerifyOrderSchema.parse(await req.json());
        const result = await controller.verifyOrder(body);
        return Response.json(result, { headers });
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "ZodError") {
          return new Response(error.message, { status: 400, headers });
        }
        return new Response(error instanceof Error ? error.message : "Unknown error", { status: 500, headers });
      }
    },

    "/api/orders/submit": async (req: Request) => {
      if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers });
      }

      try {
        const body = VerifyOrderSchema.parse(await req.json());
        const result = await controller.submitOrder(body);
        return Response.json(result, { status: 201, headers });
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "ZodError") {
          return new Response(error.message, { status: 400, headers });
        }
        return new Response(error instanceof Error ? error.message : "Unknown error", { status: 500, headers });
      }
    },
  };
}
