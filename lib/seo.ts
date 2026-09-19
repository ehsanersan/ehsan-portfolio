import type { Metadata } from "next";
import { site } from "./content";
export const origin = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
export function pageMeta(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${origin}${path}` },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: `${origin}${path}`,
      locale: "fa_IR",
      type: "website",
      siteName: site.name,
    },
    twitter: { card: "summary", title, description },
  };
}
