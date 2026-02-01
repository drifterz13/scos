const PORT = process.env.PORT || 3001;

// Helper function to add CORS headers to responses
function addCorsHeaders(response: Response): Response {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);

    // Handle OPTIONS preflight requests
    if (req.method === "OPTIONS") {
      return addCorsHeaders(new Response(null, { status: 204 }));
    }

    // Route handling
    if (url.pathname === "/") {
      return addCorsHeaders(new Response("Order Service is running"));
    }
    if (url.pathname === "/health") {
      return addCorsHeaders(new Response("OK"));
    }

    return addCorsHeaders(new Response("Not Found", { status: 404 }));
  },
});

console.log(`Order Services is running on ${server.url}`);
