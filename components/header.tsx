"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { nav, site, whatsappUrl } from "@/lib/content";
import { Icon } from "./icon";
export function Header() {
  const path = usePathname();
  const [small, setSmall] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const f = () => setSmall(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <>
      <a href="#main" className="skip">
        رفتن به محتوای اصلی
      </a>
      <header className={`header ${small ? "compact" : ""}`}>
        <Link href="/" className="brand" aria-label="احسان احترامی، خانه">
          <Icon name="aperture" size={34} />
          <span>
            احسان احترامی<small lang="en">EHSAN EHTERAMI</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="منوی اصلی">
          {nav.map(([href, label]) => (
            <Link
              aria-current={path === href ? "page" : undefined}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="button header-cta">
          درخواست مشاوره <Icon name="arrow" size={16} />
        </Link>
        <button
          className="icon-button mobile-menu"
          aria-label="باز کردن منو"
          onClick={() => dialog.current?.showModal()}
        >
          <Icon name="menu" />
        </button>
      </header>
      <dialog
        ref={dialog}
        className="menu-dialog"
        aria-label="منوی اصلی موبایل"
      >
        <div className="dialog-top">
          <span>احسان احترامی</span>
          <button
            className="icon-button"
            aria-label="بستن منو"
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="منوی موبایل">
          {[...nav, ["/contact", "تماس و مشاوره"]].map(([href, label]) => (
            <Link
              href={href}
              key={href}
              onClick={() => dialog.current?.close()}
            >
              {label}
              <Icon name="arrow" />
            </Link>
          ))}
        </nav>
        <a href={`tel:${site.phone}`}>{site.phoneLabel}</a>
      </dialog>
      <nav className="mobile-bar" aria-label="تماس سریع">
        <a href={`tel:${site.phone}`}>
          <Icon name="phone" />
          تماس
        </a>
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          <Icon name="chat" />
          واتس‌اپ
        </a>
        <Link href="/contact">
          <Icon name="arrow" />
          ثبت مشاوره
        </Link>
      </nav>
    </>
  );
}
