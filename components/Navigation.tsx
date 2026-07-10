import Link from "next/link";
import { LogoMark } from "./LogoMark";

export function Navigation() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-low-line bg-low-black/82 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <LogoMark className="text-low-fog" />

        <div className="hidden gap-12 text-[10px] uppercase tracking-[0.16em] md:flex">
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

        <div className="flex items-center gap-5">
          <span className="hidden text-[10px] uppercase tracking-[0.16em] text-low-muted sm:block">
            2026 / Issue 01
          </span>
          <button className="grid size-9 place-items-center border border-low-line text-low-fog transition-colors duration-300 hover:border-low-bone" aria-label="Open bag">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
