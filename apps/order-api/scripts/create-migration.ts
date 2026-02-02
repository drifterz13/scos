import path from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    name: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

const migrationDir = path.join(__dirname, "..", "migrations");
const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const fileName = `${timestamp}_${values.name}.sql`;
const filePath = path.join(migrationDir, fileName);

const template = `-- Migration: ${values.name}
-- Created at: ${new Date().toISOString()}

-- Write your SQL migration commands below
`;

await Bun.write(filePath, template);
console.log(`Created migration file: ${filePath}`);
