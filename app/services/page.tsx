import { PageIntro, ServiceCards, Process, CTA } from "@/components/sections";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  "خدمات عکاسی، ادیت و ویدیو",
  "خدمات عکاسی محصول، تبلیغاتی، کودک، ودینگ، پرتره، فیلم‌برداری، روتوش و آموزش خصوصی با احسان احترامی.",
  "/services",
);
export default function Services() {
  return (
    <>
      <PageIntro
        eyebrow="خدمات"
        title="برای هر ایده، یک نگاه اختصاصی"
        description="نوع پروژه را انتخاب کنید؛ جزئیات اجرا را با هم مشخص می‌کنیم."
      />
      <section className="wrap page-section">
        <ServiceCards />
      </section>
      <Process />
      <CTA />
    </>
  );
}
