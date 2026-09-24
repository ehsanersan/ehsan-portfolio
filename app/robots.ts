export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { origin } from "@/lib/seo";
import { basePath } from "@/lib/paths";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", `${basePath}/admin/`] },
    sitemap: `${origin}/sitemap.xml`,
  };
}
