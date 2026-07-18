import Link from "next/link";
import { AuthPasswordField } from "@/components/AuthPasswordField";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { loginAction } from "../actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next ?? "/account";
  const redirectMessage =
    next === "/cart"
      ? "Log in to continue to your cart."
      : next === "/checkout"
        ? "Log in to complete your order."
        : "";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e5e6e1] text-[#121211]">
      <MobileHomeHeader mode="paper" />
      <section className="mx-auto grid min-h-screen max-w-[1320px] content-center px-5 py-[104px] lg:px-12">
        <div className="grid gap-10 border-y border-black/16 py-12 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
              Account / Login
            </p>
            <h1 className="controlled-display-title mt-8 max-w-[720px] text-[52px] uppercase sm:text-[74px]">
              Sign in
            </h1>
            <p className="mt-8 max-w-[460px] text-[14px] uppercase leading-[1.5] tracking-[0.05em] text-black/72">
              View previous orders and use your saved delivery
              details at checkout.
            </p>
          </div>

          <form
            action={loginAction}
            className="h-fit border border-black/16 p-6 text-[12px] uppercase tracking-[0.06em]"
          >
            <input name="next" type="hidden" value={next} />
            {redirectMessage ? (
              <p className="mb-5 border-b border-black/16 pb-5 leading-[1.7] text-black/58">
                {redirectMessage}
              </p>
            ) : null}
            <AuthField autoComplete="email" label="Email" name="email" required type="email" />
            <AuthPasswordField autoComplete="current-password" />

            <div className="mt-5 flex items-center justify-between gap-5 text-black/58">
              <label className="flex min-h-11 items-center gap-3">
                <input className="accent-black" name="remember" type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link className="flex min-h-11 items-center border-b border-black/36" href="/account/forgot-password">
                Forgot password
              </Link>
            </div>

            {params.registered ? (
              <p className="mt-5 leading-[1.7] text-black/58">
                Check your email if confirmation is enabled, then sign in.
              </p>
            ) : null}
            {params.error ? (
              <p className="mt-5 leading-[1.7] text-black/58">{params.error}</p>
            ) : null}

            <AuthSubmitButton idleLabel="Sign in ->" pendingLabel="Signing in..." />
            <Link
              className="mt-5 block text-center text-black/58"
              href={`/account/register?next=${encodeURIComponent(next)}`}
            >
              Create account
            </Link>
          </form>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function AuthField({
  autoComplete,
  label,
  name,
  required,
  type = "text",
}: Readonly<{
  autoComplete?: string;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}>) {
  return (
    <label className="mt-5 grid gap-3 border-b border-black/16 pb-3 text-black/64 first:mt-0 focus-within:border-black/42">
      <span>{label}</span>
      <input
        autoComplete={autoComplete}
        className="bg-transparent py-1 text-[12px] uppercase tracking-[0.12em] text-black outline-none"
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}
