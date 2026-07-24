import Link from "next/link";

const shopLinks = [
  ["Collections", "/collections"],
  ["Men", "/collections/men"],
  ["Women", "/collections/women"],
  ["Lookbook", "/lookbook"],
] as const;

const serviceLinks = [
  ["Shipping", "/info#shipping"],
  ["Returns", "/info#returns"],
  ["Contact", "/info#contact"],
] as const;

export function SiteFooter() {
  return (
    <>
      <footer className="mobile-compact-footer border-t border-black/18 bg-[#d8d9d3] px-4 py-4 text-[9px] font-normal uppercase tracking-[0.07em] text-[#121211] lg:hidden">
        <div className="flex items-center justify-between gap-5">
          <p className="text-[11px] tracking-[0.1em]">LOW SIGNAL</p>
          <span className="home-footer-muted text-[8px] tracking-[0.06em] text-black/48">
            © 2026
          </span>
        </div>
        <nav
          aria-label="Essential footer navigation"
          className="mt-3 grid grid-cols-2 border-t border-black/14 pt-2"
        >
          <Link className="flex min-h-11 items-center" href="/collections">
            Collections
          </Link>
          <Link
            className="flex min-h-11 items-center justify-end"
            href="/lookbook"
          >
            Lookbook
          </Link>
          <Link
            className="flex min-h-11 items-center border-t border-black/10"
            href="/info#shipping"
          >
            Shipping &amp; returns
          </Link>
          <a
            className="flex min-h-11 items-center justify-end border-t border-black/10"
            href="https://www.instagram.com/lowsignal/"
            rel="noreferrer"
            target="_blank"
          >
            Instagram ↗
          </a>
        </nav>
      </footer>

      <footer className="site-footer hidden border-t border-black/18 bg-[#d8d9d3] px-5 py-6 text-[11px] font-normal uppercase tracking-[0.06em] text-[#121211] sm:px-6 lg:block lg:px-12 lg:py-10">
      <div className="mx-auto max-w-[1680px]">
        <div className="site-footer-primary grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-start lg:gap-10">
          <div className="site-footer-brand grid gap-3">
            <p className="text-[13px] font-normal tracking-[0.1em]">LOW SIGNAL</p>
          <a
              className="w-fit border-b border-black/38 pb-1 text-[10px] normal-case tracking-[0.04em] text-black/66 lg:hidden"
            href="mailto:studio@lowsignal.com"
          >
            studio@lowsignal.com
          </a>
        </div>

          <div className="site-footer-groups grid grid-cols-2 gap-x-7 border-t border-black/14 pt-4 lg:flex lg:flex-wrap lg:justify-center lg:gap-x-7 lg:border-0 lg:pt-0">
            <nav aria-label="Shop" className="grid content-start lg:contents">
              {shopLinks.map(([label, href]) => (
                <Link className="site-footer-link" href={href} key={href}>
                  {label}
                </Link>
              ))}
            </nav>
            <nav aria-label="Service" className="grid content-start lg:contents">
              {serviceLinks.map(([label, href]) => (
                <Link className="site-footer-link" href={href} key={href}>
                  {label}
                </Link>
              ))}
              <a
                className="site-footer-link"
                href="https://www.instagram.com/lowsignal/"
                rel="noreferrer"
                target="_blank"
              >
                Instagram ↗
              </a>
            </nav>
          </div>

          <a
            className="site-footer-email hidden border-b border-black/38 pb-1 text-[10px] normal-case tracking-[0.04em] text-black/66 lg:block"
            href="mailto:studio@lowsignal.com"
          >
            studio@lowsignal.com
          </a>
        </div>

        <div className="site-footer-bottom mt-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-black/16 pt-3 text-[9px] tracking-[0.05em] text-black/56 lg:mt-12 lg:pt-4">
          <span>
            © 2026<span className="hidden lg:inline"> LOW SIGNAL</span>
          </span>
          <nav
            aria-label="Legal links"
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <Link href="/info#privacy">Privacy</Link>
            <Link href="/info#terms">Terms</Link>
            <Link href="/info#cookies">Cookies</Link>
            <Link className="text-black/42" href="/admin">Admin ↗</Link>
          </nav>
        </div>
      </div>
      </footer>
    </>
  );
}
