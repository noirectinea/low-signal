import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/LogoMark";
import { getOrderTimelineSteps } from "@/lib/availability";
import { logoutAction } from "./actions";

export function AccountChrome({
  children,
  eyebrow = "Account",
  title,
}: Readonly<{
  children: ReactNode;
  eyebrow?: string;
  title: string;
}>) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e5e6e1] text-[#121211]">
      <AccountNav />
      <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-[104px] lg:px-12">
        <div className="border-y border-black/16 py-12">
          <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
            {eyebrow}
          </p>
          <h1 className="mt-8 max-w-[900px] font-serif text-[52px] uppercase leading-[0.86] tracking-[-0.05em] sm:text-[74px]">
            {title}
          </h1>
          <div className="mt-12">{children}</div>
        </div>
      </section>
    </main>
  );
}

export function AccountNav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-30 grid min-h-[64px] grid-cols-[1fr_auto] items-start gap-6 border-b border-black/16 bg-[#e3e3dc]/92 px-5 py-5 text-[9px] uppercase tracking-[0.16em] text-[#141311] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr] lg:px-12">
      <LogoMark />

      <div className="hidden justify-center gap-14 md:flex">
        <Link href="/">Home</Link>
        <Link href="/collections">Collections</Link>
        <Link href="/account">Account</Link>
        <Link href="/account/orders">Orders</Link>
        <Link href="/account/settings">Settings</Link>
      </div>

      <div className="flex justify-end">
        <form action={logoutAction}>
          <button type="submit">Logout</button>
        </form>
      </div>
    </nav>
  );
}

export function formatAccountMoney(currency: string, value: number) {
  return `${currency} ${value}`;
}

export function formatAccountDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function StatusTimeline({ status }: Readonly<{ status: string }>) {
  const steps = getOrderTimelineSteps(status);

  return (
    <div className="grid gap-3 text-[9px] uppercase tracking-[0.16em] text-black/54">
      {steps.map((step) => (
        <div className="flex items-center gap-4" key={step.key}>
          <span
            className={`h-px w-8 ${
              step.active ? "bg-black" : "bg-black/16"
            }`}
          />
          <span className={step.active ? "text-black" : undefined}>
            {step.label}
            {step.current ? " / Current" : ""}
          </span>
        </div>
      ))}
      {status === "cancelled" || status === "refunded_demo" ? (
        <p className="pt-2 text-black/64">
          {status === "cancelled" ? "Cancelled" : "Refunded demo"}
        </p>
      ) : null}
    </div>
  );
}
