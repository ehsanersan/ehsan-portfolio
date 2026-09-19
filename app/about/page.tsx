import { AboutBlock, PageIntro, CTA } from "@/components/sections";
import { site, testimonials } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  "درباره احسان احترامی",
  site.description,
  "/about",
);
export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="پشت دوربین"
        title="نگاهی که در طول زمان شکل گرفته است."
        description="احسان احترامی؛ ۳۵ ساله، عکاس، ادیتور، ویدیوگرافر و مدرس عکاسی، نورپردازی و فتوشاپ."
      />
      <AboutBlock />
      <section className="wrap page-section editorial">
        <span className="eyebrow">رویکرد من</span>
        <h2>هویت هر تصویر، از توجه شروع می‌شود.</h2>
        <p>
          برای من، شناخت فرد یا محصول پیش از شروع عکاسی اهمیت دارد. گفت‌وگو
          درباره هدف پروژه کمک می‌کند انتخاب نور، کادر و ادیت در یک مسیر قرار
          بگیرند؛ مسیری که به داستان شما وفادار باشد.
        </p>
        <p>
          بیش از ۱۵ سال فعالیت نیمه‌حرفه‌ای و حرفه‌ای در شاخه‌های مختلف عکاسی،
          بخشی از تجربه‌ای است که در پروژه‌ها و جلسات آموزش خصوصی با شما به
          اشتراک می‌گذارم.
        </p>
      </section>
      {testimonials.length > 0 && (
        <section className="wrap page-section">
          <h2>تجربه مشتریان و هنرجویان</h2>
          {testimonials.map((t) => (
            <blockquote key={t.name}>
              <p>{t.text}</p>
              <cite>
                {t.name} · {t.role}
              </cite>
            </blockquote>
          ))}
        </section>
      )}
      <CTA />
    </>
  );
}
