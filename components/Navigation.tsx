import Link from "next/link";
import { LogoMark } from "./LogoMark";
import { CartCountLink } from "./CartCountLink";
import { MobileNavMenu } from "./MobileNavMenu";

export function Navigation() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-low-line bg-low-black/82 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <LogoMark className="text-low-fog" />

        <div className="hidden gap-12 text-[12px] uppercase tracking-[0.16em] lg:flex">
          <Link
            href="/"
            className="text-low-muted transition-colors duration-300 hover:text-low-fog"
          >
            Home
          </Link>
          <Link
            href="/collections"
            className="text-low-muted transition-colors duration-300 hover:text-low-fog"
          >
            Collections
          </Link>
          <Link
            href="/lookbook"
            className="text-low-muted transition-colors duration-300 hover:text-low-fog"
          >
            Lookbook
          </Link>
          <Link
            href="/about"
            className="text-low-muted transition-colors duration-300 hover:text-low-fog"
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-[10px] uppercase tracking-[0.16em] text-low-muted sm:block">
            2026 / Issue 01
          </span>
          <CartCountLink className="hidden border-b border-low-line pb-1 text-[12px] uppercase tracking-[0.14em] lg:block" />
          <MobileNavMenu />
        </div>
      </div>
    </nav>
  );
}
