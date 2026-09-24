import { copyText, copyLink } from "@/lib/content";
import { PageIntro, ServiceCards, Process, CTA } from "@/components/sections";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  copyText("services_159925fb15"),
  copyText("services_bf354d7e3b"),
  "/services",
);
export default function Services() {
  return (
    <>
      <PageIntro
        eyebrow={copyText("services_f53b399897")}
        title={copyText("services_5f8d42c618")}
        description={copyText("services_f945a6a7ca")}
      />
      <section className="wrap page-section">
        <ServiceCards />
      </section>
      <Process />
      <CTA />
    </>
  );
}
