import Link from "next/link";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { forgotPasswordAction } from "../actions";

export const metadata = {
  title: "Reset password / LOW SIGNAL",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#e5e6e1] text-[#121211]">
      <MobileHomeHeader mode="paper" />
      <section className="mx-auto grid min-h-screen max-w-[1320px] content-center px-5 py-[104px] lg:px-12">
        <div className="grid gap-10 border-y border-black/16 py-12 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
              Account / Password
            </p>
            <h1 className="controlled-display-title mt-8 text-[52px] uppercase sm:text-[74px]">
              Reset password
            </h1>
            <p className="mt-8 max-w-[430px] text-[10px] uppercase leading-[1.8] tracking-[0.16em] text-black/58">
              We will send a secure reset link to the email connected to your
              account.
            </p>
          </div>

          <form
            action={forgotPasswordAction}
            className="h-fit border border-black/16 p-6 text-[9px] uppercase tracking-[0.14em]"
          >
            <label className="grid gap-3 border-b border-black/16 pb-3 text-black/64 focus-within:border-black/42">
              <span>Email</span>
              <input
                autoComplete="email"
                className="bg-transparent py-1 text-[16px] tracking-[0.08em] text-black outline-none"
                name="email"
                required
                type="email"
              />
            </label>
            {params.sent ? (
              <p aria-live="polite" className="mt-5 leading-[1.7] text-black/62">
                Check your email for the reset link.
              </p>
            ) : null}
            {params.error ? (
              <p aria-live="polite" className="mt-5 leading-[1.7] text-black/62">
                {params.error}
              </p>
            ) : null}
            <AuthSubmitButton
              idleLabel="Send reset link →"
              pendingLabel="Sending..."
            />
            <Link
              className="mt-5 flex min-h-11 items-center justify-center text-black/58"
              href="/account/login"
            >
              Back to sign in
            </Link>
          </form>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
