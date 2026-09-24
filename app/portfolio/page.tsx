import { copyText, copyLink } from "@/lib/content";
import { Suspense } from "react";
import { PortfolioQuery } from "@/components/query-content";
import { PageIntro, CTA } from "@/components/sections";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  copyText("portfolio_9bd04c8415"),
  copyText("portfolio_a4deb89bfa"),
  "/portfolio",
);
export default function Portfolio() {
  return (
    <>
      <PageIntro
        eyebrow={copyText("portfolio_15508bb928")}
        title={copyText("portfolio_314d3eafe9")}
        description={copyText("portfolio_a8929aed04")}
      />
      <section className="wrap page-section">
        <Suspense fallback={<p role="status">{copyText("portfolio_da8fdf259f")}</p>}><PortfolioQuery /></Suspense>
      </section>
      <CTA />
    </>
  );
}
