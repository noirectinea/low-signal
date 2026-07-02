import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  colors?: string[];
  minimal?: boolean;
  className?: string;
}

export function ProductCard({
  name,
  price,
  image,
  colors = [],
  minimal = false,
  className = "",
}: ProductCardProps) {
  return (
    <article className={`group cursor-pointer ${className}`}>
      <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-low-ash">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 26vw, (min-width: 768px) 45vw, 92vw"
          className="product-image object-cover transition duration-700 group-hover:scale-[1.025] group-hover:opacity-80"
        />
      </div>

      {!minimal && (
        <div className="grid grid-cols-[1fr_auto] items-start gap-4">
          <h3 className="text-[11px] uppercase leading-4 tracking-[0.14em] text-low-fog">
            {name}
          </h3>
          <p className="text-[11px] text-low-muted">${price}</p>
          <div className="col-span-2 flex items-center justify-between">
            {colors.length > 0 && (
              <div className="flex gap-1.5" aria-label="Available colors">
                {colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="size-2 border border-low-line"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
            <span className="text-[10px] uppercase tracking-[0.14em] text-low-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Inspect
            </span>
          </div>
        </div>
      )}
    </article>
  );
}
