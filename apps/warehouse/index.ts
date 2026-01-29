const PORT = process.env.PORT || 3002;

const server = Bun.serve({
  port: PORT,
  fetch(request) {
    return new Response("Warehouse Service is running");
  },
});

console.log(`Warehouse Services is running on ${server.url}`);

