import { z } from "zod";
export function normalizeDigits(v: string) {
  return v
    .replace(/[۰-۹]/g, (c) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(c)))
    .replace(/[٠-٩]/g, (c) => String("٠١٢٣٤٥٦٧٨٩".indexOf(c)));
}
export function normalizePhone(v: string) {
  return normalizeDigits(v)
    .replace(/[\s()-]/g, "")
    .replace(/^(\+98|0098|98)/, "0");
}
const text = (max: number) =>
  z.string().trim().max(max, "متن واردشده بیش از حد طولانی است.");
export const leadSchema = z
  .object({
    name: text(100).min(2, "نام و نام خانوادگی را وارد کنید."),
    phone: z
      .string()
      .transform(normalizePhone)
      .pipe(z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید.")),
    service: text(120).min(2, "نوع خدمت را انتخاب کنید."),
    date: text(40).default(""),
    city: text(120).min(2, "شهر یا محل پروژه را وارد کنید."),
    budget: text(100).default(""),
    contactMethod: z.enum(["تماس", "واتس‌اپ", "اینستاگرام"]),
    contactHandle: text(100).default(""),
    bestTime: text(100).default(""),
    description: text(3000).min(5, "کمی درباره پروژه بنویسید."),
    reference: z
      .union([z.literal(""), z.url({ protocol: /^https?$/ })])
      .default(""),
    quantity: text(50).default(""),
    extras: text(500).default(""),
    plan: text(60).default(""),
    intent: z.enum(["consultation", "estimate"]).default("consultation"),
    consent: z.literal(true, { error: "رضایت برای تماس لازم است." }),
    website: text(200).default(""),
    idempotencyKey: z.uuid(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.contactMethod === "اینستاگرام" && !data.contactHandle.trim())
      ctx.addIssue({
        code: "custom",
        path: ["contactHandle"],
        message: "شناسه اینستاگرام را وارد کنید.",
      });
  });
export type LeadInput = z.infer<typeof leadSchema>;
