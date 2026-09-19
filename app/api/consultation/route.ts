import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomBytes } from "node:crypto";
import { leadSchema } from "@/lib/validation";
import { saveLead, takeRateLimit } from "@/lib/storage";
export const runtime = "nodejs";
const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(request: NextRequest) {
  const requestOrigin = request.headers.get("origin");
  const expected = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url)
    .origin;
  if (requestOrigin !== expected)
    return json({ error: "مبدأ درخواست مجاز نیست." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return json({ error: "قالب درخواست معتبر نیست." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 16000)
    return json({ error: "حجم درخواست بیش از حد مجاز است." }, 413);
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret || secret.length < 32)
    return json(
      {
        error:
          "ثبت آنلاین هنوز فعال نشده است. لطفاً از تماس یا واتس‌اپ استفاده کنید.",
      },
      503,
    );
  try {
    const trusted = process.env.TRUST_PROXY === "true";
    const ip =
      trusted && process.env.HOSTING_PLATFORM === "cloudflare"
        ? request.headers.get("cf-connecting-ip") || "unknown"
        : trusted && process.env.VERCEL
          ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            "unknown"
          : "local";
    const hash = (v: string) =>
      createHmac("sha256", secret).update(v).digest("hex");
    if (!(await takeRateLimit("ip:" + hash(ip), 10, 15 * 60 * 1000)))
      return json(
        {
          error:
            "تعداد درخواست‌ها زیاد است. ۱۵ دقیقه دیگر تلاش کنید یا مستقیم تماس بگیرید.",
        },
        429,
      );
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "درخواست خالی است." }, 400);
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16000) {
        await reader.cancel();
        return json({ error: "حجم درخواست بیش از حد مجاز است." }, 413);
      }
      chunks.push(value);
    }
    let data: unknown;
    try {
      data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return json({ error: "اطلاعات درخواست معتبر نیست." }, 400);
    }
    const parsed = leadSchema.safeParse(data);
    if (!parsed.success)
      return json({ error: parsed.error.issues[0].message }, 400);
    if (parsed.data.website) return json({ error: "درخواست معتبر نیست." }, 400);
    if (
      !(await takeRateLimit(
        "phone:" + hash(parsed.data.phone),
        3,
        60 * 60 * 1000,
      ))
    )
      return json(
        {
          error:
            "برای این شماره چند درخواست ثبت شده است. یک ساعت دیگر تلاش کنید یا مستقیم تماس بگیرید.",
        },
        429,
      );
    const tracking = await saveLead(
      "EH-" + randomBytes(6).toString("hex").toUpperCase(),
      parsed.data,
    );
    return json({ tracking }, 201);
  } catch {
    return json(
      {
        error:
          "ذخیره درخواست انجام نشد. لطفاً دوباره تلاش کنید یا از واتس‌اپ استفاده کنید.",
      },
      503,
    );
  }
}
