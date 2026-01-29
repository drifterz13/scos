const PORT = process.env.PORT || 3002;

const server = Bun.serve({
  port: PORT,
  fetch(request) {
    return new Response("Order Service is running");
  },
});

console.log(`Order Services is running on ${server.url}`);

