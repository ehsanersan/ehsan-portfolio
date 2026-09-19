import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { randomUUID } from "node:crypto";
process.env.STORAGE_DRIVER = "local";
process.env.LOCAL_DB_PATH = path.join(
  process.cwd(),
  ".data",
  "tests-" + randomUUID() + ".sqlite",
);
import { takeRateLimit, saveLead } from "../lib/storage";
import { leadSchema } from "../lib/validation";
test("durable rate limiting caps concurrent requests", async () => {
  const values = await Promise.all(
    Array.from({ length: 6 }, () => takeRateLimit("test", 3, 60000)),
  );
  assert.equal(values.filter(Boolean).length, 3);
});
test("a retried lead is stored only once", async () => {
  const input = leadSchema.parse({
    name: "آزمایش",
    phone: "09121234567",
    service: "عکاسی محصول",
    city: "محل آزمایش",
    contactMethod: "تماس",
    description: "داده آزمایشی",
    consent: true,
    idempotencyKey: randomUUID(),
  });
  const first = await saveLead("EH-TEST1", input);
  const second = await saveLead("EH-TEST2", input);
  assert.equal(first, second);
});
