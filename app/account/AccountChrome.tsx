import type { ReactNode } from "react";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getOrderTimelineSteps } from "@/lib/availability";

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
      <MobileHomeHeader mode="paper" />
      <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-[104px] lg:px-12">
        <div className="border-y border-black/16 py-12">
          <p className="text-[11px] uppercase tracking-[0.08em] text-black/68">
            {eyebrow}
          </p>
          <h1 className="controlled-display-title mt-8 max-w-[900px] text-[52px] uppercase sm:text-[74px]">
            {title}
          </h1>
          <div className="mt-12">{children}</div>
        </div>
      </section>
      <SiteFooter />
    </main>
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
    <div className="grid gap-3 text-[12px] uppercase tracking-[0.06em] text-black/68">
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
