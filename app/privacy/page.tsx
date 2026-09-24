import { copyText, copyLink } from "@/lib/content";
import { isStaticPreview } from "@/lib/paths";
import { PageIntro } from "@/components/sections";
import { site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  copyText("privacy_f084063836"),
  copyText("privacy_2fbd00df3c"),
  "/privacy",
);
export default function Privacy() {
  return (
    <>
      <PageIntro
        eyebrow={copyText("privacy_37abc5366a")}
        title={copyText("privacy_f084063836")}
        description={copyText("privacy_8daf157135")}
      />
      <article className="wrap page-section legal">
        {isStaticPreview && <><h2>{copyText("privacy_5b2db0b730")}</h2><p>{copyText("privacy_da6a123321")}</p></>}
        <h2>{copyText("privacy_192d09cbbb")}</h2>
        <p>{copyText("privacy_036607d562")}</p>
        <h2>{copyText("privacy_d319668328")}</h2>
        <p>{copyText("privacy_8b62f553ff")}</p>
        <h2>{copyText("privacy_0a1c8fa833")}</h2>
        <p>{copyText("privacy_187cf360ae")}</p>
        <h2>{copyText("privacy_c8b529550f")}</h2>
        <p>{copyText("privacy_be2a48f27d")}</p>
        <h2>{copyText("privacy_a4a32e4b9f")}</h2>
        <p>{copyText("privacy_64cde588fc")}{" "}
          <a href={`tel:${site.phone}`}>{site.phoneLabel}</a>{copyText("privacy_bbc5c6455f")}</p>
      </article>
    </>
  );
}
