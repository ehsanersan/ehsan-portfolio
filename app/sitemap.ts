export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { origin } from "@/lib/seo";
import { services } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/portfolio",
    "/services",
    "/pricing",
    "/education",
    "/about",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    ...services.map((s) => `/services/${s.slug}`),
  ].map((p) => ({
    url: origin + p,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p.startsWith("/services/") ? 0.8 : 0.6,
  }));
}
