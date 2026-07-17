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
      ["Size guide", "/size-guide"],
      ["Order tracking", "/order-tracking"],
    ],
  },
  {
    label: "Information",
    links: [
      ["Contact", "/contact"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Cookies", "/cookies"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-black/18 bg-[#d8d9d3] px-5 py-10 text-[9px] uppercase tracking-[0.15em] text-[#121211] sm:px-6 lg:px-12 lg:py-12">
      <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-[12px] tracking-[0.2em]">LOW SIGNAL</p>
          <p className="mt-6 max-w-[360px] leading-[1.8] text-black/54">
            Washed clothing, quiet volume, and garments made for repeat wear.
          </p>
          <a
            className="mt-7 inline-flex min-h-11 items-center border-b border-black/48"
            href="mailto:studio@lowsignal.com"
          >
            studio@lowsignal.com
          </a>
        </div>

        <div className="grid gap-8 border-t border-black/14 pt-8 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          {groups.map((group) => (
            <nav aria-label={group.label} key={group.label}>
              <p className="mb-4 text-black/42">{group.label}</p>
              <div className="grid">
                {group.links.map(([label, href]) => (
                  <Link
                    className="flex min-h-11 items-center border-b border-black/12"
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

      <div className="mx-auto mt-10 flex max-w-[1600px] flex-wrap items-center justify-between gap-5 border-t border-black/16 pt-6 text-black/48">
        <span>© 2026 LOW SIGNAL</span>
        <a
          className="flex min-h-11 items-center border-b border-black/30"
          href="https://www.instagram.com/lowsignal/"
          rel="noreferrer"
          target="_blank"
        >
          Instagram ↗
        </a>
      </div>
    </footer>
  );
}
