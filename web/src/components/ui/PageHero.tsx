export function PageHero({
  eyebrow,
  title,
  body,
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";
  return (
    <section
      className={`${
        isLight ? "bg-paper text-bg" : "bg-bg text-text"
      } pt-32 lg:pt-48 pb-16 lg:pb-24 border-b ${
        isLight ? "border-paper-border" : "border-border-line"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {eyebrow && (
          <div
            className={`text-xs uppercase tracking-[0.22em] mb-6 ${
              isLight ? "text-text-dim" : "text-accent"
            }`}
          >
            {eyebrow}
          </div>
        )}
        <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-tight max-w-4xl leading-[1.04]">
          {title}
        </h1>
        {body && (
          <p
            className={`mt-6 max-w-2xl text-base md:text-lg leading-relaxed ${
              isLight ? "text-text-dim" : "text-text-muted"
            }`}
          >
            {body}
          </p>
        )}
      </div>
    </section>
  );
}
