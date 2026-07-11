import Link from "next/link";
import { PublicNavigation } from "@/components/PublicNavigation";
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
      <PublicNavigation />
      <section className="mx-auto grid min-h-screen max-w-[1320px] content-center px-5 py-[104px] lg:px-12">
        <div className="grid gap-10 border-y border-black/16 py-12 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
              Account / Login
            </p>
            <h1 className="controlled-display-title mt-8 max-w-[720px] text-[52px] uppercase sm:text-[74px]">
              Sign in
            </h1>
            <p className="supporting-copy mt-8 max-w-[430px] text-black/62">
              Save delivery details, keep your order history connected, and
              continue checkout without losing the current cart.
            </p>
          </div>

          <form
            action={loginAction}
            className="h-fit border border-black/16 p-6 text-[9px] uppercase tracking-[0.14em]"
          >
            <input name="next" type="hidden" value={next} />
            {redirectMessage ? (
              <p className="mb-5 border-b border-black/16 pb-5 leading-[1.7] text-black/58">
                {redirectMessage}
              </p>
            ) : null}
            <AuthField label="Email" name="email" required type="email" />
            <AuthField
              label="Password"
              name="password"
              required
              type="password"
            />

            {params.registered ? (
              <p className="mt-5 leading-[1.7] text-black/58">
                Check your email if confirmation is enabled, then sign in.
              </p>
            ) : null}
            {params.error ? (
              <p className="mt-5 leading-[1.7] text-black/58">{params.error}</p>
            ) : null}

            <button
              className="add-to-cart-label mt-7 w-full bg-black px-5 py-4 text-[#ecece5] transition-opacity duration-300 hover:opacity-80"
              type="submit"
            >
              Sign in →
            </button>
            <Link
              className="mt-5 block text-center text-black/58"
              href={`/account/register?next=${encodeURIComponent(next)}`}
            >
              Create account
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
}

function AuthField({
  label,
  name,
  required,
  type = "text",
}: Readonly<{
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}>) {
  return (
    <label className="mt-5 grid gap-3 border-b border-black/16 pb-3 text-black/64 first:mt-0 focus-within:border-black/42">
      <span>{label}</span>
      <input
        className="bg-transparent py-1 text-[12px] uppercase tracking-[0.12em] text-black outline-none"
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}
