import { messageConsumer, warehousesController } from "./composition-root";
import { appConfig } from "./config/app-config";
import { createWarehouseRoutes } from "./presentation/routes/warehouses.routes";

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
    ...warehouseRoutes,
  },
  async fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    return new Response("Not Found", { status: 404, headers });
  },
});

console.log(`Warehouse Services is running on ${server.url}`);

// Start message consumer as background process
messageConsumer.start().catch((error) => {
  console.error("Message consumer error:", error);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down gracefully...");
  await messageConsumer.stop();
  server.stop();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
