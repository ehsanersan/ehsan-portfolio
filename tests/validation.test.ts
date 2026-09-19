import { test } from "node:test";
import assert from "node:assert/strict";
import { leadSchema, normalizePhone } from "../lib/validation";
import { answerQuestion } from "../lib/assistant";
const valid = {
  name: "کاربر آزمایشی",
  phone: "۰۹۱۲۱۲۳۴۵۶۷",
  service: "عکاسی محصول",
  city: "محل آزمایش",
  contactMethod: "تماس",
  description: "درخواست آزمایشی برای بررسی فرم",
  consent: true,
  idempotencyKey: "550e8400-e29b-41d4-a716-446655440000",
};
test("Persian and international phone formats normalize", () => {
  assert.equal(normalizePhone("+98 912 123 4567"), "09121234567");
  assert.equal(leadSchema.parse(valid).phone, "09121234567");
});
test("consent, phone and safe URL are mandatory", () => {
  for (const change of [
    { consent: false },
    { phone: "123" },
    { reference: "javascript:alert(1)" },
    { reference: "file:///secret" },
    { city: "" },
  ])
    assert.equal(leadSchema.safeParse({ ...valid, ...change }).success, false);
});
test("Instagram preference requires an account", () => {
  assert.equal(
    leadSchema.safeParse({ ...valid, contactMethod: "اینستاگرام" }).success,
    false,
  );
});
test("unknown fields and oversized text rejected", () => {
  assert.equal(leadSchema.safeParse({ ...valid, admin: true }).success, false);
  assert.equal(
    leadSchema.safeParse({ ...valid, description: "x".repeat(3001) }).success,
    false,
  );
});
test("assistant returns known answer and honest fallback", () => {
  assert.equal(answerQuestion("قیمت عکاسی محصول").fallback, false);
  assert.equal(
    answerQuestion("آیا فردا ساعت هفت وقت قطعی دارید؟").fallback,
    true,
  );
});
