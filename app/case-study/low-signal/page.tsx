import Link from "next/link";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicNavigation } from "@/components/PublicNavigation";

const sections = [
  ["01", "Project overview", "A complete editorial ecommerce concept for an independent clothing label, spanning catalog, secure checkout, customer accounts, inventory, and administration."],
  ["02", "Role", "Art direction, interface design, responsive systems, product architecture, frontend implementation, and Supabase backend integration."],
  ["03", "Art direction", "Cold paper tones, washed black imagery, controlled asymmetry, compact interface labels, and an architectural display system create the visual language."],
  ["04", "Design system", "A restrained set of surfaces, line weights, spacing rules, type levels, image ratios, focus states, and transitions keeps the storefront consistent."],
  ["05", "Ecommerce architecture", "Products, variants, stock, orders, snapshots, profiles, and admin roles are stored in Supabase. Order creation runs through a transactional server-side RPC."],
  ["06", "Cart and checkout", "The cart persists locally, resolves live variant availability, and passes only product, variant, quantity, customer, and shipping data into secure checkout."],
  ["07", "Responsive behavior", "Editorial compositions adapt across desktop, tablet, and mobile while preserving image hierarchy, readable microcopy, and direct shopping actions."],
  ["08", "Technology", "Next.js App Router, React, TypeScript, Tailwind CSS, Supabase Auth, PostgreSQL, row-level security, and Vercel deployment."],
  ["09", "Result", "A portfolio project that behaves like a real fashion storefront while retaining an independent visual identity."],
] as const;

export const metadata = {
  title: "LOW SIGNAL Case Study",
};

export default function LowSignalCaseStudyPage() {
  return (
    <main className="min-h-screen bg-[#e5e6e1] text-[#121211]">
      <PublicNavigation />
      <section className="mx-auto max-w-[1500px] px-5 pb-20 pt-28 lg:px-12 lg:pb-28 lg:pt-36">
        <p className="micro-label text-black/62">Portfolio / Case study</p>
        <h1 className="controlled-display-title mt-8 max-w-[980px] text-[52px] sm:text-[76px] lg:text-[96px]">
          LOW SIGNAL
          <br />
          EDITORIAL COMMERCE
        </h1>
        <p className="supporting-copy mt-10 max-w-[620px] text-black/68">
          A fashion storefront designed as one connected system: brand,
          catalog, inventory, checkout, customer account, and administration.
        </p>

        <div className="mt-20 border-t border-black/16">
          {sections.map(([number, title, body]) => (
            <section className="grid gap-6 border-b border-black/16 py-9 md:grid-cols-[80px_240px_1fr]" key={number}>
              <span className="micro-label text-black/48">{number}</span>
              <h2 className="text-[12px] font-medium uppercase tracking-[0.1em]">{title}</h2>
              <p className="supporting-copy max-w-[670px] text-black/66">{body}</p>
            </section>
          ))}
        </div>

        <Link className="text-link mt-12 inline-flex text-[10px] font-medium uppercase tracking-[0.1em]" href="/">
          Return to storefront →
        </Link>
      </section>
      <PublicFooter />
    </main>
  );
}
