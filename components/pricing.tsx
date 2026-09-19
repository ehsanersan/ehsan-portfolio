"use client";
import { assetPath } from "@/lib/paths";
import { useState } from "react";
import Link from "next/link";
import { pricingCategories, plans, site } from "@/lib/content";
import { Icon } from "./icon";
export function Pricing() {
  const [category, setCategory] = useState(pricingCategories[0]);
  return (
    <>
      <label className="pricing-select">
        تعرفه کدام خدمت را می‌خواهید؟
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {pricingCategories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <div className="plans">
        {plans.map((p, i) => (
          <article
            className={`plan ${i === 1 ? "highlight" : ""}`}
            key={p.name}
          >
            <span className="eyebrow">{p.note}</span>
            <h2>{p.name}</h2>
            <p className="plan-category">{category}</p>
            <strong className="plan-price">تماس برای استعلام</strong>
            <ul>
              {p.items.map((x) => (
                <li key={x}>
                  <Icon name="check" size={17} />
                  {x}
                </li>
              ))}
            </ul>
            <dl>
              <dt>تعداد / مدت</dt>
              <dd>{p.quantity}</dd>
              <dt>سطح ادیت</dt>
              <dd>{p.edit}</dd>
              <dt>زمان تحویل</dt>
              <dd>{p.delivery}</dd>
              <dt>خدمات اضافه</dt>
              <dd>{p.extras}</dd>
            </dl>
            <Link
              href={`/contact?service=${encodeURIComponent(category)}&plan=${encodeURIComponent(p.name)}`}
              className={`button ${i === 1 ? "primary" : ""}`}
            >
              استعلام قیمت <Icon name="arrow" />
            </Link>
            <Link
              className="plan-secondary"
              href={`/contact?service=${encodeURIComponent(category)}&plan=${encodeURIComponent(p.name)}`}
            >
              مشاوره این پروژه
            </Link>
          </article>
        ))}
      </div>
      <div className="pricing-note">
        <p>
          دامنه هر پلن پس از شناخت پروژه نهایی می‌شود. هیچ مبلغ یا زمان تحویلی
          بدون بررسی، قطعی نیست.
        </p>
        {site.tariffPdf ? (
          <a href={assetPath(site.tariffPdf)} download className="text-link">
            <Icon name="download" />
            دانلود راهنمای تعرفه‌ها (PDF)
          </a>
        ) : (
          <p>فایل PDF تعرفه‌ها پس از نهایی‌شدن منتشر خواهد شد.</p>
        )}
      </div>
    </>
  );
}
