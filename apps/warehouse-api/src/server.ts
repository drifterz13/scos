import { dispose } from "@logtape/logtape";
import { configureLogger, DEFAULT_CORS_HEADERS, getCategoryLogger } from "@scos/shared";
import { messageConsumer, warehousesController } from "./composition-root";
import { appConfig } from "./config/app-config";
import { withLogging } from "./presentation/middleware/logging-middleware";
import { createDocsRoutes } from "./presentation/routes/docs.routes";
import { createWarehouseRoutes } from "./presentation/routes/warehouses.routes";

async function createServer(options: {
  port: number;
  routes: Record<string, (req: Request) => Response | Promise<Response>>;
  consumer?: { start: () => Promise<void>; stop: () => Promise<void> };
}) {
  await configureLogger(appConfig.logLevel);

  const logger = getCategoryLogger(["server"]);

  const allRoutes = {
    "/health": () => new Response("OK", { status: 200, headers: DEFAULT_CORS_HEADERS }),
    ...options.routes,
  };

  const server = Bun.serve({
    port: options.port,
    routes: allRoutes,
    async fetch(req) {
      if (req.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: DEFAULT_CORS_HEADERS,
        });
      }

      return new Response("Not Found", {
        status: 404,
        headers: DEFAULT_CORS_HEADERS,
      });
    },
  });

  logger.info`Server is running on ${server.url}`;

  if (options.consumer) {
    options.consumer.start().catch((error) => {
      logger.error`Message consumer error: ${error}`;
    });
  }

  const shutdown = async () => {
    try {
      logger.info`Shutting down gracefully...`;
      if (options.consumer) {
        await options.consumer.stop();
      }
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
}

await createServer({
  port: appConfig.port,
  routes: {
    ...withLogging(createWarehouseRoutes(warehousesController)),
    ...createDocsRoutes(),
  },
  consumer: messageConsumer,
});
