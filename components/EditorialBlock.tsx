interface EditorialBlockProps {
  text: string;
  align?: "left" | "center" | "right";
  size?: "small" | "medium" | "large";
}

export function EditorialBlock({
  text,
  align = "center",
  size = "medium",
}: EditorialBlockProps) {
  const sizeClasses = {
    small: "text-2xl",
    medium: "text-4xl md:text-5xl",
    large: "text-5xl md:text-6xl",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <section className="w-full py-24 md:py-32 px-6 bg-low-black">
      <div className="max-w-4xl mx-auto">
        <p
          className={`
            ${sizeClasses[size]}
            ${alignClasses[align]}
            font-serif font-light
            text-low-fog
            leading-tight
            tracking-wide
          `}
        >
          {text}
        </p>
      </div>
    </section>
  );
}
