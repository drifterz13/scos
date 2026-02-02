import { $, SQL } from "bun";

async function run() {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, NODE_ENV } = Bun.env;
  const sslMode = NODE_ENV === "production" ? "require" : "disable";
  const dbUrl = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslMode=${sslMode}`;

  const sql = new SQL(dbUrl);

  await sql.transaction(async (tx) => {
    await tx`DROP TABLE IF EXISTS orders;`;
    await tx`DROP TYPE order_status;`;
    await tx`DROP TABLE IF EXISTS migrations;`;
  });

  await $`bun run db:migrate`;

  console.log("Database reset completed.");
}

run().catch((err) => {
  console.error("Database reset failed:", err);
  process.exit(1);
});
