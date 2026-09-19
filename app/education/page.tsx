import Link from "next/link";
import { courses } from "@/lib/content";
import { PageIntro, CTA } from "@/components/sections";
import { Icon } from "@/components/icon";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  "آموزش خصوصی عکاسی، نورپردازی و فتوشاپ",
  "یادگیری عکاسی، نورپردازی، روتوش و فتوشاپ با برنامه متناسب با سطح و هدف شما.",
  "/education",
);
export default function Education() {
  return (
    <>
      <PageIntro
        eyebrow="آموختن، تمرین، پیدا کردن نگاه شخصی"
        title="فقط تکنیک یاد نگیرید؛ تصویر بسازید."
        description="برنامه آموزشی را با شناخت سطح، تجهیزات و هدف شما تنظیم می‌کنیم. از اولین تنظیم دوربین تا جزئیات یک روتوش حرفه‌ای."
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
              <dt>شیوه آموزش</dt>
              <dd>{c.format}</dd>
              <dt>محل برگزاری</dt>
              <dd>{c.mode}</dd>
              <dt>مدت</dt>
              <dd>{c.duration}</dd>
            </dl>
            <Link
              className="button"
              href={`/contact?service=${encodeURIComponent(c.title)}`}
            >
              درخواست برنامه آموزشی <Icon name="arrow" />
            </Link>
            <Link
              className="plan-secondary"
              href={`/contact?service=${encodeURIComponent(c.title)}`}
            >
              مشاوره قبل از ثبت‌نام
            </Link>
          </article>
        ))}
      </section>
      <CTA />
    </>
  );
}
