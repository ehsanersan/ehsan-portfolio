import { copyText, copyLink } from "@/lib/content";
import { PageIntro } from "@/components/sections";
import { Suspense } from "react";
import { ContactQuery } from "@/components/query-content";
import { site, whatsappUrl } from "@/lib/content";
import { Icon } from "@/components/icon";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  copyText("contact_1ad327a294"),
  copyText("contact_a843ee47f6"),
  "/contact",
);
export default function Contact() {
  return (
    <>
      <PageIntro
        eyebrow={copyText("contact_37a607c627")}
        title={copyText("contact_9ec7283ecb")}
        description={copyText("contact_b045f22678")}
      />
      <section className="wrap page-section contact-grid">
        <aside className="contact-aside">
          <h2>{copyText("contact_90ddd247e6")}</h2>
          <p>{copyText("contact_5cc3b9b6ad")}</p>
          <a href={`tel:${site.phone}`}>
            <Icon name="phone" />
            <span>{copyText("contact_189939e753")}<strong dir="ltr">{site.phoneLabel}</strong>
            </span>
            <Icon name="arrow" />
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <Icon name="chat" />
            <span>{copyText("contact_5116f541c9")}<strong>{copyText("contact_a0221cd743")}</strong>
            </span>
            <Icon name="arrow" />
          </a>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            <Icon name="instagram" />
            <span>{copyText("contact_4da72bbfc5")}<strong dir="ltr">{site.instagramHandle}</strong>
            </span>
            <Icon name="arrow" />
          </a>
          {site.city && (
            <p>{copyText("contact_ecdcac56af")}{site.city} {site.serviceArea}
            </p>
          )}
          <p className="privacy-note">
            <Icon name="check" size={16} />{copyText("contact_d7e32d7c32")}</p>
        </aside>
        <Suspense fallback={<p role="status">{copyText("contact_ab36298360")}</p>}><ContactQuery /></Suspense>
      </section>
    </>
  );
}
