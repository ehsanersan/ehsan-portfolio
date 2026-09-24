import { copyText, copyLink } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { services, site } from "@/lib/content";
import { pageMeta, origin } from "@/lib/seo";
import { PageIntro, Process, FAQ } from "@/components/sections";
import { Icon } from "@/components/icon";
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return s
    ? pageMeta(s.title, s.desc, `/services/${slug}`)
    : { title: "خدمت پیدا نشد" };
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.body,
    url: `${origin}/services/${slug}`,
    provider: { "@type": "Person", name: site.name },
    ...(site.serviceArea ? { areaServed: site.serviceArea } : {}),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\u003c"),
        }}
      />
      <PageIntro
        eyebrow={copyText("services_slug__0923a0a08c")}
        title={s.title}
        description={s.desc}
      />
      <section className="wrap page-section service-detail">
        {s.image && (
          <div className="detail-photo">
            <Image
              src={s.image}
              alt={s.title}
              fill
              sizes="(max-width:700px) 100vw, 45vw"
              priority
            />
          </div>
        )}
        <div>
          <h2>{copyText("services_slug__6b889f1f62")}</h2>
          <p>{s.body}</p>
          <h3>{copyText("services_slug__bb6720da4b")}</h3>
          <ul>
            <li>{copyText("services_slug__b96947b56b")}</li>
            <li>{copyText("services_slug__302d339f45")}</li>
            <li>{copyText("services_slug__41227a425c")}</li>
          </ul>
          <div className="hero-actions">
            <Link
              href={`/contact?service=${encodeURIComponent(s.title)}`}
              className="button primary"
            >{copyText("services_slug__5fc8682c8e")}<Icon name="arrow" />
            </Link>
            <Link
              href={`/portfolio?category=${encodeURIComponent(s.category)}`}
              className="button"
            >{copyText("services_slug__15221aa73b")}</Link>
          </div>
          <Link href={copyLink("services_slug__7394a2bb76")} className="text-link">{copyText("services_slug__f2158e5906")}</Link>
        </div>
      </section>
      <Process />
      <section className="wrap page-section">
        <h2>{copyText("services_slug__10fb8c6250")}</h2>
        <FAQ limit={4} />
      </section>
    </>
  );
}
