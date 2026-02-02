import { configureLogger, DEFAULT_CORS_HEADERS, getCategoryLogger } from "@scos/shared";
import { ordersController } from "./composition-root";
import { appConfig } from "./config/app-config";
import { withLogging } from "./presentation/middleware/logging-middleware";
import { createOrderRoutes } from "./presentation/routes/orders.routes";

async function createServer(options: {
  port: number;
  routes: Record<string, (req: Request) => Response | Promise<Response>>;
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
}

await createServer({
  port: appConfig.port,
  routes: withLogging(createOrderRoutes(ordersController)),
});
