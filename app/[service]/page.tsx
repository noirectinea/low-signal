import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";

const services = {
  faq: {
    eyebrow: "Service / Index",
    title: "FAQ",
    intro: "Short answers for ordering, sizing, care, and availability.",
    sections: [
      ["Do I need an account?", "No. Guest checkout is available. An account keeps addresses and order history together."],
      ["How do sizes fit?", "Product pages show fit notes and stock for each size. Use the size guide for garment measurements."],
      ["Will sold-out pieces return?", "Some seasonal pieces return in small quantities. Availability is shown per size."],
    ],
  },
  "size-guide": {
    eyebrow: "Service / Fit",
    title: "Size guide",
    intro: "Compare these body references with a garment you already wear.",
    sections: [
      ["XS / S", "XS: 28–30 inch waist. S: 30–32 inch waist."],
      ["M / L", "M: 32–34 inch waist. L: 34–36 inch waist."],
      ["XL", "XL: 36–38 inch waist. Product-specific fit notes take priority over this general guide."],
    ],
  },
  "order-tracking": {
    eyebrow: "Service / Orders",
    title: "Order tracking",
    intro: "Signed-in customers can follow saved orders from the account area.",
    sections: [
      ["Account orders", "Open My Account → Orders to see current order status and order details."],
      ["Guest orders", "Use the dispatch email tracking link, or contact the studio with your order number and checkout email."],
      ["Need help?", "Email studio@lowsignal.com if a tracking update has not changed for several working days."],
    ],
  },
} as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(services).map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  const page = services[service as keyof typeof services];

  if (!page) return {};

  return {
    description: page.intro,
    title: `${page.title} / LOW SIGNAL`,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const page = services[service as keyof typeof services];

  if (!page) notFound();

  return (
    <main className="min-h-screen bg-[#e5e6e1] text-[#121211]">
      <MobileHomeHeader mode="paper" />
      <section className="mx-auto max-w-[1500px] px-5 pb-20 pt-[104px] sm:px-6 lg:px-12 lg:pt-[120px]">
        <header className="grid gap-10 border-b border-black/16 pb-10 lg:grid-cols-[1fr_440px] lg:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-black/48">
              {page.eyebrow}
            </p>
            <h1 className="controlled-display-title mt-8 text-[58px] uppercase sm:text-[78px] lg:text-[94px]">
              {page.title}
            </h1>
          </div>
          <p className="max-w-[480px] text-[15px] uppercase leading-[1.5] tracking-[0.05em] text-black/74">
            {page.intro}
          </p>
        </header>

        <div className="divide-y divide-black/14 border-b border-black/16 lg:ml-[26%]">
          {page.sections.map(([title, text], index) => (
            <section
              className="grid gap-5 py-8 uppercase sm:grid-cols-[180px_1fr] lg:py-9"
              key={title}
            >
              <h2 className="text-[12px] tracking-[0.08em]">
                {String(index + 1).padStart(2, "0")} / {title}
              </h2>
              <p className="max-w-[680px] text-[14px] leading-[1.55] tracking-[0.03em] text-black/72">{text}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-7 text-[12px] uppercase tracking-[0.06em]">
          {service === "contact" ? (
            <a className="flex min-h-11 items-center border-b border-black/55" href="mailto:studio@lowsignal.com">
              Email the studio →
            </a>
          ) : null}
          <Link className="flex min-h-11 items-center border-b border-black/35" href="/collections">
            View collection
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
