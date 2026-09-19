import env from "@next/env";
import { neon } from "@neondatabase/serverless";
import { mkdir } from "node:fs/promises";
env.loadEnvConfig(process.cwd());
const schema = [
  "CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, idempotency_key TEXT UNIQUE NOT NULL, created_at BIGINT NOT NULL, payload TEXT NOT NULL, consent_version TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at BIGINT NOT NULL)",
];
if (process.env.STORAGE_DRIVER === "local" && !process.env.VERCEL) {
  await mkdir(".data", { recursive: true });
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(".data/leads.sqlite");
  for (const statement of schema) db.exec(statement);
  db.close();
} else {
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL");
  const sql = neon(process.env.DATABASE_URL);
  for (const statement of schema) await sql.query(statement);
}
console.log("Database schema is ready.");
