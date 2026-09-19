import Image from "next/image";
import Link from "next/link";
import { site, works } from "@/lib/content";
import { Icon } from "@/components/icon";
import { HeroVideo } from "@/components/hero-video";
import {
  SectionHeading,
  ServiceCards,
  AboutBlock,
  Process,
  FAQ,
  CTA,
} from "@/components/sections";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  "هر تصویر، یک داستان ماندگار",
  site.description,
  "/",
);
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-visual">
          <Image
            src={site.hero}
            alt="پرتره هنری سیاه‌وسفید با نورپردازی سینمایی"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 60vw"
          />
          {site.heroVideo && (
            <HeroVideo src={site.heroVideo} poster={site.hero} />
          )}
          <div className="hero-image-label">
            <span>نور. احساس. داستان.</span>
            <span lang="en">A DIFFERENT PERSPECTIVE</span>
          </div>
        </div>
        <div className="hero-content wrap">
          <div className="hero-copy">
            <span className="eyebrow">عکاسی · فیلم‌برداری · آموزش</span>
            <h1>
              هر تصویر،
              <br />
              فرصتی برای ساختن
              <br />
              <span>یک داستان ماندگار.</span>
            </h1>
            <p>
              من احسان احترامی هستم؛ عکاس، ادیتور و ویدیوگرافر.
              <br className="desktop-only" /> بیش از ۱۵ سال، در جست‌وجوی نوری که
              داستان شما را روایت کند.
            </p>
            <div className="hero-actions">
              <Link href="/portfolio" className="button primary">
                مشاهده نمونه‌کارها <Icon name="arrow" />
              </Link>
              <Link href="/contact" className="button ghost">
                مشاوره رایگان
              </Link>
            </div>
            <a href={`tel:${site.phone}`} className="hero-phone">
              <Icon name="phone" size={16} />
              تماس فوری <b dir="ltr">{site.phoneLabel}</b>
            </a>
          </div>
          <div className="experience">
            <strong>
              ۱۵<span>+</span>
            </strong>
            <span>
              سال تجربه
              <br />
              در خلق تصویر
            </span>
            <Icon name="aperture" size={32} />
          </div>
        </div>
        <div className="hero-bottom wrap">
          <span lang="en">PHOTOGRAPHY & VISUAL STORIES</span>
          <a href="#selected">
            کمی پایین‌تر، دنیای من را ببینید <span>↓</span>
          </a>
        </div>
      </section>
      <div className="expertise-strip">
        <span>عکاسی تبلیغاتی</span>
        <i>✦</i>
        <span>پرتره و نورپردازی</span>
        <i>✦</i>
        <span>ادیت و روتوش</span>
        <i>✦</i>
        <span>آموزش خصوصی</span>
        <i>✦</i>
        <span>روایت تصویری</span>
      </div>
      <section className="section wrap" id="selected">
        <div className="section-top">
          <SectionHeading
            eyebrow="منتخبی از نگاه من"
            title="قاب‌هایی که حرف می‌زنند"
          />
          <Link href="/portfolio" className="text-link">
            همه نمونه‌کارها <Icon name="arrow" />
          </Link>
        </div>
        <div className="selected-grid">
          {works
            .filter((w) => w.featured)
            .map((w, i) => (
              <Link
                key={w.id}
                href={`/portfolio?work=${w.id}`}
                className={`selected-work selected-${i}`}
              >
                <div className="work-image">
                  <Image
                    src={w.image}
                    alt={w.alt}
                    fill
                    sizes="(max-width:700px) 100vw, 50vw"
                  />
                  <span className="work-open">
                    <Icon name="arrow" size={24} />
                  </span>
                </div>
                <div className="work-caption">
                  <h3>{w.title}</h3>
                  <span>{w.category}</span>
                </div>
              </Link>
            ))}
        </div>
      </section>
      <section className="section services-section">
        <div className="wrap">
          <div className="section-top">
            <SectionHeading
              eyebrow="چه کاری برای شما انجام می‌دهم؟"
              title="ایدهٔ شما، تخصص من"
            />
            <Link href="/services" className="text-link">
              همه خدمات <Icon name="arrow" />
            </Link>
          </div>
          <ServiceCards limit={3} />
        </div>
      </section>
      <AboutBlock />
      <Process />
      <section className="section wrap faq-section">
        <SectionHeading eyebrow="پیش از شروع" title="شاید سؤال شما هم باشد" />
        <FAQ limit={5} />
        <Link href="/faq" className="text-link">
          همه سؤال‌ها و پاسخ‌ها <Icon name="arrow" />
        </Link>
      </section>
      <CTA />
    </>
  );
}
