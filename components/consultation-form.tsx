"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { services, pricingCategories, site, whatsappUrl } from "@/lib/content";
import { leadSchema } from "@/lib/validation";
import { Icon } from "./icon";
import { assetPath, isStaticPreview } from "@/lib/paths";
export function ConsultationForm({
  initialService = "",
  initialPlan = "",
  estimate = false,
}: {
  initialService?: string;
  initialPlan?: string;
  estimate?: boolean;
}) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("تماس");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    tracking: string;
    message: string;
  } | null>(null);
  const ref = useRef<HTMLFormElement>(null);
  const key = useRef("");
  const opts = Array.from(
    new Set(
      [
        ...services.map((s) => s.title),
        ...pricingCategories,
        initialService,
      ].filter(Boolean),
    ),
  );
  function next() {
    const form = ref.current!;
    const fields = Array.from(
      form.querySelectorAll<HTMLElement>(
        '[data-step="1"] input,[data-step="1"] select',
      ),
    );
    for (const field of fields) {
      if (!(field as HTMLInputElement).reportValidity()) return;
    }
    setError("");
    setStep(2);
    setTimeout(
      () => form.querySelector<HTMLInputElement>('[name="name"]')?.focus(),
      0,
    );
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    if (!key.current) key.current = crypto.randomUUID();
    const data = {
      ...Object.fromEntries(f),
      consent: f.get("consent") === "on",
      idempotencyKey: key.current,
      intent: estimate ? "estimate" : "consultation",
      plan: initialPlan,
    };
    const parsed = leadSchema.safeParse(data);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    if (isStaticPreview) {
      const d = parsed.data;
      setSuccess({tracking: "", message: `سلام آقای احترامی، برای ${estimate ? "برآورد اولیه" : "مشاوره"} پیام می‌دهم.\nنام: ${d.name}\nشماره: ${d.phone}\nخدمت: ${d.service}\nشهر: ${d.city}\n${Object.entries(d).filter(([k,v]) => !["name","phone","service","city","consent","idempotencyKey","website","intent"].includes(k) && v).map(([k,v]) => `${({date:"تاریخ",budget:"بودجه",contactMethod:"روش تماس",bestTime:"زمان تماس",description:"توضیحات",reference:"لینک مرجع",quantity:"تعداد",extras:"خدمات اضافه",contactHandle:"شناسه تماس",plan:"پلن",intent:"نوع درخواست"} as Record<string,string>)[k] || k}: ${v}`).join("\n")}`});
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(assetPath("/api/consultation")!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "ارسال انجام نشد. لطفاً دوباره تلاش کنید.",
        );
      setSuccess({
        tracking: result.tracking,
        message: `سلام آقای احترامی، درخواست من با کد ${result.tracking} ثبت شد.\nنام: ${parsed.data.name}\nخدمت: ${parsed.data.service}\nشهر: ${parsed.data.city}\n${parsed.data.description}`,
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "ارتباط برقرار نشد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (success)
    return (
      <div className="form-success" role="status">
        <span className="success-icon">
          <Icon name="check" size={32} />
        </span>
        <h2>
          {isStaticPreview ? "پیام شما آمادهٔ ارسال است." : estimate
            ? "درخواست برآورد اولیه ثبت شد."
            : "درخواست شما با موفقیت ثبت شد."}
        </h2>
        <p>
          {isStaticPreview ? "هنوز درخواستی ارسال یا ذخیره نشده است. دکمهٔ زیر را انتخاب کنید و پیام آماده را در واتس‌اپ ارسال کنید." : "اطلاعات شما برای بررسی ذخیره شد. ثبت درخواست به معنی تأیید رزرو یا قیمت قطعی نیست."}
        </p>
        {!isStaticPreview && <div className="tracking">
          کد پیگیری <strong dir="ltr">{success.tracking}</strong>
        </div>}
        <a
          href={whatsappUrl(success.message)}
          target="_blank"
          rel="noopener noreferrer"
          className="button primary"
        >
          ادامه گفت‌وگو در واتس‌اپ <Icon name="chat" />
        </a>
      </div>
    );
  return (
    <form ref={ref} onSubmit={submit} className="consultation-form">
      {isStaticPreview && <p className="privacy-note">در این نسخه، فرم پیام درخواست شما را برای واتس‌اپ آماده می‌کند. ارسال نهایی با خود شماست و اطلاعات در سایت ذخیره نمی‌شود.</p>}
      <div className="form-steps" aria-label={`مرحله ${step} از ۲`}>
        <span className={step === 1 ? "active" : ""}>
          ۱ <b>درباره پروژه</b>
        </span>
        <i />
        <span className={step === 2 ? "active" : ""}>
          ۲ <b>راه ارتباطی</b>
        </span>
      </div>
      <fieldset data-step="1" hidden={step !== 1}>
        <legend>از پروژه‌تان بگویید</legend>
        <div className="form-grid">
          <label>
            نوع خدمات <span>*</span>
            <select name="service" required defaultValue={initialService}>
              <option value="">انتخاب کنید</option>
              {opts.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            شهر یا محل پروژه <span>*</span>
            <input
              name="city"
              required
              minLength={2}
              maxLength={120}
              autoComplete="address-level2"
              placeholder="شهر و محل پیشنهادی"
            />
          </label>
          <label>
            تاریخ احتمالی پروژه
            <input
              name="date"
              maxLength={40}
              placeholder="مثلاً مهر ۱۴۰۵؛ هنوز قطعی نیست"
            />
          </label>
          <label>
            تعداد عکس یا مدت پروژه
            <input
              name="quantity"
              maxLength={50}
              placeholder="مثلاً ۱۰ عکس یا یک جلسه"
            />
          </label>
          <label className="full">
            خدمات تکمیلی موردنیاز
            <input
              name="extras"
              maxLength={500}
              placeholder="مثلاً روتوش، تدوین یا عکاسی در محل"
            />
          </label>
        </div>
        <button type="button" onClick={next} className="button primary">
          ادامه؛ اطلاعات تماس <Icon name="left" />
        </button>
      </fieldset>
      <fieldset hidden={step !== 2}>
        <legend>گفت‌وگو را از کجا شروع کنیم؟</legend>
        <div className="form-grid">
          <label>
            نام و نام خانوادگی <span>*</span>
            <input
              name="name"
              required={step === 2}
              minLength={2}
              maxLength={100}
              autoComplete="name"
            />
          </label>
          <label>
            شماره موبایل <span>*</span>
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              required={step === 2}
              maxLength={20}
              autoComplete="tel"
              placeholder="۰۹۱۲۱۲۳۴۵۶۷"
              dir="ltr"
            />
          </label>
          <label>
            روش تماس ترجیحی
            <select
              name="contactMethod"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option>تماس</option>
              <option>واتس‌اپ</option>
              <option>اینستاگرام</option>
            </select>
          </label>
          <label>
            بهترین زمان تماس
            <input name="bestTime" maxLength={100} placeholder="مثلاً عصرها" />
          </label>
          <label hidden={method !== "اینستاگرام"}>
            شناسه اینستاگرام <span>*</span>
            <input
              name="contactHandle"
              required={step === 2 && method === "اینستاگرام"}
              maxLength={100}
              dir="ltr"
              placeholder="@username"
            />
          </label>
          <label>
            بودجه حدودی (اختیاری)
            <input
              name="budget"
              maxLength={100}
              placeholder="بازه بودجه به تومان"
            />
          </label>
          <label>
            لینک نمونه یا فایل مرجع
            <input
              name="reference"
              type="url"
              maxLength={2000}
              dir="ltr"
              placeholder="https://…"
            />
            <small>لینک عکس یا پوشه اشتراکی را وارد کنید.</small>
          </label>
          <label className="full">
            توضیحات پروژه <span>*</span>
            <textarea
              name="description"
              required={step === 2}
              minLength={5}
              maxLength={3000}
              rows={4}
              placeholder="چه تصویری در ذهن دارید؟"
            />
          </label>
        </div>
        <div className="honeypot" aria-hidden="true">
          <label>
            این قسمت خالی بماند
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="consent">
          <input type="checkbox" name="consent" required={step === 2} />
          <span>
            {isStaticPreview ? "با آماده‌سازی پیام واتس‌اپ و تماس درباره درخواستم موافقم." : "با ذخیره اطلاعات این فرم و تماس درباره درخواستم موافقم."}{" "}
            <Link href="/privacy" target="_blank">
              حریم خصوصی
            </Link>
          </span>
        </label>
        <div className="form-buttons">
          <button type="submit" disabled={busy} className="button primary">
            {busy
              ? "در حال ثبت…"
              : isStaticPreview
                ? "آماده‌سازی پیام واتس‌اپ"
                : estimate
                ? "ثبت درخواست برآورد اولیه"
                : "ثبت درخواست مشاوره"}
            <Icon name="arrow" />
          </button>
          <button
            type="button"
            disabled={busy}
            className="button"
            onClick={() => setStep(1)}
          >
            مرحله قبل
          </button>
        </div>
      </fieldset>
      {error && (
        <div className="form-error" role="alert">
          {error}
          <br />
          <a href={`tel:${site.phone}`}>تماس مستقیم: {site.phoneLabel}</a>
        </div>
      )}
      <p className="form-note">
        مشاوره اولیه رایگان است. قیمت و زمان پروژه پس از بررسی نهایی می‌شود.
      </p>
    </form>
  );
}
