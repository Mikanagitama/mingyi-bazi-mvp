import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const root = process.cwd();
const schemaPath = path.join(root, "src", "lib", "db", "schema.sql");
const dryRun = process.argv.includes("--dry-run");

function readSchema() {
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found: ${schemaPath}`);
  }

  const schema = fs.readFileSync(schemaPath, "utf8");
  const requiredFragments = [
    "create table if not exists readings",
    "create table if not exists payments",
    "payment_status",
    "stripe_session_id"
  ];

  for (const fragment of requiredFragments) {
    if (!schema.toLowerCase().includes(fragment)) {
      throw new Error(`Schema is missing required fragment: ${fragment}`);
    }
  }

  return schema;
}

const schema = readSchema();

if (dryRun) {
  console.log("Database setup dry run passed.");
  console.log(`Schema: ${schemaPath}`);
  process.exit(0);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required to run database setup.");
  console.error("Use npm run db:setup:dry to validate the schema without connecting.");
  process.exit(1);
}

const sql = postgres(databaseUrl, {
  ssl: "require",
  max: 1
});

try {
  await sql.unsafe(schema);
  console.log("Database setup completed.");
} finally {
  await sql.end();
}
