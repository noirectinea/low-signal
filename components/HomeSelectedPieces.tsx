"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type WheelEvent,
  useRef,
  useState,
} from "react";
import { type Product, products } from "@/data/products";

type ProductFormat = "large" | "medium" | "object";

type RailProduct = {
  format: ProductFormat;
  kind: "product";
  product: Product;
};

type RailEditorial = {
  gender: "men" | "women";
  image: string;
  kind: "editorial";
};

type RailSeason = {
  kind: "season";
};

type RailItem = RailProduct | RailEditorial | RailSeason;

const productById = new Map(products.map((product) => [product.id, product]));

function railProduct(id: string, format: ProductFormat): RailProduct {
  const product = productById.get(id);

  if (!product) {
    throw new Error(`Missing selected product: ${id}`);
  }

  return { format, kind: "product", product };
}

const railItems: RailItem[] = [
  railProduct("field-jacket", "large"),
  railProduct("rib-cardigan", "medium"),
  railProduct("washed-longsleeve", "object"),
  {
    gender: "men",
    image: "/images/low-signal/collections/spring-2026-rail.png",
    kind: "editorial",
  },
  railProduct("pleated-pant", "medium"),
  railProduct("storm-parka", "large"),
  railProduct("wide-trouser", "object"),
  {
    gender: "women",
    image: "/images/low-signal/collections/spring-2026-women-rail.png",
    kind: "editorial",
  },
  railProduct("double-face-coat", "medium"),
  railProduct("cotton-crewneck", "object"),
  { kind: "season" },
];

const productCount = products.length;

