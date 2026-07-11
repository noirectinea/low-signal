import Link from "next/link";
import { PublicNavigation } from "@/components/PublicNavigation";
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
      <PublicNavigation />
      <section className="mx-auto grid min-h-screen max-w-[1320px] content-center px-5 py-[104px] lg:px-12">
        <div className="grid gap-10 border-y border-black/16 py-12 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
              Account / Register
            </p>
            <h1 className="controlled-display-title mt-8 max-w-[760px] text-[52px] uppercase sm:text-[74px]">
              Create account
            </h1>
            <p className="supporting-copy mt-8 max-w-[430px] text-black/62">
              Save delivery details and keep order history connected to your
              LOW SIGNAL account.
            </p>
          </div>

          <form
            action={registerAction}
            className="h-fit border border-black/16 p-6 text-[9px] uppercase tracking-[0.14em]"
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
              className="add-to-cart-label mt-7 w-full bg-black px-5 py-4 text-[#ecece5] transition-opacity duration-300 hover:opacity-80"
              type="submit"
            >
              Create account →
            </button>
            <Link
              className="mt-5 block text-center text-black/58"
              href={`/account/login?next=${encodeURIComponent(next)}`}
            >
              Already have an account
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
