import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
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
      <RegisterNav />
      <section className="mx-auto grid min-h-screen max-w-[1320px] content-center px-5 py-[104px] lg:px-12">
        <div className="grid gap-10 border-y border-black/16 py-12 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
              Account / Register
            </p>
            <h1 className="mt-8 max-w-[760px] font-serif text-[52px] uppercase leading-[0.86] tracking-[-0.05em] sm:text-[74px]">
              Create a customer record
            </h1>
            <p className="mt-8 max-w-[430px] text-[10px] uppercase leading-[1.8] tracking-[0.16em] text-black/58">
              Keep order history and delivery details connected to your LOW
              SIGNAL account.
            </p>
          </div>

          <form
            action={registerAction}
            className="h-fit border border-black/16 p-6 text-[9px] uppercase tracking-[0.16em]"
          >
            <input name="next" type="hidden" value={next} />
            <AuthField label="Full name" name="fullName" required />
            <AuthField label="Email" name="email" required type="email" />
            <AuthField
              label="Password"
              name="password"
              required
              type="password"
            />

            {params.error ? (
              <p className="mt-5 leading-[1.7] text-black/58">{params.error}</p>
            ) : null}

            <button
              className="mt-7 w-full bg-black px-5 py-4 text-[#ecece5]"
              type="submit"
            >
              Register -&gt;
            </button>
            <Link
              className="mt-5 block text-center text-black/58"
              href={`/account/login?next=${encodeURIComponent(next)}`}
            >
              Already registered
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
}

function RegisterNav() {
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
