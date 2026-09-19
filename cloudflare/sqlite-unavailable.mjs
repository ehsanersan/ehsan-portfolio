// Local SQLite is intentionally unavailable in a serverless worker.
// Production uses the HTTP Neon adapter, selected with STORAGE_DRIVER=neon.
export class DatabaseSync { constructor(){throw new Error('Use STORAGE_DRIVER=neon on Cloudflare.')} }
