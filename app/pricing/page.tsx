import { copyText, copyLink } from "@/lib/content";
import { PageIntro, SectionHeading } from "@/components/sections";
import { Pricing } from "@/components/pricing";
import { ConsultationForm } from "@/components/consultation-form";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  copyText("pricing_d15edd592e"),
  copyText("pricing_ffcc5a8a21"),
  "/pricing",
);
export default function PricingPage() {
  return (
    <>
      <PageIntro
        eyebrow={copyText("pricing_8c3a6fe2d4")}
        title={copyText("pricing_0d53d55715")}
        description={copyText("pricing_8a016952ca")}
      />
      <section className="wrap page-section">
        <Pricing />
      </section>
      <section className="section wrap estimate-section">
        <SectionHeading
          eyebrow={copyText("pricing_2be4b702d3")}
          title={copyText("pricing_bb76ce7466")}
          description={copyText("pricing_f4108bf14a")}
        />
        <ConsultationForm estimate />
      </section>
    </>
  );
}
