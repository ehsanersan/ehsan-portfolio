import { copyText, copyLink } from "@/lib/content";
import Link from "next/link";
import { courses } from "@/lib/content";
import { PageIntro, CTA } from "@/components/sections";
import { Icon } from "@/components/icon";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  copyText("education_c81c5f97f3"),
  copyText("education_eec007bb28"),
  "/education",
);
export default function Education() {
  return (
    <>
      <PageIntro
        eyebrow={copyText("education_0576a82da3")}
        title={copyText("education_67637a0841")}
        description={copyText("education_a8722b62cd")}
      />
      <section className="wrap page-section course-grid">
        {courses.map((c, i) => (
          <article className="course" key={c.title}>
            <div className="card-top">
              <Icon name="graduation" size={28} />
              <span className="index">
                {new Intl.NumberFormat("fa-IR", {
                  minimumIntegerDigits: 2,
                }).format(i + 1)}
              </span>
            </div>
            <span className="tag">{c.level}</span>
            <h2>{c.title}</h2>
            <ul>
              {c.topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <dl>
              <dt>{copyText("education_400848e52f")}</dt>
              <dd>{c.format}</dd>
              <dt>{copyText("education_8804b14a9d")}</dt>
              <dd>{c.mode}</dd>
              <dt>{copyText("education_611e211b92")}</dt>
              <dd>{c.duration}</dd>
            </dl>
            <Link
              className="button"
              href={`/contact?service=${encodeURIComponent(c.title)}`}
            >{copyText("education_bf3ab182a3")}<Icon name="arrow" />
            </Link>
            <Link
              className="plan-secondary"
              href={`/contact?service=${encodeURIComponent(c.title)}`}
            >{copyText("education_6bd8490107")}</Link>
          </article>
        ))}
      </section>
      <CTA />
    </>
  );
}
