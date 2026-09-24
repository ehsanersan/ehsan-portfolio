"use client";
import { copyText, copyLink } from "@/lib/content";

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
        {!isStaticPreview && <div className="tracking">{copyText("consultation_form_53b3e0c705")}<strong dir="ltr">{success.tracking}</strong>
        </div>}
        <a
          href={whatsappUrl(success.message)}
          target="_blank"
          rel="noopener noreferrer"
          className="button primary"
        >{copyText("consultation_form_f6b442dc3b")}<Icon name="chat" />
        </a>
      </div>
    );
  return (
    <form ref={ref} onSubmit={submit} className="consultation-form">
      {isStaticPreview && <p className="privacy-note">{copyText("consultation_form_70cd75be19")}</p>}
      <div className="form-steps" aria-label={`مرحله ${step} از ۲`}>
        <span className={step === 1 ? "active" : ""}>{copyText("consultation_form_850e975608")}<b>{copyText("consultation_form_d5f60c0c6f")}</b>
        </span>
        <i />
        <span className={step === 2 ? "active" : ""}>{copyText("consultation_form_a87594cf61")}<b>{copyText("consultation_form_531f828291")}</b>
        </span>
      </div>
      <fieldset data-step="1" hidden={step !== 1}>
        <legend>{copyText("consultation_form_9c0e640b08")}</legend>
        <div className="form-grid">
          <label>{copyText("consultation_form_f0c178cd30")}<span>*</span>
            <select name="service" required defaultValue={initialService}>
              <option value="">{copyText("consultation_form_bfddea31e1")}</option>
              {opts.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>{copyText("consultation_form_8c691ffd46")}<span>*</span>
            <input
              name="city"
              required
              minLength={2}
              maxLength={120}
              autoComplete="address-level2"
              placeholder={copyText("consultation_form_4193096534")}
            />
          </label>
          <label>{copyText("consultation_form_be14dd7ab2")}<input
              name="date"
              maxLength={40}
              placeholder={copyText("consultation_form_ef24bcda8f")}
            />
          </label>
          <label>{copyText("consultation_form_977700b89d")}<input
              name="quantity"
              maxLength={50}
              placeholder={copyText("consultation_form_db72eb1752")}
            />
          </label>
          <label className="full">{copyText("consultation_form_a1399a55cc")}<input
              name="extras"
              maxLength={500}
              placeholder={copyText("consultation_form_c1161a85d5")}
            />
          </label>
        </div>
        <button type="button" onClick={next} className="button primary">{copyText("consultation_form_2608815636")}<Icon name="left" />
        </button>
      </fieldset>
      <fieldset hidden={step !== 2}>
        <legend>{copyText("consultation_form_09383a4b4e")}</legend>
        <div className="form-grid">
          <label>{copyText("consultation_form_4c27c516db")}<span>*</span>
            <input
              name="name"
              required={step === 2}
              minLength={2}
              maxLength={100}
              autoComplete="name"
            />
          </label>
          <label>{copyText("consultation_form_b29f6c4b6d")}<span>*</span>
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              required={step === 2}
              maxLength={20}
              autoComplete="tel"
              placeholder={copyText("consultation_form_176f4e7668")}
              dir="ltr"
            />
          </label>
          <label>{copyText("consultation_form_507a4061d4")}<select
              name="contactMethod"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option>{copyText("consultation_form_e9605b11ee")}</option>
              <option>{copyText("consultation_form_37b0f13c5e")}</option>
              <option>{copyText("consultation_form_75a47f7ff0")}</option>
            </select>
          </label>
          <label>{copyText("consultation_form_e2ffd1e564")}<input name="bestTime" maxLength={100} placeholder={copyText("consultation_form_864e57f649")} />
          </label>
          <label hidden={method !== "اینستاگرام"}>{copyText("consultation_form_607d1013b2")}<span>*</span>
            <input
              name="contactHandle"
              required={step === 2 && method === "اینستاگرام"}
              maxLength={100}
              dir="ltr"
              placeholder={copyText("consultation_form_93100fc44c")}
            />
          </label>
          <label>{copyText("consultation_form_21cb5c9dbd")}<input
              name="budget"
              maxLength={100}
              placeholder={copyText("consultation_form_ecbb2f3584")}
            />
          </label>
          <label>{copyText("consultation_form_a679d6abf0")}<input
              name="reference"
              type="url"
              maxLength={2000}
              dir="ltr"
              placeholder={copyText("consultation_form_ab04e20ed4")}
            />
            <small>{copyText("consultation_form_65a43db033")}</small>
          </label>
          <label className="full">{copyText("consultation_form_529eeb0f67")}<span>*</span>
            <textarea
              name="description"
              required={step === 2}
              minLength={5}
              maxLength={3000}
              rows={4}
              placeholder={copyText("consultation_form_d00fb7b6ea")}
            />
          </label>
        </div>
        <div className="honeypot" aria-hidden="true">
          <label>{copyText("consultation_form_acbe7c091c")}<input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="consent">
          <input type="checkbox" name="consent" required={step === 2} />
          <span>
            {isStaticPreview ? "با آماده‌سازی پیام واتس‌اپ و تماس درباره درخواستم موافقم." : "با ذخیره اطلاعات این فرم و تماس درباره درخواستم موافقم."}{" "}
            <Link href={copyLink("consultation_form_0ece7f7c30")} target="_blank">{copyText("consultation_form_2dbc83047a")}</Link>
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
          >{copyText("consultation_form_5a4d91c474")}</button>
        </div>
      </fieldset>
      {error && (
        <div className="form-error" role="alert">
          {error}
          <br />
          <a href={`tel:${site.phone}`}>{copyText("consultation_form_9639970642")}{site.phoneLabel}</a>
        </div>
      )}
      <p className="form-note">{copyText("consultation_form_60c1943552")}</p>
    </form>
  );
}
