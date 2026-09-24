"use client";
import { copyText, copyLink } from "@/lib/content";

import { assetPath } from "@/lib/paths";
import { useEffect, useRef, useState } from "react";
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
      ref.current
        ?.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    return () => {};
  }, []);
  return (
    <>
      <video
        ref={ref}
        className="hero-video"
        src={assetPath(src)}
        poster={assetPath(poster)}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={copyText("hero_video_fed4ba10ef")}
      />
      <button
        className="video-toggle"
        onClick={() => {
          if (playing) ref.current?.pause();
          else ref.current?.play().catch(() => {});
          setPlaying(!playing);
        }}
      >
        {playing ? "توقف ویدیو" : "پخش ویدیو"}
      </button>
    </>
  );
}
