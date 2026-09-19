import { PageIntro, FAQ, CTA } from "@/components/sections";
import { faqs } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  "سؤالات متداول",
  "پاسخ پرسش‌های رایج درباره تعرفه عکاسی، رزرو، تحویل عکس، فایل خام و کلاس‌های آموزشی.",
  "/faq",
);
export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }).replace(/</g, "\u003c"),
        }}
      />
      <PageIntro
        eyebrow="با آگاهی شروع کنیم"
        title="سؤال‌های شما، پاسخ‌های روشن"
        description="شرایط نهایی هر پروژه در گفت‌وگو و توافق مستقیم مشخص می‌شود."
      />
      <section className="wrap page-section">
        <FAQ />
      </section>
      <CTA />
    </>
  );
}
