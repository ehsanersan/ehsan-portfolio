import Link from "next/link";
import Image from "next/image";
import { services, faqs, processSteps, site } from "@/lib/content";
import { Icon } from "./icon";
export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro wrap">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
export function ServiceCards({ limit }: { limit?: number }) {
  return (
    <div className="service-grid">
      {services.slice(0, limit).map((s, i) => (
        <article className="service-card" key={s.slug}>
          {s.image ? (
            <div className="service-image">
              <Image
                src={s.image}
                fill
                sizes="(max-width: 700px) 100vw, 33vw"
                alt={s.title}
              />
            </div>
          ) : (
            <div className="service-image abstract">
              <Icon name={s.icon} size={44} />
              <span>نمونه‌کار این بخش به‌زودی اضافه می‌شود</span>
            </div>
          )}
          <div className="service-content">
            <div className="card-top">
              <Icon name={s.icon} />
              <span className="index">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3>
              <Link href={`/services/${s.slug}`}>{s.title}</Link>
            </h3>
            <p>{s.desc}</p>
            <div className="card-links">
              <Link
                href={`/portfolio?category=${encodeURIComponent(s.category)}`}
              >
                نمونه‌کارها <Icon name="arrow" size={16} />
              </Link>
              <Link href={`/contact?service=${encodeURIComponent(s.title)}`}>
                دریافت مشاوره
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
export function FAQ({ limit }: { limit?: number }) {
  return (
    <div className="faq-list">
      {faqs.slice(0, limit).map((f, i) => (
        <details key={f.q}>
          <summary>
            <span className="index">
              {new Intl.NumberFormat("fa-IR", {
                minimumIntegerDigits: 2,
              }).format(i + 1)}
            </span>
            {f.q}
            <span className="plus">+</span>
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
export function Process() {
  return (
    <section className="section wrap">
      <SectionHeading
        eyebrow="مسیر همکاری"
        title="از یک ایده، تا یک تصویر ماندگار"
      />
      <ol className="process">
        {processSteps.map((s, i) => (
          <li key={s}>
            <span>
              {new Intl.NumberFormat("fa-IR", {
                minimumIntegerDigits: 2,
              }).format(i + 1)}
            </span>
            <h3>{s}</h3>
          </li>
        ))}
      </ol>
      <Link href="/contact" className="text-link">
        پروژه‌ات را شروع کنیم <Icon name="arrow" />
      </Link>
    </section>
  );
}
export function CTA() {
  return (
    <section className="cta wrap">
      <div>
        <span className="eyebrow">قاب بعدی، داستان شماست</span>
        <h2>
          ایده‌ای در ذهن دارید؟
          <br />
          <em>بیایید به آن تصویر بدهیم.</em>
        </h2>
      </div>
      <Link
        href="/contact"
        className="round-cta"
        aria-label="شروع پروژه و دریافت مشاوره"
      >
        <Icon name="arrow" size={38} />
        <span>شروع یک گفت‌وگو</span>
      </Link>
    </section>
  );
}
export function AboutBlock() {
  return (
    <section className="section wrap about-grid">
      <div className="about-photo">
        <Image
          src={site.portrait}
          fill
          sizes="(max-width:700px) 100vw, 40vw"
          alt="احسان احترامی، عکاس و مدرس"
        />
        <span className="photo-caption">احسان احترامی · عکاس و مدرس</span>
      </div>
      <div>
        <SectionHeading
          eyebrow="پشت این قاب‌ها"
          title="من احسانم؛ راوی نور و لحظه."
        />
        <p className="about-copy">{site.about}</p>
        <div className="about-facts">
          <div>
            <strong>۱۵+</strong>
            <span>سال تجربه در عکاسی</span>
          </div>
          <div>
            <Icon name="aperture" size={30} />
            <span>از ایده تا ادیت نهایی</span>
          </div>
        </div>
        <Link href="/about" className="text-link">
          بیشتر درباره من <Icon name="arrow" />
        </Link>
      </div>
    </section>
  );
}
