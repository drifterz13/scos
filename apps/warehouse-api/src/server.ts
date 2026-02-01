import { appConfig } from "./config/app-config";
import { sql } from "./infra/db";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const server = Bun.serve({
  port: appConfig.port,
  routes: {
    "/": async () => {
      const [warehouses] = await sql`SELECT * FROM warehouses`;

      return Response.json({ data: warehouses });
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

console.log(`Warehouse Services is running on ${server.url}`);
