import { dispose } from "@logtape/logtape";
import { messageConsumer, warehousesController } from "./composition-root";
import { appConfig } from "./config/app-config";
import { configureLogger, getCategoryLogger } from "./infra/logging/logger";
import { withLogging } from "./presentation/middleware/logging-middleware";
import { createWarehouseRoutes } from "./presentation/routes/warehouses.routes";

await configureLogger();
const logger = getCategoryLogger(["warehouse-api", "server"]);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const warehouseRoutes = createWarehouseRoutes(warehousesController);

const server = Bun.serve({
  port: appConfig.port,
  routes: {
    "/": () => new Response("Warehouse Service is running", { status: 200, headers }),
    "/health": () => new Response("OK", { status: 200, headers }),
    ...withLogging(warehouseRoutes),
  },
  async fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    return new Response("Not Found", { status: 404, headers });
  },
});

logger.info`Warehouse Service is running on ${server.url}`;

messageConsumer.start().catch((error) => {
  logger.error`Message consumer error: ${error}`;
});

const shutdown = async () => {
  try {
    logger.info`Shutting down gracefully...`;
    await messageConsumer.stop();
    await server.stop(true);
    await dispose();
    process.exit(0);
  } catch (error) {
    logger.error`Error during shutdown: ${error}`;
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
