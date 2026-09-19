import Link from "next/link";
export default function NotFound() {
  return (
    <section className="wrap error-page">
      <span className="eyebrow">۴۰۴ · خارج از قاب</span>
      <h1>این قاب را پیدا نکردیم.</h1>
      <p>شاید نشانی تغییر کرده باشد. از گالری یا صفحه اصلی ادامه دهید.</p>
      <div className="hero-actions">
        <Link className="button primary" href="/">
          بازگشت به خانه
        </Link>
        <Link className="button" href="/portfolio">
          نمونه‌کارها
        </Link>
      </div>
    </section>
  );
}
