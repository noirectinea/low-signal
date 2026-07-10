import Link from "next/link";

export function LogoMark({
  className = "",
}: Readonly<{
  className?: string;
}>) {
  return (
    <Link
      href="/"
      className={`inline-block font-sans text-[11px] font-semibold uppercase leading-[0.95] tracking-[0.24em] ${className}`}
    >
      LOW
      <br />
      SIGNAL
    </Link>
  );
}
