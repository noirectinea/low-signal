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
      <section className="mx-auto max-w-[1500px] px-5 pb-16 pt-[104px] lg:px-12">
        <div className="border-y border-black/16 py-12">
          <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
            {eyebrow}
          </p>
          <h1 className="mt-8 max-w-[980px] font-serif text-[52px] uppercase leading-[0.86] tracking-[-0.05em] sm:text-[74px]">
            {title}
          </h1>
          <div className="mt-12">{children}</div>
        </div>
      </section>
    </main>
  );
}

export function AdminNav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-30 grid min-h-[64px] grid-cols-[1fr_auto] items-start gap-6 border-b border-black/16 bg-[#e3e3dc]/92 px-5 py-5 text-[9px] uppercase tracking-[0.16em] text-[#141311] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr] lg:px-12">
      <LogoMark />

      <div className="hidden justify-center gap-10 md:flex">
        <Link href="/admin">Overview</Link>
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/collections">Public site</Link>
      </div>

      <div className="flex justify-end">
        <form action={logoutAction}>
          <button type="submit">Logout</button>
        </form>
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
  return `${currency} ${value}`;
}

export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
