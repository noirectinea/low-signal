import Link from "next/link";
import { LogoMark } from "./LogoMark";

const footerLinks = [
  ["Collections", "/collections"],
  ["Lookbook", "/lookbook"],
  ["About", "/about"],
  ["Project case study", "/case-study/low-signal"],
] as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-black/16 bg-[#d8d9d3] px-5 py-8 text-[#141311] lg:px-12">
      <div className="mx-auto grid max-w-[1680px] gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <LogoMark className="w-[96px]" />
          <p className="supporting-copy mt-7 max-w-[430px] text-black/64">
            Clothing built around washed surfaces, practical volume, and the
            marks left by regular wear.
          </p>
        </div>

        <nav className="grid gap-3 text-[10px] font-medium uppercase tracking-[0.1em] sm:grid-cols-2 sm:gap-x-8">
          {footerLinks.map(([label, href]) => (
            <Link className="text-link w-fit" href={href} key={href}>
              {label} →
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1680px] flex-wrap justify-between gap-4 border-t border-black/14 pt-5 text-[10px] uppercase tracking-[0.1em] text-black/54">
        <span>LOW SIGNAL / 2026</span>
        <a className="text-link" href="mailto:contact@lowsignal.com">
          contact@lowsignal.com
        </a>
      </div>
    </footer>
  );
}
