import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = ["measure", "design", "estimate", "build", "handover"] as const;

export function ProcessSnapshot() {
  const t = useTranslations("home.process");
  return (
    <section className="bg-paper text-bg py-20 sm:py-24 lg:py-36 border-y border-paper-border">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            tone="light"
            size="xl"
          />
        </Reveal>

        {/* Mobile: vertical timeline with continuous rail */}
        <div className="mt-12 md:hidden">
          <ol className="relative">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-paper-border" />
            {steps.map((step, i) => (
              <Reveal key={step} delay={i * 0.04}>
                <li className="relative pl-10 pb-10 last:pb-0">
                  <span className="absolute left-0 top-1.5 size-[15px] rounded-full border-2 border-accent bg-paper" />
                  <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim tabular">
                    0{i + 1}
                  </div>
                  <h3 className="mt-1.5 font-display font-bold text-lg tracking-tight text-bg">
                    {t(`steps.${step}.label`)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-dim">
                    {t(`steps.${step}.body`)}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block mt-16 lg:mt-20 relative">
          <div className="absolute top-3 left-0 right-0 h-px bg-paper-border" />
          <div className="absolute top-3 left-0 h-px w-1/5 bg-accent" />

          <ol className="grid gap-8 md:grid-cols-5">
            {steps.map((step, i) => (
              <Reveal key={step} delay={i * 0.06}>
                <li className="relative">
                  <span className="absolute top-0 left-0 -translate-y-1 block size-1.5 rounded-full bg-accent" />
                  <div className="mt-10">
                    <div className="text-xs uppercase tracking-[0.18em] text-text-dim tabular">
                      0{i + 1}
                    </div>
                    <h3 className="mt-3 font-display font-bold text-xl tracking-tight text-bg">
                      {t(`steps.${step}.label`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-dim">
                      {t(`steps.${step}.body`)}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
