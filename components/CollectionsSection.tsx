import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  colors?: string[];
}

interface CollectionProps {
  title: string;
  description?: string;
  products: Product[];
  layout?: "editorial" | "grid";
}

export function CollectionsSection({
  title,
  description,
  products,
  layout = "editorial",
}: CollectionProps) {
  if (layout === "editorial") {
    return (
      <section id="collections" className="w-full overflow-hidden bg-low-black px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="relative mb-16 grid grid-cols-12 gap-4 md:mb-24">
            <p className="col-span-12 text-[10px] uppercase tracking-[0.18em] text-low-muted md:col-span-2">
              Catalogue
            </p>
            <div className="col-span-12 md:col-span-6 md:col-start-4">
              <h2 className="font-serif text-5xl font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-low-fog md:text-7xl">
              {title}
            </h2>
            {description && (
                <p className="mt-5 max-w-sm text-sm leading-6 text-low-muted">
                {description}
              </p>
            )}
            </div>
            <div className="absolute right-0 top-0 hidden h-28 w-px bg-low-line md:block" />
          </div>

          <div className="space-y-24 md:space-y-32">
            <div className="grid grid-cols-12 gap-x-4 gap-y-14">
              <div className="col-span-10 md:col-span-4 md:col-start-2">
                <ProductCard {...products[0]} />
              </div>
              <div className="col-span-9 col-start-4 md:col-span-4 md:col-start-8 md:mt-24">
                <ProductCard {...products[1]} />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 border-y border-low-line py-12 md:py-16">
              <div className="col-span-12 md:col-span-5 md:col-start-2">
                <p className="font-serif text-3xl font-medium uppercase leading-[1] tracking-[-0.02em] text-low-paper md:text-5xl">
                  Clothes presented as evidence, not persuasion.
                </p>
              </div>
              <div className="col-span-10 col-start-3 mt-8 md:col-span-3 md:col-start-9 md:mt-0">
                <p className="text-sm leading-6 text-low-muted">
                  The page keeps prices and names visible, but lets silence,
                  scale, and tension carry the first read.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-x-4 gap-y-14">
              <div className="col-span-8 md:col-span-3">
                <ProductCard {...products[2]} />
              </div>
              <div className="col-span-10 col-start-3 md:col-span-4 md:col-start-5 md:mt-28">
                <ProductCard {...products[3]} />
              </div>
              <div className="col-span-9 md:col-span-3 md:col-start-10">
                <ProductCard {...products[4]} />
              </div>
              {products[5] && (
                <div className="col-span-9 col-start-4 md:col-span-3 md:col-start-3">
                  <ProductCard {...products[5]} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Standard grid as fallback
  return (
    <section className="w-full bg-low-black px-4 py-20 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <h2 className="mb-16 font-serif text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-low-fog md:mb-24 md:text-5xl">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
