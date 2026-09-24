import { copyText, copyLink } from "@/lib/content";
import Link from "next/link";
import { site, whatsappUrl } from "@/lib/content";
import { Icon } from "./icon";
export function Footer() {
  return (
    <footer className="footer wrap">
      <div className="footer-top">
        <div>
          <Link href={copyLink("footer_8a5edab282")} className="brand">
            <Icon name="aperture" size={34} />
            <span>
              {site.name}
              <small lang="en">{copyText("footer_38efa32fcc")}</small>
            </span>
          </Link>
          <p>{copyText("footer_5ce579a901")}<br />{copyText("footer_6c2ebe6f08")}</p>
        </div>
        <div>
          <h3>{copyText("footer_d9a6a63aca")}</h3>
          <Link href={copyLink("footer_a872f2517a")}>{copyText("footer_9bd04c8415")}</Link>
          <Link href={copyLink("footer_979bddc4a8")}>{copyText("footer_7f0a2381b0")}</Link>
          <Link href={copyLink("footer_6e615c6224")}>{copyText("footer_a807494483")}</Link>
          <Link href={copyLink("footer_1965ee0fd5")}>{copyText("footer_476550b8d8")}</Link>
        </div>
        <div>
          <h3>{copyText("footer_3b878712ee")}</h3>
          <Link href={copyLink("footer_3b1aeccb74")}>{copyText("footer_29af39c39b")}</Link>
          <Link href={copyLink("footer_7394a2bb76")}>{copyText("footer_b554dff45c")}</Link>
          <Link href={copyLink("footer_4eb9506365")}>{copyText("footer_2c51d6f4c3")}</Link>
          <Link href={copyLink("footer_0ece7f7c30")}>{copyText("footer_f084063836")}</Link>
          <Link href={copyLink("footer_2dda5c6b8e")}>{copyText("footer_b293b45079")}</Link>
        </div>
        <div>
          <h3>{copyText("footer_584f06d7d7")}</h3>
          <a href={`tel:${site.phone}`} dir="ltr">
            {site.phoneLabel}
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{copyText("footer_a8f1e6e166")}</a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
          >
            {site.instagramHandle}
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          ©{" "}
          {new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
            new Date(),
          )}{" "}{copyText("footer_014bf5f39e")}</span>
        <a href="#top">{copyText("footer_ffa5d7df32")}<Icon name="up" size={16} />
        </a>
      </div>
    </footer>
  );
}
