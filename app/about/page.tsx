import { copyText, copyLink } from "@/lib/content";
import { AboutBlock, PageIntro, CTA } from "@/components/sections";
import { site, testimonials } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  copyText("about_2dc23a1e33"),
  site.description,
  "/about",
);
export default function About() {
  return (
    <>
      <PageIntro
        eyebrow={copyText("about_b181b56708")}
        title={copyText("about_94053ea054")}
        description={copyText("about_f3e7112637")}
      />
      <AboutBlock />
      <section className="wrap page-section editorial">
        <span className="eyebrow">{copyText("about_cad00e8768")}</span>
        <h2>{copyText("about_0d7b02249d")}</h2>
        <p>{copyText("about_a2174d9bc1")}</p>
        <p>{copyText("about_7a5d1dd133")}</p>
      </section>
      {testimonials.length > 0 && (
        <section className="wrap page-section">
          <h2>{copyText("about_8b2b51bfc9")}</h2>
          {testimonials.map((t) => (
            <blockquote key={t.name}>
              <p>{t.text}</p>
              <cite>
                {t.name} · {t.role}
              </cite>
            </blockquote>
          ))}
        </section>
      )}
      <CTA />
    </>
  );
}
