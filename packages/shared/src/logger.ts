import { configure, getConsoleSink, getLogger } from "@logtape/logtape";
import { prettyFormatter } from "@logtape/pretty";

let isConfigured = false;

export async function configureLogger(logLevel: "debug" | "info" | "warning" | "error" | "fatal"): Promise<void> {
  if (isConfigured) return;

  await configure({
    sinks: {
      console: getConsoleSink({ formatter: prettyFormatter }),
    },
    filters: {},
    loggers: [
      {
        category: ["logtape", "meta"],
        lowestLevel: "warning",
        sinks: ["console"],
      },
      {
        category: [],
        lowestLevel: logLevel,
        sinks: ["console"],
      },
    ],
  });
  isConfigured = true;
}

export function getCategoryLogger(category: string[]) {
  return getLogger(category);
}
