import { appConfig } from "./config/app-config";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const server = Bun.serve({
  port: appConfig.port,
  routes: {
    "/": () => new Response("Order Service is running", { status: 200, headers }),
    "/summary": async () => {
      const response = await fetch(appConfig.warehouseServiceUrl, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        return new Response("Failed to fetch warehouse data", {
          status: 502,
          headers,
        });
      }
      const data = await response.json();

      return Response.json(data);
    },
    "/health": () => new Response("OK", { status: 200, headers }),
  },
  async fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    return new Response("Not Found", { status: 404, headers });
  },
});

console.log(`Order Services is running on ${server.url}`);
