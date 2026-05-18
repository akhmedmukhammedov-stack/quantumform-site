import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const keys = ["years", "projects", "area"] as const;

export function NumbersStrip() {
  const t = useTranslations("home.numbers");
  return (
    <section className="bg-bg border-y border-border-line py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-y-10 sm:gap-y-12 md:grid-cols-3 md:gap-x-8">
          {keys.map((k, i) => (
            <Reveal key={k} delay={i * 0.08}>
              <div className="flex flex-col gap-2 md:gap-2.5">
                <div className="font-display font-extrabold text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl text-text tracking-tight tabular leading-none">
                  {t(`${k}.value`)}
                </div>
                <div className="text-sm text-text-muted leading-snug">
                  {t(`${k}.label`)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
