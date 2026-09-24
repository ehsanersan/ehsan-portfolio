"use client";
import { copyText, copyLink } from "@/lib/content";

import { assetPath } from "@/lib/paths";
import { useState } from "react";
import Link from "next/link";
import { pricingCategories, plans, site } from "@/lib/content";
import { Icon } from "./icon";
export function Pricing() {
  const [category, setCategory] = useState(pricingCategories[0]);
  return (
    <>
      <label className="pricing-select">{copyText("pricing_92b0d49ca8")}<select value={category} onChange={(e) => setCategory(e.target.value)}>
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
            <strong className="plan-price">{copyText("pricing_eb53f2b343")}</strong>
            <ul>
              {p.items.map((x) => (
                <li key={x}>
                  <Icon name="check" size={17} />
                  {x}
                </li>
              ))}
            </ul>
            <dl>
              <dt>{copyText("pricing_65ea07ff05")}</dt>
              <dd>{p.quantity}</dd>
              <dt>{copyText("pricing_59329247f8")}</dt>
              <dd>{p.edit}</dd>
              <dt>{copyText("pricing_cf67fa5230")}</dt>
              <dd>{p.delivery}</dd>
              <dt>{copyText("pricing_77d4e0b4b0")}</dt>
              <dd>{p.extras}</dd>
            </dl>
            <Link
              href={`/contact?service=${encodeURIComponent(category)}&plan=${encodeURIComponent(p.name)}`}
              className={`button ${i === 1 ? "primary" : ""}`}
            >{copyText("pricing_4a95250904")}<Icon name="arrow" />
            </Link>
            <Link
              className="plan-secondary"
              href={`/contact?service=${encodeURIComponent(category)}&plan=${encodeURIComponent(p.name)}`}
            >{copyText("pricing_dbd2b0a578")}</Link>
          </article>
        ))}
      </div>
      <div className="pricing-note">
        <p>{copyText("pricing_5a7e566967")}</p>
        {site.tariffPdf ? (
          <a href={assetPath(site.tariffPdf)} download className="text-link">
            <Icon name="download" />{copyText("pricing_68c635bfd1")}</a>
        ) : (
          <p>{copyText("pricing_6fe3f2a3a0")}</p>
        )}
      </div>
    </>
  );
}
