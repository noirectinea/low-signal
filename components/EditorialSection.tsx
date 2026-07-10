interface EditorialSectionProps {
  title?: string;
  subtitle?: string;
  text?: string;
  quote?: string;
  align?: "left" | "center" | "right";
  hasOverlay?: boolean;
}

export function EditorialSection({
  title,
  subtitle,
  text,
  quote,
  align = "left",
  hasOverlay = false,
}: EditorialSectionProps) {
  const alignClass = {
    left: "md:text-left",
    center: "text-center",
    right: "md:text-right",
  }[align];

  return (
    <section className="relative w-full overflow-hidden bg-low-black px-4 py-24 sm:px-6 md:py-36 lg:px-8">
      {hasOverlay && (
        <div className="absolute right-0 top-0 h-full w-1/3 bg-low-ash/55" />
      )}

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className={`space-y-8 ${alignClass}`}>
          {title && (
            <h2 className="max-w-3xl font-serif text-5xl font-semibold uppercase leading-[0.92] tracking-[-0.04em] text-low-fog md:text-7xl">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="text-[10px] uppercase tracking-[0.18em] text-low-muted">
              {subtitle}
            </p>
          )}

          {quote && (
            <blockquote className="max-w-3xl">
              <p className="border-l border-low-bone pl-6 font-serif text-3xl font-medium uppercase leading-[1] tracking-[-0.02em] text-low-paper md:text-5xl">
                {quote}
              </p>
            </blockquote>
          )}

          {text && (
            <p className="max-w-2xl text-base leading-7 text-low-muted">
              {text}
            </p>
          )}
        </div>
      </div>

      {align === "right" && (
        <div className="absolute left-0 top-1/2 h-32 w-px -translate-y-1/2 bg-low-line" />
      )}
    </section>
  );
}
