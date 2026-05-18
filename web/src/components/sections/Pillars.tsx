import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const keys = ["deadline", "price", "plan"] as const;

export function Pillars() {
  const t = useTranslations("home.pillars");
  const tCta = useTranslations("cta");

  return (
    <section className="bg-paper-soft text-bg py-20 sm:py-24 lg:py-36 border-t border-paper-border">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            tone="light"
            size="xl"
          />
        </Reveal>
        <div className="mt-12 sm:mt-16 lg:mt-24 grid gap-y-12 sm:gap-y-14 lg:gap-x-16 md:grid-cols-3">
          {keys.map((key, i) => (
            <Reveal key={key} delay={i * 0.08}>
              <article className="flex flex-col">
                <div className="font-display font-extrabold text-6xl sm:text-7xl lg:text-8xl text-accent leading-none tabular">
                  {t(`${key}.number`)}
                </div>
                <div className="mt-5 sm:mt-6 text-[11px] sm:text-xs uppercase tracking-[0.22em] text-text-dim">
                  {t(`${key}.label`)}
                </div>
                <h3 className="mt-2.5 sm:mt-3 font-display font-bold text-xl sm:text-2xl lg:text-[1.7rem] leading-[1.15] tracking-tight text-bg">
                  {t(`${key}.headline`)}
                </h3>
                <p className="mt-3 sm:mt-4 text-sm sm:text-[15px] leading-relaxed text-text-dim max-w-md">
                  {t(`${key}.body`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.25}>
          <div className="mt-20 flex">
            <Link
              href="/process"
              className="group inline-flex items-center gap-2 text-sm font-medium text-bg hover:text-accent transition-colors"
            >
              <span className="border-b border-bg/30 group-hover:border-accent pb-1">
                {tCta("viewProcess")}
              </span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
