import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const stepKeys = ["measure", "design", "estimate", "build", "handover"] as const;
const pillarKeys = ["deadline", "price", "plan"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "process.hero" });
  return { title: t("title"), description: t("body") };
}

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("process");
  const tCta = await getTranslations("cta");

  return (
    <>
      <section className="bg-bg pt-32 lg:pt-48 pb-16 lg:pb-24 border-b border-border-line">
        <Container>
          <Reveal>
            <div className="text-xs uppercase tracking-[0.22em] text-accent mb-6">
              {t("hero.eyebrow")}
            </div>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[0.98] max-w-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-8 max-w-2xl text-base md:text-lg text-text-muted leading-relaxed">
              {t("hero.body")}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-bg py-24 lg:py-32">
        <Container>
          <ol className="flex flex-col gap-24 lg:gap-32">
            {stepKeys.map((key, i) => (
              <ProcessStep key={key} stepKey={key} index={i} mirrored={i % 2 === 1} />
            ))}
          </ol>
        </Container>
      </section>

      <PillarsCallout />

      <section className="bg-bg py-24 lg:py-32 border-t border-border-line">
        <Container className="text-center">
          <Reveal>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-3xl mx-auto leading-[1.04]">
              {tCta("ready")}
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-bg font-semibold text-sm h-12 px-8 rounded-full transition-colors"
              >
                {tCta("orderMeasurement")}
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

function ProcessStep({
  stepKey,
  index,
  mirrored,
}: {
  stepKey: (typeof stepKeys)[number];
  index: number;
  mirrored: boolean;
}) {
  const t = useTranslations("process.steps");

  return (
    <li className="grid gap-10 lg:gap-16 lg:grid-cols-12 lg:items-start">
      <Reveal
        className={`lg:col-span-4 ${mirrored ? "lg:col-start-9 lg:row-start-1" : ""}`}
      >
        <div className="flex items-baseline gap-4">
          <span className="font-display font-extrabold text-7xl lg:text-8xl text-accent leading-none tabular">
            0{index + 1}
          </span>
          <span className="text-[11px] uppercase tracking-[0.22em] text-text-dim">
            {t(`${stepKey}.duration`)}
          </span>
        </div>
        <div className="mt-6 text-sm uppercase tracking-[0.18em] text-text-muted">
          {t(`${stepKey}.label`)}
        </div>
      </Reveal>

      <Reveal
        delay={0.06}
        className={`lg:col-span-7 ${mirrored ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-6"}`}
      >
        <h3 className="font-display font-bold text-2xl md:text-3xl lg:text-[2.2rem] tracking-tight leading-[1.15] max-w-2xl">
          {t(`${stepKey}.title`)}
        </h3>
        <p className="mt-5 text-text-muted leading-relaxed max-w-xl">
          {t(`${stepKey}.body`)}
        </p>
      </Reveal>
    </li>
  );
}

function PillarsCallout() {
  const t = useTranslations();
  return (
    <section className="bg-paper-soft text-bg py-24 lg:py-32 border-y border-paper-border">
      <Container>
        <Reveal>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.05] max-w-3xl text-bg">
            {t("process.pillars.title")}
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-y-12 lg:gap-x-14 md:grid-cols-3">
          {pillarKeys.map((key, i) => (
            <Reveal key={key} delay={i * 0.06}>
              <article>
                <div className="font-display font-extrabold text-5xl text-accent leading-none tabular">
                  {t(`home.pillars.${key}.number`)}
                </div>
                <div className="mt-5 text-xs uppercase tracking-[0.22em] text-text-dim">
                  {t(`home.pillars.${key}.label`)}
                </div>
                <h3 className="mt-2.5 font-display font-bold text-xl leading-snug tracking-tight text-bg">
                  {t(`home.pillars.${key}.headline`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-dim max-w-sm">
                  {t(`home.pillars.${key}.body`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
