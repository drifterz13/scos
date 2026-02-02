import { ordersController } from "./composition-root";
import { appConfig } from "./config/app-config";
import { createOrderRoutes } from "./presentation/routes/orders.routes";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const orderRoutes = createOrderRoutes(ordersController);

const server = Bun.serve({
  port: appConfig.port,
  routes: {
    "/": () => new Response("Order Service is running", { status: 200, headers }),
    "/health": () => new Response("OK", { status: 200, headers }),
    ...orderRoutes,
  },
  async fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    return new Response("Not Found", { status: 404, headers });
  },
});

console.log(`Order Services is running on ${server.url}`);
