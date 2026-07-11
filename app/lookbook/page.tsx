import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CartCountLink } from "@/components/CartCountLink";
import { LogoMark } from "@/components/LogoMark";

const coastalFrames = [
  {
    alt: "Blurred LOW SIGNAL figure moving through coastal wind in dark layers",
    caption: "COASTAL MOTION / 01",
    crop: "object-[42%_48%]",
    src: "/images/low-signal/lookbook-campaign/coastal-movement.png",
  },
  {
    alt: "Close crop of washed black clothing and hand against wet coastal concrete",
    caption: "WIND DETAIL / 02",
    crop: "object-[54%_50%]",
    src: "/images/low-signal/lookbook-campaign/coastal-garment-detail.png",
  },
  {
    alt: "Low crop of washed black hem and trouser folds near concrete floor",
    caption: "HEM / FLOOR / 03",
    crop: "object-[50%_54%]",
    src: "/images/low-signal/lookbook-campaign/material-hem-floor.png",
  },
  {
    alt: "Abstract dark garment movement across concrete light",
    caption: "FABRIC IN MOTION / 04",
    crop: "object-[50%_50%]",
    src: "/images/low-signal/lookbook-campaign/concrete-garment-movement.png",
  },
];

const roomFrames = [
  {
    alt: "Male LOW SIGNAL model in dark layered clothing beside concrete window light",
    caption: "CONCRETE ROOM / 05",
    crop: "object-[50%_44%]",
    src: "/images/low-signal/lookbook-campaign/concrete-male-look.png",
  },
  {
    alt: "Close crop of hand at pocket and sleeve in black layers",
    caption: "HAND / POCKET / 06",
    crop: "object-[52%_50%]",
    src: "/images/low-signal/lookbook-campaign/concrete-hand-pocket.png",
  },
  {
    alt: "Full body LOW SIGNAL campaign look framed by concrete architecture",
    caption: "FINAL LOOK / 07",
    crop: "object-[50%_48%]",
    src: "/images/low-signal/lookbook-campaign/final-full-body.png",
  },
  {
    alt: "Female LOW SIGNAL model in oversized black layers beside cold concrete light",
    caption: "WINDOW PROFILE / 08",
    crop: "object-[58%_46%]",
    src: "/images/low-signal/lookbook-campaign/concrete-female-look.png",
  },
];

const materialFrames = [
  {
    alt: "Black rib knit cardigan texture with buttons on concrete",
    caption: "RIB KNIT / 09",
    crop: "object-[50%_58%]",
    src: "/images/low-signal/lookbook-campaign/material-rib-knit.png",
  },
  {
    alt: "Wide black trouser leg moving across concrete floor",
    caption: "TROUSER MOTION / 10",
    crop: "object-[50%_54%]",
    src: "/images/low-signal/lookbook-campaign/concrete-trouser-motion.png",
  },
  {
    alt: "Cropped neck, collar, and shoulder in washed black fabric against concrete",
    caption: "COLLAR / NECK / 11",
    crop: "object-[60%_48%]",
    src: "/images/low-signal/lookbook-campaign/concrete-body-crop.png",
  },
  {
    alt: "Hidden tonal label, stitching, and matte hardware inside black fabric",
    caption: "HIDDEN LABEL / 12",
    crop: "object-[52%_50%]",
    src: "/images/low-signal/lookbook-campaign/material-hardware-label.png",
  },
];

export default function LookbookPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e4e5df] text-[#141311]">
      <LookbookNav />
      <LookbookHero />
      <CoastalChapter />
      <ConcreteChapter />
      <MaterialChapter />
      <ShopCta />
    </main>
  );
}

