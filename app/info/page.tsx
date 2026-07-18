import type { Metadata } from "next";
import Link from "next/link";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  description:
    "LOW SIGNAL shipping, returns, contact, privacy, terms, and cookies.",
  title: "Service & Information / LOW SIGNAL",
};

const information = [
  {
    id: "shipping",
    index: "01",
    intro:
      "Available pieces normally leave the studio within 2–4 working days.",
    title: "Shipping",
    details: [
      "Delivery methods, timing, and final cost are shown at checkout for the entered address.",
      "A dispatch email includes the carrier and tracking reference when the parcel leaves the studio.",
    ],
  },
  {
    id: "returns",
    index: "02",
    intro: "Unworn garments can be returned within 14 days of delivery.",
    details: [
      "Pieces must be unworn, unwashed, and returned with original tags and packaging.",
      "Email studio@lowsignal.com with the order number and piece. Approved refunds return to the original payment method after inspection.",
    ],
    title: "Returns",
  },
  {
    id: "contact",
    index: "03",
    intro:
      "Questions about garments, sizing, delivery, returns, or an existing order.",
    details: [
      "Email studio@lowsignal.com. Include the order number when asking about an existing order.",
      "Messages are answered Monday to Friday, normally within two working days.",
    ],
    title: "Contact",
  },
  {
    id: "privacy",
    index: "04",
    intro:
      "Personal information is used only to operate the store and fulfil orders.",
    details: [
      "Contact, delivery, account, and order details support authentication, fulfilment, customer care, fraud prevention, and required records.",
      "Email the studio to request access, correction, or deletion where legally available.",
    ],
    title: "Privacy",
  },
  {
    id: "terms",
    index: "05",
    intro: "These terms apply to purchases and use of the LOW SIGNAL store.",
    details: [
      "An order is accepted after stock and payment details are verified and confirmation is issued.",
      "Color and texture can vary across displays and garment-washed production runs. Nothing limits rights that cannot legally be excluded.",
    ],
    title: "Terms",
  },
  {
    id: "cookies",
    index: "06",
    intro:
      "Essential browser storage keeps account sessions and the shopping cart working.",
    details: [
      "Authentication cookies protect signed-in areas. Local storage preserves the current cart and checkout draft.",
      "Browser settings can remove stored data, but doing so may sign you out or clear the cart.",
    ],
    title: "Cookies",
  },
] as const;

export default function InformationPage() {
  return (
    <main className="min-h-screen bg-[#e5e6e1] text-[#121211]">
      <MobileHomeHeader mode="paper" />

      <section className="mx-auto max-w-[1560px] px-5 pb-16 pt-[96px] sm:px-6 lg:px-12 lg:pb-20 lg:pt-[116px]">
        <header className="grid gap-9 border-b border-black/16 pb-9 lg:grid-cols-[1fr_420px] lg:items-end lg:pb-11">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-black/50">
              Service / Index
            </p>
            <h1 className="controlled-display-title mt-7 max-w-[980px] text-[52px] uppercase sm:text-[74px] lg:text-[92px]">
              Service &amp;
              <br />
              Information
            </h1>
          </div>
          <p className="max-w-[410px] text-[12px] uppercase leading-[1.65] tracking-[0.08em] text-black/64">
            Ordering, delivery, returns, contact, and the terms that keep the
            store working.
          </p>
        </header>

        <nav
          aria-label="Information sections"
          className="grid grid-cols-2 border-b border-black/16 text-[10px] uppercase tracking-[0.09em] sm:grid-cols-3 lg:grid-cols-6"
        >
          {information.map((section) => (
            <Link
              className="flex min-h-12 items-center justify-between border-r border-black/12 px-3 last:border-r-0 lg:px-4"
              href={`/info#${section.id}`}
              key={section.id}
            >
              <span className="text-black/42">{section.index}</span>
              <span>{section.title}</span>
            </Link>
          ))}
        </nav>

        <div className="divide-y divide-black/16 border-b border-black/16">
          {information.map((section) => (
            <section
              className="info-section scroll-mt-20 py-8 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12 lg:py-11"
              id={section.id}
              key={section.id}
            >
              <div className="flex items-start justify-between gap-5 text-[10px] uppercase tracking-[0.1em] text-black/48 lg:block">
                <span>{section.index}</span>
                <h2 className="text-black lg:mt-5">{section.title}</h2>
              </div>
              <div className="mt-6 grid gap-6 lg:mt-0 lg:grid-cols-[minmax(240px,0.72fr)_1fr] lg:gap-12">
                <p className="max-w-[520px] text-[15px] uppercase leading-[1.5] tracking-[0.04em] text-black/78">
                  {section.intro}
                </p>
                <div className="grid gap-4 text-[13px] uppercase leading-[1.6] tracking-[0.035em] text-black/62">
                  {section.details.map((detail) => (
                    <p className="border-t border-black/12 pt-4" key={detail}>
                      {detail}
                    </p>
                  ))}
                  {section.id === "contact" ? (
                    <a
                      className="flex min-h-11 w-fit items-center border-b border-black/52 text-black"
                      href="mailto:studio@lowsignal.com"
                    >
                      Email the studio →
                    </a>
                  ) : null}
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