export function HomeSelectedPieces() {
  const railRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, moved: false, startScroll: 0, startX: 0 });
  const draggedUntil = useRef(0);
  const [progress, setProgress] = useState(0);
  const [activeItem, setActiveItem] = useState(1);

  function updateProgress() {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const nextProgress = maxScroll > 0 ? rail.scrollLeft / maxScroll : 0;
    setProgress(nextProgress);
    setActiveItem(Math.min(railItems.length, Math.round(nextProgress * (railItems.length - 1)) + 1));
  }

  function moveRail(direction: -1 | 1) {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    rail.scrollBy({ behavior: "smooth", left: direction * Math.min(rail.clientWidth * 0.72, 640) });
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    const rail = railRef.current;

    if (!rail || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    const delta = event.deltaY;
    const canMoveForward = delta > 0 && rail.scrollLeft < rail.scrollWidth - rail.clientWidth - 1;
    const canMoveBack = delta < 0 && rail.scrollLeft > 1;

    if (canMoveForward || canMoveBack) {
      event.preventDefault();
      rail.scrollLeft += delta;
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const rail = railRef.current;

    if (!rail) {
      return;
    }

    dragState.current = {
      active: true,
      moved: false,
      startScroll: rail.scrollLeft,
      startX: event.clientX,
    };
    rail.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    const drag = dragState.current;

    if (!rail || !drag.active) {
      return;
    }

    const distance = event.clientX - drag.startX;

    if (Math.abs(distance) > 3) {
      drag.moved = true;
    }

    rail.scrollLeft = drag.startScroll - distance;
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;

    if (rail?.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }

    if (dragState.current.moved) {
      draggedUntil.current = Date.now() + 120;
    }

    dragState.current.active = false;
  }

  function handleRailKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveRail(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveRail(-1);
    }
  }

  function preventClickAfterDrag(event: MouseEvent<HTMLAnchorElement>) {
    if (Date.now() < draggedUntil.current) {
      event.preventDefault();
    }
  }

  return (
    <section
      aria-labelledby="selected-garments-title"
      className="selected-garments-section w-full overflow-hidden border-y border-black/14 bg-[#dedfd9] py-10 text-[#11110f] sm:py-12 lg:py-16"
      id="selected-pieces"
    >
      <header className="mx-auto grid max-w-[1680px] gap-8 px-5 sm:px-6 lg:grid-cols-[minmax(280px,0.75fr)_1fr_auto] lg:items-end lg:px-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-black/62">
            04 — Selected garments
          </p>
          <h2
            className="mt-5 font-[var(--font-archivo)] text-[42px] font-medium uppercase leading-[0.9] tracking-[-0.025em] text-black/94 sm:text-[56px] lg:text-[68px]"
            id="selected-garments-title"
          >
            Pieces in motion
          </h2>
        </div>

        <div className="max-w-[460px] lg:pb-1">
          <p className="text-[14px] leading-[1.55] text-black/68">
            Washed cotton, dense knitwear and relaxed tailoring from Spring
            2026.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-medium uppercase tracking-[0.12em] text-black/64">
            <span>{String(productCount).padStart(2, "0")} garments</span>
            <span>Drag to explore →</span>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-7 gap-y-3 text-[10px] font-medium uppercase tracking-[0.12em] lg:justify-end" aria-label="Selected garment collections">
          <Link className="selected-rail-link" href="/collections/men">
            Shop men →
          </Link>
          <Link className="selected-rail-link" href="/collections/women">
            Shop women →
          </Link>
        </nav>
      </header>

      <div className="mt-9 lg:mt-12">
        <div
          aria-label="Selected garment rail. Use left and right arrow keys to browse."
          className="selected-rail flex snap-x snap-proximity gap-4 overflow-x-auto overscroll-x-contain px-5 pb-3 pr-9 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:px-6 sm:pr-12 lg:gap-6 lg:pl-[max(3rem,calc((100vw-1680px)/2))] lg:pr-20 [&::-webkit-scrollbar]:hidden"
          onKeyDown={handleRailKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onScroll={updateProgress}
          onWheel={handleWheel}
          ref={railRef}
          tabIndex={0}
        >
          {railItems.map((item, index) => {
            if (item.kind === "editorial") {
              return <EditorialRailCard item={item} key={`${item.gender}-${index}`} />;
            }

            if (item.kind === "season") {
              return <SeasonRailCard key="full-season" />;
            }

            return (
              <ProductRailCard
                index={index + 1}
                item={item}
                key={item.product.id}
                onClick={preventClickAfterDrag}
              />
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-7 grid max-w-[1680px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5 text-[10px] font-medium uppercase tracking-[0.12em] text-black/62 sm:px-6 lg:px-12">
        <span>{String(activeItem).padStart(2, "0")} / {String(railItems.length).padStart(2, "0")}</span>
        <div aria-hidden="true" className="h-px bg-black/18">
          <div className="h-px bg-black/70 transition-[width] duration-200" style={{ width: `${Math.max(8, progress * 100)}%` }} />
        </div>
        <div className="flex items-center gap-5 text-[15px] leading-none text-black">
          <button aria-label="Previous selected garment" className="selected-rail-control" onClick={() => moveRail(-1)} type="button">←</button>
          <button aria-label="Next selected garment" className="selected-rail-control" onClick={() => moveRail(1)} type="button">→</button>
        </div>
      </div>
    </section>
  );
}

function ProductRailCard({
  index,
  item,
  onClick,
}: Readonly<{
  index: number;
  item: RailProduct;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}>) {
  const { format, product } = item;
  const size = product.size ?? "M";
  const formatClass =
    format === "large"
      ? "w-[84vw] sm:w-[62vw] lg:w-[42vw] xl:w-[39vw]"
      : format === "medium"
        ? "w-[78vw] sm:w-[48vw] lg:w-[30vw] xl:w-[29vw]"
        : "w-[72vw] sm:w-[38vw] lg:w-[23vw] xl:w-[22vw]";
  const imageClass =
    format === "large"
      ? "aspect-[4/5]"
      : format === "medium"
        ? "aspect-[5/6]"
        : "aspect-[3/4]";

  return (
    <Link
      aria-label={`View product ${product.name}`}
      className={`selected-rail-product group relative shrink-0 snap-start ${formatClass} ${
        format === "medium" ? "pt-8 lg:pt-12" : format === "object" ? "pt-16 lg:pt-24" : ""
      }`}
      href={`/products/${product.slug}`}
      onClick={onClick}
    >
      <div className={`relative overflow-hidden bg-[#cfd0ca] ${format === "object" ? "border border-black/12 p-5 sm:p-7" : "border border-black/14"}`}>
        <div className={`relative overflow-hidden ${imageClass}`}>
          <Image
            alt={product.name}
            className={`object-cover brightness-[0.88] contrast-[1.05] saturate-[0.68] transition-transform duration-700 group-hover:scale-[1.02] ${
              product.objectPosition ?? "object-center"
            }`}
            fill
            sizes={format === "large" ? "(min-width: 1024px) 42vw, 84vw" : format === "medium" ? "(min-width: 1024px) 30vw, 78vw" : "(min-width: 1024px) 23vw, 72vw"}
            src={product.image}
          />
        </div>
        <span className="absolute left-4 top-4 text-[10px] font-medium uppercase tracking-[0.12em] text-[#eceee8]/84 mix-blend-difference sm:left-5 sm:top-5">
          {String(index).padStart(2, "0")}
        </span>
      </div>

      <div className="grid gap-4 border-b border-black/16 py-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-black/54">
            {product.category} / Size {size}
          </p>
          <h3 className="mt-3 text-[16px] font-medium uppercase tracking-[0.04em] text-black sm:text-[18px]">
            {product.name}
          </h3>
          <p className="mt-3 text-[14px] text-black/82">${product.price}</p>
        </div>
        <span className="selected-rail-link w-fit text-[10px] font-medium uppercase tracking-[0.11em]">
          View product →
        </span>
      </div>
    </Link>
  );
}

function EditorialRailCard({ item }: Readonly<{ item: RailEditorial }>) {
  const isMen = item.gender === "men";
  const count = products.filter((product) => product.gender === item.gender).length;
  const label = isMen ? "Men's Spring 2026" : "Women's Spring 2026";

  return (
    <Link
      className="selected-rail-editorial group relative mt-10 flex h-[min(66vw,620px)] w-[84vw] shrink-0 snap-start overflow-hidden border border-black/14 bg-[#171614] text-[#eceee8] sm:mt-16 sm:w-[64vw] lg:mt-20 lg:h-[min(53vw,680px)] lg:w-[54vw]"
      href={`/collections/${item.gender}`}
    >
      <Image
        alt={`${label} collection detail`}
        className="object-cover brightness-[0.62] contrast-[1.08] saturate-[0.58] transition-transform duration-700 group-hover:scale-[1.02]"
        fill
        sizes="(min-width: 1024px) 54vw, 84vw"
        src={item.image}
      />
      <div className="relative z-10 flex w-full flex-col justify-between p-5 sm:p-7 lg:p-9">
        <span className="text-[10px] font-medium uppercase tracking-[0.13em] text-[#eceee8]/72">
          {isMen ? "04" : "08"} / Collection rail
        </span>
        <div>
          <h3 className="font-[var(--font-archivo)] text-[42px] font-medium uppercase leading-[0.9] tracking-[-0.025em] sm:text-[58px] lg:text-[72px]">
            {label}
          </h3>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[#eceee8]/82">
            <span>{String(count).padStart(2, "0")} pieces</span>
            <span className="selected-rail-link border-[#eceee8]/48">Enter the collection →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SeasonRailCard() {
  return (
    <Link
      className="selected-rail-season group mt-5 flex h-[min(61vw,560px)] w-[78vw] shrink-0 snap-start flex-col justify-between border border-black/16 bg-[#e7e8e2] p-5 sm:mt-10 sm:w-[58vw] sm:p-7 lg:mt-14 lg:h-[min(48vw,620px)] lg:w-[46vw] lg:p-9"
      href="/collections"
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.13em] text-black/58">
        11 / Full season
      </span>
      <div>
        <h3 className="font-[var(--font-archivo)] text-[42px] font-medium uppercase leading-[0.9] tracking-[-0.025em] text-black sm:text-[58px] lg:text-[72px]">
          The full
          <br />
          season
        </h3>
        <p className="mt-6 max-w-[300px] text-[14px] leading-[1.55] text-black/68">
          Sixteen garments across men&apos;s and women&apos;s Spring 2026.
        </p>
        <span className="selected-rail-link mt-7 inline-flex text-[10px] font-medium uppercase tracking-[0.12em]">
          View Spring 2026 →
        </span>
      </div>
    </Link>
  );
}
