import { copyText, copyLink } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import { site, works } from "@/lib/content";
import { Icon } from "@/components/icon";
import { HeroVideo } from "@/components/hero-video";
import {
  SectionHeading,
  ServiceCards,
  AboutBlock,
  Process,
  FAQ,
  CTA,
} from "@/components/sections";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta(
  copyText("page_cd4f40746b"),
  site.description,
  "/",
);
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-visual">
          <Image
            src={site.hero}
            alt={copyText("page_b16f008254")}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 60vw"
          />
          {site.heroVideo && (
            <HeroVideo src={site.heroVideo} poster={site.hero} />
          )}
          <div className="hero-image-label">
            <span>{copyText("page_a5d7fc42f8")}</span>
            <span lang="en">{copyText("page_7076930e43")}</span>
          </div>
        </div>
        <div className="hero-content wrap">
          <div className="hero-copy">
            <span className="eyebrow">{copyText("page_8288c420e0")}</span>
            <h1>{copyText("page_0fa74e7c79")}<br />{copyText("page_606783d620")}<br />
              <span>{copyText("page_4b81efbcac")}</span>
            </h1>
            <p>{copyText("page_db7492c0fc")}<br className="desktop-only" />{copyText("page_53305f0966")}</p>
            <div className="hero-actions">
              <Link href={copyLink("page_a872f2517a")} className="button primary">{copyText("page_2f86e0ed28")}<Icon name="arrow" />
              </Link>
              <Link href={copyLink("page_4eb9506365")} className="button ghost">{copyText("page_1df3700570")}</Link>
            </div>
            <a href={`tel:${site.phone}`} className="hero-phone">
              <Icon name="phone" size={16} />{copyText("page_b14e260f29")}<b dir="ltr">{site.phoneLabel}</b>
            </a>
          </div>
          <div className="experience">
            <strong>{copyText("page_45f7a40f94")}<span>+</span>
            </strong>
            <span>{copyText("page_9b7d45735e")}<br />{copyText("page_50cf5d7c75")}</span>
            <Icon name="aperture" size={32} />
          </div>
        </div>
        <div className="hero-bottom wrap">
          <span lang="en">{copyText("page_42ba93a85d")}</span>
          <a href="#selected">{copyText("page_02022fbb7c")}<span>↓</span>
          </a>
        </div>
      </section>
      <div className="expertise-strip">
        <span>{copyText("page_d53af0a555")}</span>
        <i>✦</i>
        <span>{copyText("page_2da31ec748")}</span>
        <i>✦</i>
        <span>{copyText("page_709a18460c")}</span>
        <i>✦</i>
        <span>{copyText("page_a807494483")}</span>
        <i>✦</i>
        <span>{copyText("page_cb2b5bee9a")}</span>
      </div>
      <section className="section wrap" id="selected">
        <div className="section-top">
          <SectionHeading
            eyebrow={copyText("page_c20e28ceb9")}
            title={copyText("page_583bdbec92")}
          />
          <Link href={copyLink("page_a872f2517a")} className="text-link">{copyText("page_0a47bda53d")}<Icon name="arrow" />
          </Link>
        </div>
        <div className="selected-grid">
          {works
            .filter((w) => w.featured)
            .map((w, i) => (
              <Link
                key={w.id}
                href={`/portfolio?work=${w.id}`}
                className={`selected-work selected-${i}`}
              >
                <div className="work-image">
                  <Image
                    src={w.image}
                    alt={w.alt}
                    fill
                    sizes="(max-width:700px) 100vw, 50vw"
                  />
                  <span className="work-open">
                    <Icon name="arrow" size={24} />
                  </span>
                </div>
                <div className="work-caption">
                  <h3>{w.title}</h3>
                  <span>{w.category}</span>
                </div>
              </Link>
            ))}
        </div>
      </section>
      <section className="section services-section">
        <div className="wrap">
          <div className="section-top">
            <SectionHeading
              eyebrow={copyText("page_168784fb38")}
              title={copyText("page_0bc02a5840")}
            />
            <Link href={copyLink("page_3b1aeccb74")} className="text-link">{copyText("page_a19b736e9f")}<Icon name="arrow" />
            </Link>
          </div>
          <ServiceCards limit={3} />
        </div>
      </section>
      <AboutBlock />
      <Process />
      <section className="section wrap faq-section">
        <SectionHeading eyebrow={copyText("page_616123926a")} title={copyText("page_c5e3100431")} />
        <FAQ limit={5} />
        <Link href={copyLink("page_1965ee0fd5")} className="text-link">{copyText("page_d3a2970d8b")}<Icon name="arrow" />
        </Link>
      </section>
      <CTA />
    </>
  );
}
