"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { site, whatsappUrl } from "@/lib/content";
import { answerQuestion } from "@/lib/assistant";
import { Icon } from "./icon";
const quick = [
  "عکاسی محصول",
  "عکاسی پرتره",
  "کودک",
  "ودینگ و فرمالیته",
  "فیلم‌برداری",
  "آموزش خصوصی",
  "تعرفه‌ها",
  "صحبت مستقیم با احسان",
];
export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<
    { text: string; user?: boolean; fallback?: boolean }[]
  >([
    {
      text: "سلام! برای انتخاب خدمات، اطلاع از تعرفه‌ها یا ثبت درخواست مشاوره همراهتان هستم. درباره چه نوع پروژه‌ای راهنمایی می‌خواهید؟",
    },
  ]);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages]);
  function ask(q: string) {
    if (!q.trim()) return;
    const result = answerQuestion(q.slice(0, 500));
    setMessages((m) => [
      ...m.slice(-38),
      { text: q.slice(0, 500), user: true },
      { text: result.answer, fallback: result.fallback },
    ]);
    setText("");
  }
  const summary =
    "سلام آقای احترامی، پس از گفت‌وگو با دستیار سایت برای مشاوره پیام می‌دهم.\n" +
    messages
      .filter((m) => m.user)
      .slice(-5)
      .map((m) => m.text)
      .join("\n");
  return (
    <div className="chat-root">
      {open && (
        <section
          className="chat-panel"
          aria-label="دستیار احسان"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              trigger.current?.focus();
            }
          }}
        >
          <div className="chat-header">
            <div>
              <Icon name="aperture" />
              <span>
                دستیار احسان<small>راهنمای خدمات و سؤالات متداول</small>
              </span>
            </div>
            <button
              className="icon-button"
              aria-label="بستن دستیار"
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              <Icon name="close" size={18} />
            </button>
          </div>
          <div className="chat-log" ref={log} role="log" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.user ? "user" : ""}`}>
                <p>{m.text}</p>
                {m.fallback && (
                  <div className="chat-links">
                    <Link href="/contact" onClick={() => setOpen(false)}>
                      ثبت مشاوره
                    </Link>
                    <a href={`tel:${site.phone}`}>تماس</a>
                    <a
                      href={whatsappUrl(summary)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      واتس‌اپ و خلاصه گفتگو
                    </a>
                    <a
                      href={site.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      اینستاگرام
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="quick-questions">
            {quick.map((q) => (
              <button key={q} onClick={() => ask(q)}>
                {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(text);
            }}
            className="chat-form"
          >
            <label className="sr-only" htmlFor="chat-input">
              سؤال شما
            </label>
            <input
              ref={input}
              id="chat-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              placeholder="سؤالتان را بنویسید…"
            />
            <button
              type="submit"
              className="icon-button"
              aria-label="ارسال سؤال"
            >
              <Icon name="send" size={18} />
            </button>
          </form>
          <small className="chat-disclosure">
            پاسخ‌ها از راهنمای محلی سایت هستند.
          </small>
        </section>
      )}
      <button
        className="chat-trigger"
        ref={trigger}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "بستن دستیار احسان" : "باز کردن دستیار احسان"}
      >
        <Icon name={open ? "close" : "chat"} size={22} />
        <span>دستیار احسان</span>
      </button>
    </div>
  );
}
