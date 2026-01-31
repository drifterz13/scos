const PORT = process.env.PORT || 3002;

const server = Bun.serve({
  port: PORT,
  routes: {
    "/": () => new Response("Warehouse Service is running"),
    "/health": () => new Response("OK 5"),
  },
});

console.log(`Warehouse Services is running on ${server.url}`);
