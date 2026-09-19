"use client";
import type { ImageLoaderProps } from "next/image";
import { assetPath } from "./lib/paths";
export default function imageLoader({ src, width }: ImageLoaderProps) {
  if (!/^\/images\/[a-z0-9-]+\.webp$/.test(src)) return assetPath(src)!;
  const size = [320, 640, 960, 1440, 1920].find((w) => w >= width) || 1920;
  return assetPath(src
    .replace("/images/", "/images/responsive/")
    .replace(".webp", `-${size}.webp`))!;
}
