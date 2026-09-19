"use client";
import { isStaticPreview } from "@/lib/paths";
import { useEffect } from "react";
export function SiteEnhancements() {
  useEffect(() => {
    if (!isStaticPreview && process.env.NODE_ENV === "production" && "serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const scroll = () => {
      if (raf || reduced.matches || window.innerWidth < 1000) return;
      raf = requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>(".hero-visual");
        if (el)
          el.style.transform = `translateY(${Math.min(window.scrollY, 900) * 0.045}px)`;
        raf = 0;
      });
    };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