function LookbookHero() {
  return (
    <section className="grid border-b border-black/16 pt-[64px] lg:min-h-[88svh] lg:grid-cols-[62%_38%]">
      <div className="relative min-h-[62vh] overflow-hidden border-b border-black/16 bg-[#151413] lg:min-h-0 lg:border-b-0 lg:border-r">
        <Image
          alt="Distant LOW SIGNAL figure in dark clothing under a cold coastal sky"
          src="/images/low-signal/lookbook-campaign/coastal-wide-atmosphere.png"
          fill
          priority
          sizes="(min-width: 1024px) 62vw, 100vw"
          className="object-cover object-[48%_50%] brightness-[0.68] contrast-[1.08] saturate-[0.52]"
        />
        <div className="absolute inset-0 bg-[#11110f]/14" />
        <div className="absolute left-5 top-5 grid gap-2 text-[9px] uppercase leading-[1.55] tracking-[0.2em] text-[#ecece5]/78 lg:left-8 lg:top-8">
          <span>LOOKBOOK / ISSUE 01</span>
          <span>COASTAL LIGHT</span>
        </div>
        <p className="absolute bottom-6 left-5 max-w-[220px] text-[9px] uppercase leading-[1.65] tracking-[0.18em] text-[#ecece5]/62 lg:left-8">
          A quiet campaign recorded between weather, cloth, and concrete rooms.
        </p>
      </div>

      <div className="flex flex-col justify-between bg-[#dedfd9] px-5 py-10 lg:px-12 lg:py-14">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-black/50">
            01-12 Frames / Spring 2026
          </p>
          <h1 className="controlled-display-title mt-8 max-w-[560px] text-[50px] text-black/94 sm:text-[66px] lg:text-[80px]">
            Lookbook 01
            <br />
            Coastal Light
            <br />
            Spring 2026
          </h1>
          <p className="mt-10 max-w-[430px] text-[12px] uppercase leading-[1.78] tracking-[0.16em] text-black/58">
            Washed black garments, coastal air, concrete rooms, and pieces cut
            for regular wear.
          </p>
        </div>

        <div className="mt-16 grid gap-4 border-t border-black/16 pt-6 text-[9px] uppercase leading-[1.75] tracking-[0.18em] text-black/50 sm:grid-cols-2">
          <p>Campaign note / Low Signal</p>
          <p className="sm:text-right">Cold paper / washed black / quiet volume</p>
        </div>
      </div>
    </section>
  );
}

function CoastalChapter() {
  return (
    <ChapterShell
      eyebrow="Chapter 01"
      title="Coastal Light"
      note="Wind holds the garment away from the body. The horizon stays almost still."
    >
      <div className="grid gap-5 lg:grid-cols-[1.08fr_0.74fr] lg:items-start">
        <CampaignFrame
          frame={coastalFrames[0]}
          imageClassName="aspect-[5/4] lg:aspect-[7/5]"
        />

        <div className="grid gap-5 lg:pt-16">
          <TextPause>
            Washed black does not catch light.
            <br />
            It holds it.
          </TextPause>
          <CampaignFrame
            frame={coastalFrames[1]}
            imageClassName="aspect-[4/5] lg:w-[82%]"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.62fr_1fr] lg:items-end">
        <CampaignFrame
          frame={coastalFrames[2]}
          imageClassName="aspect-[4/3] lg:ml-[12%]"
        />
        <CampaignFrame
          frame={coastalFrames[3]}
          imageClassName="aspect-[16/6]"
        />
      </div>
    </ChapterShell>
  );
}

function ConcreteChapter() {
  return (
    <ChapterShell
      eyebrow="Chapter 02"
      title="Concrete Room"
      note="Interior light, cropped posture, and garments that become quieter the longer they are worn."
      tone="dark"
    >
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.08fr] lg:items-center">
        <div className="grid gap-5">
          <CampaignFrame
            frame={roomFrames[0]}
            imageClassName="aspect-[4/5]"
            muted
          />
          <CampaignFrame
            frame={roomFrames[1]}
            imageClassName="aspect-[16/7]"
            muted
          />
        </div>

        <div className="grid gap-5">
          <ConcreteMetadata />
          <div className="grid gap-5 sm:grid-cols-[0.78fr_1fr] sm:items-end">
            <CampaignFrame
              frame={roomFrames[2]}
              imageClassName="aspect-[3/4]"
              muted
            />
            <CampaignFrame
              frame={roomFrames[3]}
              imageClassName="aspect-[4/3]"
              muted
            />
          </div>
        </div>
      </div>
    </ChapterShell>
  );
}

