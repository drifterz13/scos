import { getCategoryLogger } from "./logger";

const logger = getCategoryLogger(["warehouse-api", "http"]);

export interface RequestLog {
  method: string;
  url: string;
  statusCode: number;
  duration: number;
}

export function logRequest(config: RequestLog): void {
  const { method, url, statusCode, duration } = config;

  if (statusCode >= 500) {
    logger.error`${method} ${url} - ${statusCode} (${duration}ms)`;
  } else if (statusCode >= 400) {
    logger.warn`${method} ${url} - ${statusCode} (${duration}ms)`;
  } else {
    logger.info`${method} ${url} - ${statusCode} (${duration}ms)`;
  }
}

export function logError(context: string, error: unknown): void {
  logger.error`[${context}] Error: ${error instanceof Error ? error.message : String(error)}`;
  if (error instanceof Error && error.stack) {
    logger.debug`[${context}] Stack: ${error.stack}`;
  }
}
