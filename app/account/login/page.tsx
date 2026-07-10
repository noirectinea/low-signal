import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
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
      <AuthNav />
      <section className="mx-auto grid min-h-screen max-w-[1320px] content-center px-5 py-[104px] lg:px-12">
        <div className="grid gap-10 border-y border-black/16 py-12 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
              Account / Login
            </p>
            <h1 className="mt-8 max-w-[720px] font-serif text-[52px] uppercase leading-[0.86] tracking-[-0.05em] sm:text-[74px]">
              Return to your rail
            </h1>
            <p className="mt-8 max-w-[430px] text-[10px] uppercase leading-[1.8] tracking-[0.16em] text-black/58">
              Sign in to view previous orders and use your saved delivery
              details at checkout.
            </p>
          </div>

          <form
            action={loginAction}
            className="h-fit border border-black/16 p-6 text-[9px] uppercase tracking-[0.16em]"
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
              className="mt-7 w-full bg-black px-5 py-4 text-[#ecece5]"
              type="submit"
            >
              Login -&gt;
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

function AuthNav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-30 grid min-h-[64px] grid-cols-[1fr_auto] items-start gap-6 border-b border-black/16 bg-[#e3e3dc]/92 px-5 py-5 text-[9px] uppercase tracking-[0.16em] text-[#141311] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr] lg:px-12">
      <LogoMark />
      <div className="hidden justify-center gap-14 md:flex">
        <Link href="/">Home</Link>
        <Link href="/collections">Collections</Link>
        <Link href="/lookbook">Lookbook</Link>
        <Link href="/about">About</Link>
      </div>
      <div className="flex justify-end">
        <Link href="/cart">Cart</Link>
      </div>
    </nav>
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
