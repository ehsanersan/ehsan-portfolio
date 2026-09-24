import { copyText, copyLink } from "@/lib/content";
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
              <span>{copyText("sections_42fc86f231")}</span>
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
              >{copyText("sections_ce318ed532")}<Icon name="arrow" size={16} />
              </Link>
              <Link href={`/contact?service=${encodeURIComponent(s.title)}`}>{copyText("sections_2d8917e753")}</Link>
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
        eyebrow={copyText("sections_d477dd28f2")}
        title={copyText("sections_02c2c71053")}
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
      <Link href={copyLink("sections_4eb9506365")} className="text-link">{copyText("sections_3b544801df")}<Icon name="arrow" />
      </Link>
    </section>
  );
}
export function CTA() {
  return (
    <section className="cta wrap">
      <div>
        <span className="eyebrow">{copyText("sections_f7b10b9a8a")}</span>
        <h2>{copyText("sections_6a3842e7c2")}<br />
          <em>{copyText("sections_56f4a16583")}</em>
        </h2>
      </div>
      <Link
        href={copyLink("sections_4eb9506365")}
        className="round-cta"
        aria-label={copyText("sections_156a85f5f6")}
      >
        <Icon name="arrow" size={38} />
        <span>{copyText("sections_be9aa89533")}</span>
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
          alt={copyText("sections_cb6a2982b2")}
        />
        <span className="photo-caption">{copyText("sections_b73e9d63e2")}</span>
      </div>
      <div>
        <SectionHeading
          eyebrow={copyText("sections_1355d1ed73")}
          title={copyText("sections_c173c30540")}
        />
        <p className="about-copy">{site.about}</p>
        <div className="about-facts">
          <div>
            <strong>{copyText("sections_b23f60a2f1")}</strong>
            <span>{copyText("sections_98f7efb357")}</span>
          </div>
          <div>
            <Icon name="aperture" size={30} />
            <span>{copyText("sections_b6a86929d9")}</span>
          </div>
        </div>
        <Link href={copyLink("sections_979bddc4a8")} className="text-link">{copyText("sections_51d2811fac")}<Icon name="arrow" />
        </Link>
      </div>
    </section>
  );
}
