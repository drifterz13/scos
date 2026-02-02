import { ordersController } from "./composition-root";
import { appConfig } from "./config/app-config";
import { configureLogger, getCategoryLogger } from "./infra/logging/logger";
import { withLogging } from "./presentation/middleware/logging-middleware";
import { createOrderRoutes } from "./presentation/routes/orders.routes";

await configureLogger();

const logger = getCategoryLogger(["order-api", "server"]);

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
    ...withLogging(orderRoutes),
  },
  async fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    return new Response("Not Found", { status: 404, headers });
  },
});

logger.info`Order Service is running on ${server.url}`;
