"use client";
import { copyText, copyLink } from "@/lib/content";

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
      <a href="#main" className="skip">{copyText("header_4db7f1011c")}</a>
      <header className={`header ${small ? "compact" : ""}`}>
        <Link href={copyLink("header_8a5edab282")} className="brand" aria-label={copyText("header_fb160672e5")}>
          <Icon name="aperture" size={34} />
          <span>{copyText("header_efd83ea549")}<small lang="en">{copyText("header_38efa32fcc")}</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label={copyText("header_d30a6794f7")}>
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
        <Link href={copyLink("header_4eb9506365")} className="button header-cta">{copyText("header_d0da36dfe5")}<Icon name="arrow" size={16} />
        </Link>
        <button
          className="icon-button mobile-menu"
          aria-label={copyText("header_5ef883001c")}
          onClick={() => dialog.current?.showModal()}
        >
          <Icon name="menu" />
        </button>
      </header>
      <dialog
        ref={dialog}
        className="menu-dialog"
        aria-label={copyText("header_bacb5f85f0")}
      >
        <div className="dialog-top">
          <span>{copyText("header_1075a710a7")}</span>
          <button
            className="icon-button"
            aria-label={copyText("header_1a5175dbea")}
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label={copyText("header_e2e4f6b0a5")}>
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
      <nav className="mobile-bar" aria-label={copyText("header_94a711349d")}>
        <a href={`tel:${site.phone}`}>
          <Icon name="phone" />{copyText("header_e39cd1596d")}</a>
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          <Icon name="chat" />{copyText("header_edabd44b28")}</a>
        <Link href={copyLink("header_4eb9506365")}>
          <Icon name="arrow" />{copyText("header_466eb39d0a")}</Link>
      </nav>
    </>
  );
}
