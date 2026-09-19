import { access, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
try {
  await access(".env.local");
  console.log(".env.local already exists; preserved.");
} catch {
  await writeFile(
    ".env.local",
    `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000\nSTORAGE_DRIVER=local\nRATE_LIMIT_SECRET=${randomBytes(32).toString("hex")}\nTRUST_PROXY=false\n`,
    { mode: 0o600 },
  );
  console.log("Local configuration created; no secrets printed.");
}
