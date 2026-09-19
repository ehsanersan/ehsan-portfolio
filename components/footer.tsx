import Link from "next/link";
import { site, whatsappUrl } from "@/lib/content";
import { Icon } from "./icon";
export function Footer() {
  return (
    <footer className="footer wrap">
      <div className="footer-top">
        <div>
          <Link href="/" className="brand">
            <Icon name="aperture" size={34} />
            <span>
              {site.name}
              <small lang="en">EHSAN EHTERAMI</small>
            </span>
          </Link>
          <p>
            روایت شما، از دریچهٔ نگاه من.
            <br />
            عکاسی، ادیت، ویدیو و آموزش خصوصی.
          </p>
        </div>
        <div>
          <h3>نگاهی نزدیک‌تر</h3>
          <Link href="/portfolio">نمونه‌کارها</Link>
          <Link href="/about">درباره من</Link>
          <Link href="/education">آموزش خصوصی</Link>
          <Link href="/faq">سؤالات متداول</Link>
        </div>
        <div>
          <h3>همکاری</h3>
          <Link href="/services">خدمات عکاسی</Link>
          <Link href="/pricing">تعرفه‌ها</Link>
          <Link href="/contact">تماس و مشاوره</Link>
          <Link href="/privacy">حریم خصوصی</Link>
          <Link href="/terms">شرایط ثبت سفارش</Link>
        </div>
        <div>
          <h3>از یک گفت‌وگو شروع کنیم</h3>
          <a href={`tel:${site.phone}`} dir="ltr">
            {site.phoneLabel}
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            گفت‌وگو در واتس‌اپ ↗
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
          >
            {site.instagramHandle}
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          ©{" "}
          {new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
            new Date(),
          )}{" "}
          احسان احترامی · حقوق آثار محفوظ است.
        </span>
        <a href="#top">
          بازگشت به بالا <Icon name="up" size={16} />
        </a>
      </div>
    </footer>
  );
}
