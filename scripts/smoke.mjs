import assert from "node:assert/strict";
const origin = process.env.TEST_ORIGIN || "http://127.0.0.1:3000";
const paths = [
  "/",
  "/portfolio",
  "/services",
  "/services/product",
  "/services/portrait",
  "/pricing",
  "/education",
  "/about",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/tariffs.pdf",
  "/images/hero.webp",
];
for (const path of paths) {
  const res = await fetch(origin + path);
  assert.equal(res.status, 200, path);
  if (!/\.(txt|xml|webmanifest|pdf|webp)$/.test(path)) {
    const html = await res.text();
    assert.match(html, /<h1[ >]/, path);
    assert.match(html, /rel="canonical"/, path);
    assert.match(html, /name="description"/, path);
  }
  console.log("PASS", path);
}
assert.equal((await fetch(origin + "/missing-page")).status, 404);
assert.equal(
  (
    await fetch(origin + "/api/consultation", {
      method: "POST",
      headers: {
        origin: "https://invalid.example",
        "Content-Type": "application/json",
      },
      body: "{}",
    })
  ).status,
  403,
);
assert.equal(
  (
    await fetch(origin + "/api/consultation", {
      method: "POST",
      headers: { origin, "Content-Type": "text/plain" },
      body: "test",
    })
  ).status,
  415,
);
assert.equal(
  (
    await fetch(origin + "/api/consultation", {
      method: "POST",
      headers: { origin, "Content-Type": "application/json" },
      body: '{"name":"x"}',
    })
  ).status,
  400,
);
const data = {
  name: "آزمون خودکار",
  phone: "09120000001",
  service: "عکاسی محصول",
  city: "محل آزمون",
  contactMethod: "تماس",
  description: "درخواست آزمون محلی",
  consent: true,
  idempotencyKey: crypto.randomUUID(),
};
let res = await fetch(origin + "/api/consultation", {
  method: "POST",
  headers: { origin, "Content-Type": "application/json" },
  body: JSON.stringify({ ...data, website: "spam" }),
});
assert.equal(res.status, 400, "honeypot");
res = await fetch(origin + "/api/consultation", {
  method: "POST",
  headers: { origin, "Content-Type": "application/json" },
  body: JSON.stringify({ ...data, consent: false }),
});
assert.equal(res.status, 400, "consent");
res = await fetch(origin + "/api/consultation", {
  method: "POST",
  headers: { origin, "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
assert.equal(res.status, 201, "submission");
const first = await res.json();
assert.match(first.tracking, /^EH-[A-F0-9]{12}$/);
res = await fetch(origin + "/api/consultation", {
  method: "POST",
  headers: { origin, "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
assert.equal((await res.json()).tracking, first.tracking, "idempotency");
console.log(
  "PASS 404, origin, content type, validation, consent, honeypot, durable submission, idempotency",
);
