import { assetPath } from "@/lib/paths";
import type { Metadata, Viewport } from "next";
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/lib/content";
import { origin } from "@/lib/seo";
import { ChatAssistant } from "@/components/chat-assistant";
import { SiteEnhancements } from "@/components/site-enhancements";
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: `${site.name} | عکاسی، ادیت و آموزش`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  icons: { icon: assetPath("/favicon.svg")! },
  manifest: assetPath("/manifest.webmanifest"),
  robots: ["localhost", "127.0.0.1"].includes(new URL(origin).hostname)
    ? { index: false, follow: false }
    : { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#090a0d" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${origin}/#person`,
        name: site.name,
        jobTitle: site.title,
        url: origin,
        image: `${origin}${site.portrait}`,
        sameAs: [site.instagram],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${origin}/#business`,
        name: site.name,
        description: site.description,
        url: origin,
        telephone: "+989173673306",
        founder: { "@id": `${origin}/#person` },
        ...(site.serviceArea ? { areaServed: site.serviceArea } : {}),
      },
    ],
  };
  return (
    <html lang="fa" dir="rtl">
      <body id="top">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\u003c"),
          }}
        />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ChatAssistant />
        <SiteEnhancements />
      </body>
    </html>
  );
}
