import { getCategoryLogger } from "@scos/shared";
import { logRequest } from "../../infra/logging/request-logger";

const logger = getCategoryLogger(["warehouse-api", "middleware"]);

export function withLogging(
  routes: Record<string, (req: Request) => Response | Promise<Response>>,
): Record<string, (req: Request) => Promise<Response>> {
  return Object.fromEntries(
    Object.entries(routes).map(([path, handler]) => [
      path,
      async (req: Request) => {
        const startTime = Date.now();

        try {
          const response = await handler(req);
          const duration = Date.now() - startTime;

          logRequest({
            method: req.method,
            url: path,
            statusCode: response.status,
            duration,
          });

          return response;
        } catch (error) {
          logger.error`Error in ${path}: ${error}`;
          throw error;
        }
      },
    ]),
  );
}
