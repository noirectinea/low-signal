import Link from "next/link";

const groups = [
  {
    label: "Shop",
    links: [
      ["Collections", "/collections"],
      ["Men", "/collections/men"],
      ["Women", "/collections/women"],
      ["Lookbook", "/lookbook"],
    ],
  },
  {
    label: "Service",
    links: [
      ["Shipping", "/shipping"],
      ["Returns", "/returns"],
      ["FAQ", "/faq"],
      ["Contact", "/contact"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-black/18 bg-[#d8d9d3] px-5 py-8 text-[12px] uppercase tracking-[0.08em] text-[#121211] sm:px-6 lg:px-12 lg:py-8">
      <div className="mx-auto grid max-w-[1600px] gap-7 sm:grid-cols-[1fr_1.2fr] lg:grid-cols-[1.1fr_1.4fr] lg:gap-12">
        <div className="site-footer-brand">
          <p className="text-[14px] tracking-[0.14em]">LOW SIGNAL</p>
          <p className="mt-4 max-w-[360px] text-[12px] leading-[1.5] tracking-[0.06em] text-black/68">
            Clothing for daily repeat.
          </p>
          <a
            className="mt-4 inline-flex min-h-9 items-center border-b border-black/48"
            href="mailto:studio@lowsignal.com"
          >
            studio@lowsignal.com
          </a>
        </div>

        <div className="site-footer-groups grid grid-cols-2 gap-6 border-t border-black/14 pt-6 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0 lg:gap-12 lg:pl-10">
          {groups.map((group) => (
            <nav aria-label={group.label} key={group.label}>
              <p className="mb-2 text-[11px] font-medium tracking-[0.12em] text-black/62">{group.label}</p>
              <div className="grid">
                {group.links.map(([label, href]) => (
                  <Link
                    className="flex min-h-9 items-center border-b border-black/12 text-[12px]"
                    href={href}
                    key={href}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </nav>
          ))}
        </div>
      </div>

      <div className="site-footer-bottom mx-auto mt-6 flex max-w-[1600px] flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-black/16 pt-4 text-[11px] text-black/62">
        <span>© 2026 LOW SIGNAL</span>
        <nav aria-label="Legal and social links" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cookies">Cookies</Link>
          <a href="https://www.instagram.com/lowsignal/" rel="noreferrer" target="_blank">Instagram ↗</a>
        </nav>
      </div>
    </footer>
  );
}
