import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/LogoMark";
import { logoutAction } from "@/app/account/actions";

export function AdminChrome({
  children,
  eyebrow = "Admin / LOW SIGNAL",
  title,
}: Readonly<{
  children: ReactNode;
  eyebrow?: string;
  title: string;
}>) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e5e6e1] text-[#121211]">
      <AdminNav />
      <section className="mx-auto max-w-[1500px] px-4 pb-12 pt-[124px] sm:px-6 lg:px-12 lg:pt-[112px]">
        <div className="border-y border-black/16 py-6 lg:py-8">
          <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
            {eyebrow}
          </p>
          <h1 className="controlled-display-title mt-3 max-w-[980px] text-[34px] uppercase sm:text-[48px] lg:text-[56px]">
            {title}
          </h1>
          <div className="mt-6 lg:mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}

export function AdminNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-30 border-b border-black/16 bg-[#e3e3dc]/96 text-[9px] uppercase tracking-[0.12em] text-[#141311] backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-12">
        <LogoMark />
        <form action={logoutAction}>
          <button className="min-h-11 border-b border-black/30" type="submit">Logout</button>
        </form>
      </div>
      <div className="flex min-h-11 items-center gap-7 overflow-x-auto border-t border-black/12 px-4 [scrollbar-width:none] sm:px-6 lg:justify-center lg:px-12">
        <Link className="flex min-h-11 shrink-0 items-center" href="/admin">Overview</Link>
        <Link className="flex min-h-11 shrink-0 items-center" href="/admin/products">Products</Link>
        <Link className="flex min-h-11 shrink-0 items-center" href="/admin/orders">Orders</Link>
        <Link className="flex min-h-11 shrink-0 items-center" href="/collections">Public site ↗</Link>
      </div>
    </nav>
  );
}

export function AdminAccessDenied() {
  return (
    <AdminChrome eyebrow="Admin / Access" title="Access denied">
      <div className="border-y border-black/16 py-10 text-[9px] uppercase leading-[1.8] tracking-[0.16em] text-black/64">
        This account is not listed as an administrator. Ask an existing admin to
        add your user id to `admin_users`.
      </div>
    </AdminChrome>
  );
}

export function AdminEmpty({
  action,
  children,
}: Readonly<{
  action?: ReactNode;
  children: ReactNode;
}>) {
  return (
    <div className="border-y border-black/16 py-10 text-[9px] uppercase leading-[1.8] tracking-[0.16em] text-black/64">
      {children}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function formatAdminMoney(currency: string, value: number) {
  return `${currency} ${value.toLocaleString("en")}`;
}

export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