function MaterialChapter() {
  return (
    <ChapterShell
      eyebrow="Chapter 03"
      title="Material Form"
      note="Seams, sleeves, collars, folds. The campaign slows down until the garment becomes surface."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr] lg:items-start">
        <CampaignFrame
          frame={materialFrames[0]}
          imageClassName="aspect-[16/8]"
        />
        <CompactEditorialNote>
          A body moves.
          <br />
          Fabric, weight, and surface.
        </CompactEditorialNote>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-[0.74fr_0.56fr_0.9fr] lg:items-end">
        <CampaignFrame
          frame={materialFrames[1]}
          imageClassName="aspect-[4/3]"
        />
        <CampaignFrame
          frame={materialFrames[2]}
          imageClassName="aspect-[3/4]"
        />
        <CampaignFrame
          frame={materialFrames[3]}
          imageClassName="aspect-[16/9]"
        />
      </div>
    </ChapterShell>
  );
}

function ChapterShell({
  children,
  eyebrow,
  note,
  title,
  tone = "light",
}: Readonly<{
  children: ReactNode;
  eyebrow: string;
  note: string;
  title: string;
  tone?: "light" | "dark";
}>) {
  const isDark = tone === "dark";

  return (
    <section
      className={`border-b border-black/16 px-5 py-12 sm:px-6 lg:px-10 lg:py-16 ${
        isDark ? "bg-[#181715] text-[#e6e6de]" : "bg-[#d8d9d3] text-[#141311]"
      }`}
    >
      <div className="mx-auto max-w-[1540px]">
        <div
          className={`mb-8 grid gap-5 border-b pb-5 text-[10px] uppercase tracking-[0.18em] lg:grid-cols-[220px_1fr_360px] lg:items-end ${
            isDark ? "border-[#e6e6de]/16 text-[#e6e6de]/58" : "border-black/16 text-black/54"
          }`}
        >
          <p>{eyebrow}</p>
          <h2
            className={`controlled-display-title text-[34px] sm:text-[46px] lg:text-[60px] ${
              isDark ? "text-[#e6e6de]" : "text-black/94"
            }`}
          >
            {title}
          </h2>
          <p className="max-w-[390px] leading-[1.7] lg:justify-self-end lg:text-right">
            {note}
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}

function CampaignFrame({
  frame,
  imageClassName,
  muted = false,
}: Readonly<{
  frame: {
    alt: string;
    caption: string;
    crop: string;
    src: string;
  };
  imageClassName: string;
  muted?: boolean;
}>) {
  return (
    <figure>
      <div
        className={`relative overflow-hidden border ${
          muted ? "border-[#e6e6de]/14 bg-[#23211e]" : "border-black/14 bg-[#c8c9c2]"
        } ${imageClassName}`}
      >
        <Image
          alt={frame.alt}
          src={frame.src}
          fill
          sizes="(min-width: 1280px) 44vw, (min-width: 768px) 58vw, 92vw"
          className={`object-cover ${frame.crop} ${
            muted
              ? "brightness-[0.76] contrast-[1.07] saturate-[0.62]"
              : "brightness-[0.82] contrast-[1.05] saturate-[0.64]"
          }`}
        />
        <div className="absolute inset-0 bg-[#11110f]/8" />
      </div>
      <figcaption
        className={`mt-3 text-[9px] uppercase leading-[1.5] tracking-[0.18em] ${
          muted ? "text-[#e6e6de]/50" : "text-black/46"
        }`}
      >
        {frame.caption}
      </figcaption>
    </figure>
  );
}

function ConcreteMetadata() {
  return (
    <div className="grid gap-5 border border-[#e6e6de]/14 px-5 py-5 text-[9px] uppercase leading-[1.65] tracking-[0.18em] text-[#e6e6de]/58 sm:grid-cols-[1fr_116px] sm:items-end">
      <div>
        <div className="mb-5 h-px w-14 bg-[#e6e6de]/28" />
        <p className="text-[#e6e6de]/78">Room index / 02</p>
        <p className="mt-4 max-w-[310px]">
          Body, wall, shadow, sleeve. The room is held quiet so the garment can
          move first.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#e6e6de]/12 pt-4">
          <span>Concrete light</span>
          <span>Close distance</span>
        </div>
      </div>

      <div className="relative hidden aspect-[3/4] overflow-hidden border border-[#e6e6de]/12 bg-[#23211e] sm:block">
        <Image
          alt="Empty concrete room with window light and a small edge of dark fabric"
          src="/images/low-signal/lookbook-campaign/empty-concrete-architecture.png"
          fill
          sizes="116px"
          className="object-cover object-[78%_50%] brightness-[0.72] contrast-[1.08] saturate-[0.54]"
        />
      </div>
    </div>
  );
}

function CompactEditorialNote({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="self-center border-y border-black/14 py-8 text-[13px] uppercase leading-[1.55] tracking-[0.16em] text-black/58 lg:mx-auto lg:max-w-[360px]">
      <p>{children}</p>
      <div className="mt-6 h-px w-16 bg-black/24" />
      <p className="mt-6 text-[9px] leading-[1.7] tracking-[0.18em] text-black/42">
        Surface note / folds, seams, and the slow memory of repeated wear.
      </p>
    </div>
  );
}

function TextPause({
  children,
  light = false,
}: Readonly<{
  children: ReactNode;
  light?: boolean;
}>) {
  return (
    <div
      className={`grid min-h-[180px] place-items-center border px-7 py-10 text-center text-[18px] uppercase leading-[1.25] tracking-[0.14em] sm:text-[22px] lg:min-h-[230px] ${
        light
          ? "border-[#e6e6de]/16 text-[#e6e6de]/78"
          : "border-black/14 text-black/72"
      }`}
    >
      <p>{children}</p>
    </div>
  );
}

function ShopCta() {
  return (
    <section className="border-b border-black/16 bg-[#e4e5df] px-5 py-12 sm:px-6 lg:px-10 lg:py-16">
      <CtaPrelude />
      <div className="mx-auto grid max-w-[1540px] gap-8 border border-black/14 px-6 py-8 uppercase tracking-[0.18em] sm:grid-cols-[1fr_auto] sm:items-end lg:px-10 lg:py-10">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-black/50">
            Spring 2026 available online
          </p>
          <h2 className="controlled-display-title mt-5 max-w-[520px] text-[42px] text-black/94 sm:text-[58px]">
            Shop the collection
            <br />
            from the campaign.
          </h2>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-4 text-[10px] tracking-[0.18em] text-black sm:justify-end">
          <Link className="border-b border-black/50 pb-2 transition-opacity duration-300 hover:opacity-55" href="/collections/men">
            Shop men →
          </Link>
          <Link className="border-b border-black/50 pb-2 transition-opacity duration-300 hover:opacity-55" href="/collections/women">
            Shop women →
          </Link>
          <Link className="border-b border-black/50 pb-2 transition-opacity duration-300 hover:opacity-55" href="/collections">
            View all garments →
          </Link>
        </div>
      </div>
    </section>
  );
}

function CtaPrelude() {
  return (
    <div className="mx-auto mb-5 grid max-w-[1540px] gap-4 border-b border-black/14 pb-5 lg:grid-cols-[0.82fr_1fr] lg:items-end">
      <div className="relative aspect-[16/4] overflow-hidden border border-black/12 bg-[#c7c8c1]">
        <Image
          alt="Quiet concrete room strip with dark garments and window shadow"
          src="/images/low-signal/lookbook-campaign/final-transition-strip.png"
          fill
          sizes="(min-width: 1024px) 42vw, 92vw"
          className="object-cover object-[54%_50%] brightness-[0.8] contrast-[1.05] saturate-[0.58]"
        />
      </div>
      <p className="max-w-[480px] text-[9px] uppercase leading-[1.75] tracking-[0.18em] text-black/46 lg:justify-self-end lg:text-right">
        Final campaign note / selected pieces are available online.
      </p>
    </div>
  );
}

function LookbookNav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-30 grid min-h-[64px] grid-cols-[1fr_auto] items-start gap-6 border-b border-black/16 bg-[#e3e4de]/92 px-5 py-5 text-[9px] uppercase tracking-[0.18em] text-[#141311] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr] lg:px-12">
      <LogoMark />

      <div className="hidden justify-center gap-14 md:flex">
        <Link href="/">Home</Link>
        <Link href="/collections">Collections</Link>
        <Link className="border-b border-black pb-2" href="/lookbook">
          Lookbook
        </Link>
        <Link href="/about">About</Link>
      </div>

      <div className="flex justify-end">
        <CartCountLink />
      </div>
    </nav>
  );
}
