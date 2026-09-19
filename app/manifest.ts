import { assetPath } from "@/lib/paths";
export const dynamic = "force-static";
import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "احسان احترامی | عکاسی و آموزش",
    short_name: "احسان احترامی",
    description: "عکاسی، ادیت، ویدیو و آموزش خصوصی",
    start_url: assetPath("/")!,
    display: "standalone",
    background_color: "#090a0d",
    theme_color: "#090a0d",
    lang: "fa",
    dir: "rtl",
    icons: [
      { src: assetPath("/icon-192.png")!, sizes: "192x192", type: "image/png" },
      {
        src: assetPath("/icon-512.png")!,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
