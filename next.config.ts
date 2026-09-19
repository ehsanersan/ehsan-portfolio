import type { NextConfig } from "next";
const config: NextConfig = {
  ...(process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true" ? { output: "export", trailingSlash: true, distDir: ".next-pages", typescript: { tsconfigPath: "tsconfig.pages.json" } } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  poweredByHeader: false,
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`,
          },
        ],
      },
    ];
  },
};
export default config;
