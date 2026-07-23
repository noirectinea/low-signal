import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  description:
    "About LOW SIGNAL: a clothing system shaped by material, proportion, and repeated wear.",
  openGraph: {
    description:
      "About LOW SIGNAL: a clothing system shaped by material, proportion, and repeated wear.",
    images: [
      {
        alt: "LOW SIGNAL Spring 2026 coastal campaign",
        height: 630,
        url: "/images/low-signal/og-preview.jpg",
        width: 1200,
      },
    ],
    title: "About / LOW SIGNAL",
    type: "website",
    url: "/about",
  },
  title: "About / LOW SIGNAL",
  twitter: {
    card: "summary_large_image",
    description:
      "A clothing system shaped by material, proportion, and repeated wear.",
    images: ["/images/low-signal/og-preview.jpg"],
    title: "About / LOW SIGNAL",
  },
};

const materials = [
  {
    name: "Dry cotton",
    text: "A crisp hand that creases naturally while holding a clear shape.",
  },
  {
    name: "Wool texture",
    text: "Matte structure and warmth without unnecessary weight.",
  },
  {
    name: "Raw canvas",
    text: "A dense plain weave used for practical outer layers.",
  },
  {
    name: "Worn nylon",
    text: "Light protection with a softened, low-shine finish.",
  },
] as const;

