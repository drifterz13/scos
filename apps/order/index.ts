const PORT = process.env.PORT || 3002;

const server = Bun.serve({
  port: PORT,
  routes: {
    "/": () => new Response("Order Service is running"),
    "/health": () => new Response("OK 1"),
  },
});

console.log(`Order Services is running on ${server.url}`);
