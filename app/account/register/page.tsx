import Link from "next/link";
import { AuthPasswordField } from "@/components/AuthPasswordField";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { registerAction } from "../actions";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const next = params.next ?? "/account";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e5e6e1] text-[#121211]">
      <MobileHomeHeader mode="paper" />
      <section className="mx-auto grid min-h-screen max-w-[1320px] content-center px-5 py-[104px] lg:px-12">
        <div className="grid gap-10 border-y border-black/16 py-12 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
              Account / Register
            </p>
            <h1 className="controlled-display-title mt-8 max-w-[760px] text-[52px] uppercase sm:text-[74px]">
              Create account
            </h1>
            <p className="mt-8 max-w-[430px] text-[10px] uppercase leading-[1.8] tracking-[0.16em] text-black/58">
              Save delivery details and keep order history connected to your
              LOW SIGNAL account.
            </p>
          </div>

          <form
            action={registerAction}
            className="h-fit border border-black/16 p-6 text-[9px] uppercase tracking-[0.14em]"
          >
            <input name="next" type="hidden" value={next} />
            <AuthField autoComplete="name" label="Full name" name="fullName" required />
            <AuthField autoComplete="email" label="Email" name="email" required type="email" />
            <AuthPasswordField autoComplete="new-password" minLength={8} />
            <p className="mt-4 leading-[1.7] text-black/48">
              Use at least 8 characters.
            </p>
            <label className="mt-5 flex min-h-11 items-center gap-3 leading-[1.6] text-black/58">
              <input className="accent-black" name="terms" required type="checkbox" />
              <span>
                I accept the <Link className="border-b border-black/40" href="/info#terms">Terms</Link> and{" "}
                <Link className="border-b border-black/40" href="/info#privacy">Privacy Policy</Link>.
              </span>
            </label>

            {params.error ? (
              <p className="mt-5 leading-[1.7] text-black/58">{params.error}</p>
            ) : null}

            <AuthSubmitButton idleLabel="Create account →" pendingLabel="Creating account..." />
            <Link
              className="mt-5 block text-center text-black/58"
              href={`/account/login?next=${encodeURIComponent(next)}`}
            >
              Already have an account
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
