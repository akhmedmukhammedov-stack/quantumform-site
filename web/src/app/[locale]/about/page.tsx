import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { InlineVideo } from "@/components/ui/InlineVideo";

const valueKeys = ["quality", "deadline", "transparency"] as const;
const numberKeys = ["years", "projects", "area"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.hero" });
  return { title: t("title"), description: t("eyebrow") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const tNumbers = await getTranslations("home.numbers");
  const tCta = await getTranslations("cta");

  return (
    <>
      <section className="relative bg-bg pt-32 lg:pt-48 pb-24 lg:pb-36 overflow-hidden border-b border-border-line">
        <Image
          src="/media/photos/IMG_6026-2400.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30 -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/70 via-bg/80 to-bg" />
        <Container className="relative">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.22em] text-accent mb-8">
              {t("hero.eyebrow")}
            </div>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[0.98] max-w-4xl">
              {t("hero.title")}
            </h1>
          </Reveal>
        </Container>
      </section>

      <section className="bg-bg py-24 lg:py-32 border-b border-border-line">
        <Container>
          <Reveal>
            <p className="font-editorial italic text-2xl md:text-3xl lg:text-[2.2rem] leading-[1.4] text-text max-w-4xl">
              {t("manifesto")}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-bg border-y border-border-line py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {numberKeys.map((k, i) => (
              <Reveal key={k} delay={i * 0.08}>
                <div className="flex items-baseline gap-5 md:flex-col md:gap-2">
                  <div className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl text-text tracking-tight tabular leading-none">
                    {tNumbers(`${k}.value`)}
                  </div>
                  <div className="text-sm text-text-muted leading-snug">
                    {tNumbers(`${k}.label`)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-bg py-24 lg:py-36 border-b border-border-line">
        <Container>
          <Reveal>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-3xl leading-[1.04]">
              {t("values.title")}
            </h2>
          </Reveal>
          <div className="mt-16 lg:mt-20 grid gap-12 lg:gap-14 md:grid-cols-3">
            {valueKeys.map((key, i) => (
              <Reveal key={key} delay={i * 0.06}>
                <article>
                  <div className="font-display font-extrabold text-5xl text-accent leading-none tabular">
                    0{i + 1}
                  </div>
                  <h3 className="mt-6 font-display font-bold text-xl lg:text-2xl tracking-tight">
                    {t(`values.items.${key}.label`)}
                  </h3>
                  <p className="mt-4 text-text-muted leading-relaxed max-w-sm">
                    {t(`values.items.${key}.body`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-bg py-16 lg:py-24 border-b border-border-line">
        <Container>
          <Reveal>
            <div className="text-xs uppercase tracking-[0.22em] text-accent mb-6">
              {t("craftLabel")}
            </div>
          </Reveal>
          <div className="grid gap-3 md:grid-cols-3">
            <Reveal>
              <InlineVideo
                src="/media/videos/IMG_6077.mp4"
                poster="/media/posters/IMG_6077-poster.jpg"
                aspect="portrait"
              />
            </Reveal>
            <Reveal delay={0.06}>
              <InlineVideo
                src="/media/videos/IMG_5448.mp4"
                poster="/media/posters/IMG_5448-poster.jpg"
                aspect="portrait"
              />
            </Reveal>
            <Reveal delay={0.12}>
              <InlineVideo
                src="/media/videos/IMG_6052.mp4"
                poster="/media/posters/IMG_6052-poster.jpg"
                aspect="portrait"
              />
            </Reveal>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden bg-bg-elevated rounded-sm">
                <Image
                  src="/media/photos/IMG_6027-2400.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="relative aspect-[4/3] overflow-hidden bg-bg-elevated rounded-sm">
                <Image
                  src="/media/photos/IMG_6026-2400.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-bg py-24 lg:py-32">
        <Container className="text-center">
          <Reveal>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight max-w-3xl mx-auto leading-[1.04]">
              {t("ctaLabel")}
            </h2>
            <div className="mt-10">
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
