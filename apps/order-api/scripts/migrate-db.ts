import { readdir } from "node:fs/promises";
import { SQL } from "bun";

async function run() {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, NODE_ENV } = Bun.env;
  const sslMode = NODE_ENV === "production" ? "require" : "disable";
  const dbUrl = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslMode=${sslMode}`;

  const sql = new SQL(dbUrl);
  const [result] = await sql`
    SELECT to_regclass('public.migrations') AS table_exists;
  `;
  if (!result.table_exists) {
    await sql.file("migrations/0001_init.sql");
    console.log("Initialized migrations table.");
  }

  const ranMigrations = await sql<{ name: string }[]>`
    SELECT name FROM migrations ORDER BY name ASC;
  `;
  const ranMigrationNames = new Set(ranMigrations.map((row) => row.name));
  const migrationFiles = await readdir("migrations");
  migrationFiles.sort();

  await sql.transaction(async (tx) => {
    for (const fileName of migrationFiles) {
      if (ranMigrationNames.has(fileName) || fileName === "0001_init.sql") {
        continue;
      }

      console.log(`Running migration: ${fileName}`);
      await tx.file(`migrations/${fileName}`);
      await tx`
        INSERT INTO migrations (name) VALUES (${fileName});
      `;
      console.log(`Successfully ran migration: ${fileName}`);
    }
  });
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
