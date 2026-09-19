import { mkdir } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import type { LeadInput } from "./validation";
let sqlite: import("node:sqlite").DatabaseSync | undefined;
export const sqlSchema = `CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, idempotency_key TEXT UNIQUE NOT NULL, created_at BIGINT NOT NULL, payload TEXT NOT NULL, consent_version TEXT NOT NULL); CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at BIGINT NOT NULL);`;
function driver() {
  const d =
    process.env.STORAGE_DRIVER ||
    (process.env.NODE_ENV === "production" ? "neon" : "local");
  if (d === "local" && process.env.VERCEL)
    throw new Error("Local storage is not durable on Vercel");
  return d;
}
async function local() {
  if (sqlite) return sqlite;
  const file =
    process.env.LOCAL_DB_PATH ||
    path.join(process.cwd(), ".data", "leads.sqlite");
  await mkdir(path.dirname(file), { recursive: true });
  const { DatabaseSync } = await import("node:sqlite");
  sqlite = new DatabaseSync(file);
  sqlite.exec("PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;" + sqlSchema);
  return sqlite;
}
function remote() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
  return neon(process.env.DATABASE_URL);
}
export async function initializeStorage() {
  if (driver() === "local") {
    await local();
    return;
  }
  const sql = remote();
  await sql.query(
    "CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, idempotency_key TEXT UNIQUE NOT NULL, created_at BIGINT NOT NULL, payload TEXT NOT NULL, consent_version TEXT NOT NULL)",
  );
  await sql.query(
    "CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at BIGINT NOT NULL)",
  );
}
export async function takeRateLimit(
  key: string,
  max: number,
  windowMs: number,
) {
  const now = Date.now();
  const expiry = now + windowMs;
  if (driver() === "local") {
    const db = await local();
    const result = db
      .prepare(
        "INSERT INTO rate_limits(key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN rate_limits.expires_at < ? THEN 1 ELSE rate_limits.count+1 END, expires_at=CASE WHEN rate_limits.expires_at < ? THEN ? ELSE rate_limits.expires_at END RETURNING count",
      )
      .get(key, expiry, now, now, expiry) as { count: number };
    return result.count <= max;
  }
  const sql = remote();
  const rows =
    await sql`INSERT INTO rate_limits(key,count,expires_at) VALUES (${key},1,${expiry}) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN rate_limits.expires_at < ${now} THEN 1 ELSE rate_limits.count+1 END, expires_at=CASE WHEN rate_limits.expires_at < ${now} THEN ${expiry} ELSE rate_limits.expires_at END RETURNING count`;
  return Number(rows[0].count) <= max;
}
export async function saveLead(id: string, input: LeadInput) {
  const { website: _, idempotencyKey, ...safe } = input;
  const payload = JSON.stringify(safe);
  const now = Date.now();
  const cutoff = now - 180 * 86400000;
  if (driver() === "local") {
    const db = await local();
    db.prepare(
      "INSERT INTO leads(id,idempotency_key,created_at,payload,consent_version) VALUES (?,?,?,?,?) ON CONFLICT(idempotency_key) DO NOTHING",
    ).run(id, idempotencyKey, now, payload, "1.0");
    const row = db
      .prepare("SELECT id FROM leads WHERE idempotency_key=?")
      .get(idempotencyKey) as { id: string };
    db.prepare("DELETE FROM leads WHERE created_at < ?").run(cutoff);
    db.prepare("DELETE FROM rate_limits WHERE expires_at < ?").run(now);
    return row.id;
  }
  const sql = remote();
  await sql`INSERT INTO leads(id,idempotency_key,created_at,payload,consent_version) VALUES (${id},${idempotencyKey},${now},${payload},'1.0') ON CONFLICT(idempotency_key) DO NOTHING`;
  const rows =
    await sql`SELECT id FROM leads WHERE idempotency_key=${idempotencyKey}`;
  await sql`DELETE FROM leads WHERE created_at < ${cutoff}`;
  await sql`DELETE FROM rate_limits WHERE expires_at < ${now}`;
  return String(rows[0].id);
}
