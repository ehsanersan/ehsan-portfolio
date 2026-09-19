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
        eyebrow="خدمات / جزئیات"
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
          <h2>از نیاز شما شروع می‌کنیم.</h2>
          <p>{s.body}</p>
          <h3>برای شروع، چه اطلاعاتی لازم است؟</h3>
          <ul>
            <li>هدف پروژه و کاربرد تصاویر</li>
            <li>زمان و محل پیشنهادی</li>
            <li>تعداد خروجی و نمونه‌های موردعلاقه</li>
          </ul>
          <div className="hero-actions">
            <Link
              href={`/contact?service=${encodeURIComponent(s.title)}`}
              className="button primary"
            >
              مشاوره این خدمت <Icon name="arrow" />
            </Link>
            <Link
              href={`/portfolio?category=${encodeURIComponent(s.category)}`}
              className="button"
            >
              مشاهده نمونه‌کار
            </Link>
          </div>
          <Link href="/pricing" className="text-link">
            تعرفه‌ها و استعلام قیمت
          </Link>
        </div>
      </section>
      <Process />
      <section className="wrap page-section">
        <h2>پیش از سفارش</h2>
        <FAQ limit={4} />
      </section>
    </>
  );
}
