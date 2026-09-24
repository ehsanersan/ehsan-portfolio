import { copyText, copyLink } from "@/lib/content";
import { PageIntro } from "@/components/sections";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  copyText("terms_b293b45079"),
  copyText("terms_030014d440"),
  "/terms",
);
export default function Terms() {
  return (
    <>
      <PageIntro
        eyebrow={copyText("terms_025c660a0a")}
        title={copyText("terms_b293b45079")}
        description={copyText("terms_bcdefdd7d3")}
      />
      <article className="wrap page-section legal">
        <h2>{copyText("terms_9c6f4dffb3")}</h2>
        <p>{copyText("terms_f6ec8bc663")}</p>
        <h2>{copyText("terms_ab43a55941")}</h2>
        <p>{copyText("terms_a83c981cf3")}</p>
        <h2>{copyText("terms_83381e47b8")}</h2>
        <p>{copyText("terms_db52d94a42")}</p>
        <h2>{copyText("terms_4430448a13")}</h2>
        <p>{copyText("terms_292d24eda0")}</p>
      </article>
    </>
  );
}
