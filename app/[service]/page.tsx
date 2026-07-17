import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";

const services = {
  contact: {
    eyebrow: "Service / Contact",
    title: "Contact",
    intro:
      "Questions about garments, sizing, delivery, returns, or an existing order.",
    sections: [
      ["Customer care", "Email studio@lowsignal.com. Include your order number when asking about an existing order."],
      ["Response time", "Messages are answered Monday to Friday, normally within two working days."],
      ["Press and studio", "For editorial, wholesale, and studio enquiries use the same address with a clear subject line."],
    ],
  },
  shipping: {
    eyebrow: "Service / Delivery",
    title: "Shipping",
    intro:
      "Orders are checked, packed, and dispatched from the LOW SIGNAL studio.",
    sections: [
      ["Processing", "Available pieces normally leave the studio within 2–4 working days."],
      ["Delivery", "Available methods, timing, and final cost are shown during checkout for the entered address."],
      ["Tracking", "A dispatch email includes the carrier and tracking reference when the parcel leaves the studio."],
    ],
  },
  returns: {
    eyebrow: "Service / Returns",
    title: "Returns",
    intro:
      "Unworn garments can be returned within 14 days of delivery.",
    sections: [
      ["Condition", "Pieces must be unworn, unwashed, and returned with original tags and packaging."],
      ["Start a return", "Email studio@lowsignal.com with the order number and the piece you want to return."],
      ["Refund", "Approved refunds are issued to the original payment method after the garment is inspected."],
    ],
  },
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
  privacy: {
    eyebrow: "Legal / Data",
    title: "Privacy",
    intro: "LOW SIGNAL uses personal information only to operate the store and fulfil orders.",
    sections: [
      ["Information", "Contact, delivery, account, and order details are collected when you use the store."],
      ["Use", "Data is used for authentication, fulfilment, customer care, fraud prevention, and required records."],
      ["Control", "Contact studio@lowsignal.com to request access, correction, or deletion where legally available."],
    ],
  },
  terms: {
    eyebrow: "Legal / Store",
    title: "Terms",
    intro: "These terms apply to purchases and use of the LOW SIGNAL store.",
    sections: [
      ["Orders", "An order is accepted after stock and payment details are verified and confirmation is issued."],
      ["Product information", "Color and texture can vary slightly across displays and garment-washed production runs."],
      ["Liability", "Nothing in these terms limits rights that cannot legally be excluded."],
    ],
  },
  cookies: {
    eyebrow: "Legal / Browser",
    title: "Cookies",
    intro: "Essential browser storage keeps account sessions and the shopping cart working.",
    sections: [
      ["Essential", "Authentication cookies protect signed-in areas. Local storage preserves the current cart."],
      ["Measurement", "Performance and ecommerce measurement may be used to improve the store without changing its visual experience."],
      ["Control", "Browser settings can remove stored data, but doing so may sign you out or clear the cart."],
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
  journal: {
    eyebrow: "Journal / Issue 01",
    title: "Field notes",
    intro:
      "Notes kept between weather, cloth, concrete rooms, and garments in daily rotation.",
    sections: [
      ["01 / Field note", "Coastal light, washed wool, empty roads, and the distance between weather and clothing."],
      ["02 / Material log", "Dry cotton, matte hardware, rib texture, and the slow record made through repeated wear."],
      ["03 / Coastal light", "A quiet horizon and garments cut with enough volume to move before the body."],
    ],
  },
} as const;

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
          <p className="max-w-[440px] text-[11px] uppercase leading-[1.8] tracking-[0.15em] text-black/60">
            {page.intro}
          </p>
        </header>

        <div className="divide-y divide-black/14 border-b border-black/16 lg:ml-[26%]">
          {page.sections.map(([title, text], index) => (
            <section
              className="grid gap-5 py-8 text-[10px] uppercase leading-[1.8] tracking-[0.14em] sm:grid-cols-[180px_1fr] lg:py-10"
              key={title}
            >
              <h2>
                {String(index + 1).padStart(2, "0")} / {title}
              </h2>
              <p className="max-w-[620px] text-black/58">{text}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-7 text-[10px] uppercase tracking-[0.14em]">
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
