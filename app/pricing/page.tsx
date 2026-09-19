import { PageIntro, SectionHeading } from "@/components/sections";
import { Pricing } from "@/components/pricing";
import { ConsultationForm } from "@/components/consultation-form";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  "تعرفه‌ها و برآورد اولیه",
  "سطوح همکاری برای عکاسی، ویدیو، روتوش و آموزش. دریافت برآورد اولیه متناسب با جزئیات پروژه.",
  "/pricing",
);
export default function PricingPage() {
  return (
    <>
      <PageIntro
        eyebrow="شفاف، متناسب با پروژه شما"
        title="یک انتخاب روشن برای شروع"
        description="هر پروژه نیازهای خودش را دارد. این سه سطح، نقطه شروع گفت‌وگوی ما هستند؛ قیمت نهایی پس از بررسی جزئیات اعلام می‌شود."
      />
      <section className="wrap page-section">
        <Pricing />
      </section>
      <section className="section wrap estimate-section">
        <SectionHeading
          eyebrow="برآورد اولیه"
          title="از پروژه بگویید؛ جزئیات را بررسی کنیم."
          description="این فرم برای درخواست بررسی هزینه است و قیمت قطعی یا رزرو ایجاد نمی‌کند."
        />
        <ConsultationForm estimate />
      </section>
    </>
  );
}
