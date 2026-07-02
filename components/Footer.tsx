import Link from "next/link";

export function Footer() {
  return (
    <footer id="about" className="w-full border-t border-low-line bg-low-ash px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-12">
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-low-fog">
              LOW SIGNAL
            </h3>
            <p className="max-w-xs text-sm leading-6 text-low-muted">
              Independent clothing for quiet people with stubborn taste.
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-7">
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.18em] text-low-fog">
              Index
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#collections"
                  className="text-xs text-low-muted transition-colors hover:text-low-fog"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="#lookbook"
                  className="text-xs text-low-muted transition-colors hover:text-low-fog"
                >
                  Lookbook
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-xs text-low-muted transition-colors hover:text-low-fog"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 md:col-start-10">
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.18em] text-low-fog">
              Contact
            </h4>
            <a
              href="mailto:contact@lowsignal.com"
              className="mb-2 block text-xs text-low-muted transition-colors hover:text-low-fog"
            >
              contact@lowsignal.com
            </a>
            <p className="text-xs text-low-muted">
              No newsletter. No countdown.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-low-line pt-8">
          <p className="text-xs text-low-muted">
            © 2026 LOW SIGNAL. All rights reserved.
          </p>
          <div className="hidden gap-6 sm:flex">
            <a
              href="#"
              className="text-xs text-low-muted transition-colors hover:text-low-fog"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-low-muted transition-colors hover:text-low-fog"
            >
              Shipping
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
