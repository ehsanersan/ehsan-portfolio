import { copyText, copyLink } from "@/lib/content";
import { PageIntro, FAQ, CTA } from "@/components/sections";
import { faqs } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  copyText("faq_476550b8d8"),
  copyText("faq_83dd7d27c7"),
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
        eyebrow={copyText("faq_cdede622f2")}
        title={copyText("faq_d7f015fa80")}
        description={copyText("faq_082f649839")}
      />
      <section className="wrap page-section">
        <FAQ />
      </section>
      <CTA />
    </>
  );
}
