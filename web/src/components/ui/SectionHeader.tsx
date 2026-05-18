import { cn } from "@/lib/cn";

export function SectionHeader({
  eyebrow,
  title,
  tone = "dark",
  align = "left",
  size = "lg",
  className,
}: {
  eyebrow?: string;
  title: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  size?: "lg" | "xl";
  className?: string;
}) {
  const eyebrowColor = tone === "light" ? "text-text-dim" : "text-accent";
  const titleColor = tone === "light" ? "text-bg" : "text-text";
  return (
    <div
      className={cn(
        align === "center" ? "text-center mx-auto" : "",
        align === "center" ? "max-w-3xl" : "max-w-3xl",
        className,
      )}
    >
      {eyebrow && (
        <div className={cn("text-xs uppercase tracking-[0.22em] mb-5", eyebrowColor)}>
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          "font-display font-extrabold tracking-tight leading-[1.04]",
          titleColor,
          size === "xl"
            ? "text-4xl md:text-5xl lg:text-6xl"
            : "text-3xl md:text-4xl lg:text-5xl",
        )}
      >
        {title}
      </h2>
    </div>
  );
}
