import { PageIntro } from "@/components/sections";
import { Suspense } from "react";
import { ContactQuery } from "@/components/query-content";
import { site, whatsappUrl } from "@/lib/content";
import { Icon } from "@/components/icon";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  "تماس و مشاوره رایگان",
  "برای عکاسی، ادیت، تولید ویدیو و آموزش خصوصی با احسان احترامی تماس بگیرید یا درخواست مشاوره ثبت کنید.",
  "/contact",
);
export default function Contact() {
  return (
    <>
      <PageIntro
        eyebrow="شروع همکاری"
        title="داستان شما از اینجا شروع می‌شود."
        description="کمی از ایده‌تان بگویید. با هم مسیر مناسب برای اجرای آن را پیدا می‌کنیم."
      />
      <section className="wrap page-section contact-grid">
        <aside className="contact-aside">
          <h2>گاهی، یک گفت‌وگو کافی است.</h2>
          <p>اگر ترجیح می‌دهید مستقیم صحبت کنیم، این راه‌ها در دسترس شماست.</p>
          <a href={`tel:${site.phone}`}>
            <Icon name="phone" />
            <span>
              تماس مستقیم<strong dir="ltr">{site.phoneLabel}</strong>
            </span>
            <Icon name="arrow" />
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <Icon name="chat" />
            <span>
              واتس‌اپ<strong>درباره پروژه پیام بدهید</strong>
            </span>
            <Icon name="arrow" />
          </a>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            <Icon name="instagram" />
            <span>
              اینستاگرام<strong dir="ltr">{site.instagramHandle}</strong>
            </span>
            <Icon name="arrow" />
          </a>
          {site.city && (
            <p>
              محدوده فعالیت: {site.city} {site.serviceArea}
            </p>
          )}
          <p className="privacy-note">
            <Icon name="check" size={16} /> اطلاعات شما فقط برای بررسی درخواست و
            هماهنگی ارتباط استفاده می‌شود.
          </p>
        </aside>
        <Suspense fallback={<p role="status">در حال آماده‌سازی فرم…</p>}><ContactQuery /></Suspense>
      </section>
    </>
  );
}