const dailyUseNotes = [
  {
    label: "Room for layering",
    text: "Shirts, knitwear, and outer layers combine without restricting movement.",
  },
  {
    label: "Balanced volume",
    text: "Space through the body is held by clear shoulder lines and controlled length.",
  },
  {
    label: "Surfaces that change with wear",
    text: "Creases, fading, and softened edges become part of the garment.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="about-editorial-page min-h-screen bg-[#e7e7e1] text-[#11110f]">
      <MobileHomeHeader mode="paper" />

      <section
        aria-labelledby="about-manifesto"
        className="about-editorial-hero border-b border-black/18 pt-16"
      >
        <div className="about-editorial-statement">
          <p className="editorial-label">About / LOW SIGNAL</p>
          <h1 id="about-manifesto">
            MATERIAL
            <br />
            FIRST.
            <br />
            WORN OFTEN.
          </h1>
          <p className="about-editorial-statement-note">
            Material / proportion / use
          </p>
        </div>

        <div className="about-editorial-hero-side">
          <figure className="about-editorial-hero-image">
            <Image
              alt="LOW SIGNAL garment construction and material detail"
              className="object-cover object-center brightness-[0.82] contrast-[1.05] saturate-[0.68]"
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              src="/images/low-signal/selected-garments-detail.jpg"
            />
          </figure>

          <div className="about-editorial-intro">
            <div>
              <p className="editorial-label">01 / What LOW SIGNAL Is</p>
              <h2 className="editorial-section-title">
                A clothing system, not a fixed uniform.
              </h2>
            </div>
            <div className="about-editorial-intro-copy">
              <p className="editorial-lead">
                LOW SIGNAL is a clothing system shaped by material,
                proportion, and repeated wear.
              </p>
              <p className="editorial-body">
                Outer layers, shirts, knitwear, and trousers are designed to
                work together without creating a fixed uniform. Volume is
                deliberate: room through the body, clear lines, and space for
                layering.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="about-proportion-title"
        className="about-editorial-chapter about-editorial-proportion"
      >
        <figure className="about-editorial-proportion-image">
          <Image
            alt="LOW SIGNAL model wearing layered dark garments"
            className="object-cover object-[50%_43%] brightness-[0.82] contrast-[1.05] saturate-[0.68]"
            fill
            sizes="(min-width: 1024px) 54vw, 100vw"
            src="/images/low-signal/products/product-06.jpg"
          />
        </figure>

        <div className="about-editorial-proportion-copy">
          <p className="editorial-label">02 / Proportion &amp; Volume</p>
          <h2
            className="editorial-section-title"
            id="about-proportion-title"
          >
            Space around the body is part of the shape.
          </h2>
          <p className="editorial-lead">
            Relaxed volume gives each piece room to move and makes layering
            feel natural rather than added.
          </p>
          <p className="editorial-body">
            Wider trousers balance longer outer layers. Shirts and knitwear
            leave space through the torso, while clear hems and shoulder lines
            keep the silhouette controlled. The result is easy to adjust
            across different combinations and conditions.
          </p>
          <blockquote>
            Room to move.
            <br />
            Clear enough to hold its line.
          </blockquote>
        </div>
      </section>

      <div className="about-editorial-axis" aria-hidden="true">
        <span>MATERIAL FIRST.</span>
        <span>WORN OFTEN.</span>
      </div>

      <section
        aria-labelledby="about-material-title"
        className="about-editorial-chapter about-editorial-materials"
      >
        <header className="about-editorial-chapter-header">
          <div>
            <p className="editorial-label">03 / Material Language</p>
            <h2
              className="editorial-section-title"
              id="about-material-title"
            >
              Texture and weight define the surface.
            </h2>
          </div>
          <p className="editorial-body">
            Materials are selected for texture, weight, and the way their
            surfaces change through use. Black, charcoal, stone, and paper
            tones keep the wardrobe visually coherent.
          </p>
        </header>

        <div className="about-editorial-material-grid">
          <figure>
            <Image
              alt="Close view of LOW SIGNAL fabric and garment hardware"
              className="object-cover object-[50%_48%] brightness-[0.8] contrast-[1.06] saturate-[0.64]"
              fill
              sizes="(min-width: 1024px) 43vw, 100vw"
              src="/images/low-signal/selected-collection/material-detail.png"
            />
          </figure>

          <div className="about-editorial-material-list">
            {materials.map((material, index) => (
              <article key={material.name}>
                <p className="editorial-label">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3>{material.name}</h3>
                  <p className="editorial-body">{material.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="about-daily-title"
        className="about-editorial-chapter about-editorial-daily"
      >
        <div className="about-editorial-daily-copy">
          <p className="editorial-label">04 / Built for Daily Use</p>
          <h2 className="editorial-section-title" id="about-daily-title">
            Pieces meet through proportion, not prescription.
          </h2>
          <p className="editorial-lead">
            A compact wardrobe becomes useful when each layer can change the
            balance without breaking it.
          </p>
          <div className="about-editorial-daily-notes">
            {dailyUseNotes.map((note, index) => (
              <article key={note.label}>
                <p className="editorial-label">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3>{note.label}</h3>
                  <p>{note.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <figure className="about-editorial-daily-image">
          <Image
            alt="LOW SIGNAL dark garments arranged for layering"
            className="object-cover object-center brightness-[0.76] contrast-[1.06] saturate-[0.62]"
            fill
            sizes="(min-width: 1024px) 52vw, 100vw"
            src="/images/low-signal/selected-garments-main.jpg"
          />
        </figure>
      </section>

      <section
        aria-labelledby="about-selection-title"
        className="about-editorial-chapter about-editorial-selection"
      >
        <figure>
          <Image
            alt="LOW SIGNAL figure walking beside a muted coastline"
            className="object-cover object-[58%_54%] brightness-[0.72] contrast-[1.06] saturate-[0.66]"
            fill
            sizes="(min-width: 1024px) 62vw, 100vw"
            src="/images/low-signal/lookbook-coast.jpg"
          />
        </figure>

        <div className="about-editorial-selection-copy">
          <p className="editorial-label">05 / Current Selection</p>
          <h2
            className="editorial-section-title"
            id="about-selection-title"
          >
            The system in its current form.
          </h2>
          <p className="editorial-body">
            Spring 2026 brings outerwear, shirts, knitwear, and trousers into
            one restrained palette. Each piece can stand alone or shift the
            proportion of the layers around it.
          </p>
          <Link className="about-editorial-selection-link" href="/collections">
            Shop current selection →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
