"use client";
import { copyText, copyLink } from "@/lib/content";

import { assetPath } from "@/lib/paths";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories, works, type Work } from "@/lib/content";
import { Icon } from "./icon";
function Comparison({ work }: { work: Work }) {
  const [value, setValue] = useState(50);
  return (
    <div className="comparison">
      <div className="compare-images">
        <img src={assetPath(work.before)} alt={`قبل از ادیت: ${work.alt}`} />
        <img
          className="after"
          src={assetPath(work.after)}
          alt={`پس از ادیت: ${work.alt}`}
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        />
        <span className="compare-before">{copyText("gallery_52e897d4df")}</span>
        <span className="compare-after">{copyText("gallery_3dc3397bee")}</span>
      </div>
      <label>{copyText("gallery_b5da9666c6")}<input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label={copyText("gallery_cbd25df312")}
        />
      </label>
    </div>
  );
}
export function Gallery({
  initialCategory = "همه آثار",
  initialWork,
}: {
  initialCategory?: string;
  initialWork?: string;
}) {
  const [category, setCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "همه آثار",
  );
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const [loaded, setLoaded] = useState<string[]>([]);
  const visible = works.filter(
    (w) => category === "همه آثار" || w.category === category,
  );
  function open(id: string) {
    setIndex(works.findIndex((w) => w.id === id));
    dialog.current?.showModal();
  }
  useEffect(() => {
    if (initialWork && works.some((w) => w.id === initialWork)) {
      setIndex(works.findIndex((w) => w.id === initialWork));
      dialog.current?.showModal();
    }
  }, [initialWork]);
  useEffect(() => {
    const lifecycle = new AbortController();
    const context = (
      document as Document & {
        modelContext?: { registerTool: (tool: unknown, opts: unknown) => void };
      }
    ).modelContext;
    if (context?.registerTool) {
      try {
        context.registerTool(
          {
            name: "filter_portfolio",
            description:
              "Filter the visible portfolio by a Persian category. Does not submit a request.",
            inputSchema: {
              type: "object",
              properties: { category: { type: "string", enum: categories } },
              required: ["category"],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false },
            execute: (input: unknown) => {
              const c = (input as { category?: string })?.category;
              if (!c || !categories.includes(c))
                throw new Error("Invalid category");
              setCategory(c);
              return {
                category: c,
                count: works.filter((w) => c === "همه آثار" || w.category === c)
                  .length,
              };
            },
          },
          { signal: lifecycle.signal },
        );
      } catch {}
    }
    return () => lifecycle.abort();
  }, []);
  const current = works[index];
  const modalWorks = visible.length ? visible : works;
  function move(delta: number) {
    const n = modalWorks.findIndex((w) => w.id === current.id);
    const next =
      modalWorks[(n + delta + modalWorks.length) % modalWorks.length];
    setIndex(works.findIndex((w) => w.id === next.id));
  }
  return (
    <>
      <div
        className="filter-list"
        role="group"
        aria-label={copyText("gallery_2882169661")}
      >
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={c === category ? "active" : ""}
            aria-pressed={c === category}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="gallery-count" aria-live="polite">
        {new Intl.NumberFormat("fa-IR").format(visible.length)}{copyText("gallery_29e3376fbe")}</p>
      {visible.length ? (
        <div className="masonry">
          {visible.map((w) => (
            <button
              className="gallery-item"
              key={w.id}
              onClick={() => open(w.id)}
              aria-label={`نمایش ${w.title}`}
            >
              <div
                className={`gallery-image ${loaded.includes(w.id) ? "ready" : "loading"}`}
                style={{ aspectRatio: `${w.width}/${w.height}` }}
              >
                <Image
                  src={w.image}
                  alt={w.alt}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                  onLoad={() =>
                    setLoaded((a) => (a.includes(w.id) ? a : [...a, w.id]))
                  }
                />
                <span className="work-open">
                  <Icon
                    name={w.video ? "video" : w.before ? "compare" : "arrow"}
                  />
                </span>
              </div>
              <span className="work-caption">
                <strong>{w.title}</strong>
                <span>{w.category}</span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon
            name={
              category === "ویدیو"
                ? "video"
                : category === "قبل و بعد ادیت"
                  ? "compare"
                  : "aperture"
            }
            size={42}
          />
          <h2>{copyText("gallery_bce2669030")}</h2>
          <p>{copyText("gallery_df74636159")}</p>
          <Link
            href={`/contact?service=${encodeURIComponent(category)}`}
            className="button"
          >{copyText("gallery_dbd2b0a578")}<Icon name="arrow" />
          </Link>
        </div>
      )}
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={copyText("gallery_2b2e39f43d")}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            move(1);
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            move(-1);
          }
        }}
      >
        <div className="lightbox-inner">
          <div className="dialog-top">
            <span>{current.title}</span>
            <button
              autoFocus
              className="icon-button"
              onClick={() => dialog.current?.close()}
              aria-label={copyText("gallery_cbe4499be6")}
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="lightbox-media">
            {current.video ? (
              <video
                src={assetPath(current.video)}
                poster={assetPath(current.image)}
                controls
                playsInline
                preload="metadata"
                aria-label={current.title}
              />
            ) : current.before && current.after ? (
              <Comparison work={current} />
            ) : (
              <Image
                src={current.image}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="90vw"
              />
            )}
          </div>
          <div className="lightbox-bottom">
            <button
              className="icon-button"
              onClick={() => move(-1)}
              aria-label={copyText("gallery_20f731cf90")}
            >
              <Icon name="right" />
            </button>
            <div>
              <h2>{current.title}</h2>
              <p>
                {current.category} · {current.description}
              </p>
            </div>
            <button
              className="icon-button"
              onClick={() => move(1)}
              aria-label={copyText("gallery_fff2e1df59")}
            >
              <Icon name="left" />
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
