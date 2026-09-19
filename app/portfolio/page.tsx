import { Suspense } from "react";
import { PortfolioQuery } from "@/components/query-content";
import { PageIntro, CTA } from "@/components/sections";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  "نمونه‌کارها",
  "منتخبی از آثار احسان احترامی؛ عکاسی محصول، تصاویر تبلیغاتی، پرتره و روایت‌های شخصی.",
  "/portfolio",
);
export default function Portfolio() {
  return (
    <>
      <PageIntro
        eyebrow="آرشیو نگاه من"
        title="هر قاب، یک جهان"
        description="از بافت یک محصول تا احساس یک چهره؛ اینجا می‌توانید به تصاویر نزدیک‌تر شوید."
      />
      <section className="wrap page-section">
        <Suspense fallback={<p role="status">در حال آماده‌سازی گالری…</p>}><PortfolioQuery /></Suspense>
      </section>
      <CTA />
    </>
  );
}
