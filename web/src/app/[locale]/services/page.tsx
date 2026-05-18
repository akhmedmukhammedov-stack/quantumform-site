import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

type ServiceKey = "apartment" | "cottage" | "office" | "dacha";

const services: { key: ServiceKey; anchor: string; image: string }[] = [
  { key: "apartment", anchor: "apartment", image: "/media/posters/IMG_3843-poster.jpg" },
  { key: "cottage",   anchor: "cottage",   image: "/media/posters/IMG_8724-poster.jpg" },
  { key: "office",    anchor: "office",    image: "/media/posters/IMG_6213-poster.jpg" },
  { key: "dacha",     anchor: "dacha",     image: "/media/posters/IMG_5456-poster.jpg" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.hero" });
  return { title: t("title"), description: t("body") };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  return (
    <>
      <section className="bg-bg pt-32 lg:pt-48 pb-20 lg:pb-28 border-b border-border-line">
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

      {services.map((service, i) => (
        <ServiceSection
          key={service.key}
          serviceKey={service.key}
          anchor={service.anchor}
          image={service.image}
          mirrored={i % 2 === 1}
        />
      ))}
    </>
  );
}

function ServiceSection({
  serviceKey,
  anchor,
  image,
  mirrored,
}: {
  serviceKey: ServiceKey;
  anchor: string;
  image: string;
  mirrored: boolean;
}) {
  const t = useTranslations("services");
  const tCta = useTranslations("cta");
  const includedItems = t.raw("included.items") as string[];
  const midItems = t.raw("tiers.mid.items") as string[];
  const premiumItems = t.raw("tiers.premium.items") as string[];

  return (
    <section
      id={anchor}
      className="bg-bg py-24 lg:py-36 border-b border-border-line scroll-mt-24"
    >
      <Container>
        <div
          className={`grid gap-12 lg:gap-20 lg:grid-cols-12 ${
            mirrored ? "lg:grid-flow-dense" : ""
          }`}
        >
          <Reveal
            className={`relative aspect-[4/3] lg:aspect-auto lg:h-[560px] overflow-hidden rounded-sm bg-bg-elevated lg:col-span-7 ${
              mirrored ? "lg:col-start-6" : ""
            }`}
          >
            <Image
              src={image}
              alt={t(`${serviceKey}.title`)}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <div className={`lg:col-span-5 ${mirrored ? "lg:col-start-1 lg:row-start-1" : ""}`}>
            <Reveal>
              <div className="text-xs uppercase tracking-[0.22em] text-accent">
                {t(`${serviceKey}.title`)}
              </div>
              <h2 className="mt-4 font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.05]">
                {t(`${serviceKey}.title`)}
              </h2>
              <p className="mt-5 text-text-muted leading-relaxed">
                {t(`${serviceKey}.lede`)}
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-10">
                <div className="text-xs uppercase tracking-[0.18em] text-text-dim mb-4">
                  {t("included.title")}
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-text">
                  {includedItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span aria-hidden className="mt-2 size-1 rounded-full bg-accent shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <TierCard
                  label={t("tiers.mid.label")}
                  items={midItems}
                  priceNote={t("priceNote")}
                />
                <TierCard
                  label={t("tiers.premium.label")}
                  items={premiumItems}
                  priceNote={t("priceNote")}
                  accent
                />
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-text-dim">
                    {t("timelineLabel")}
                  </div>
                  <div className="mt-1.5 font-display font-bold text-lg tracking-tight">
                    {t(`${serviceKey}.timeline`)}
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="ml-auto inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-bg font-semibold text-sm h-11 px-6 rounded-full transition-colors"
                >
                  {tCta("freeMeasurement")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

function TierCard({
  label,
  items,
  priceNote,
  accent = false,
}: {
  label: string;
  items: string[];
  priceNote: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-sm border ${
        accent
          ? "border-accent/40 bg-accent/[0.05]"
          : "border-border-line bg-bg-elevated"
      }`}
    >
      <div className={`text-[11px] uppercase tracking-[0.18em] ${accent ? "text-accent" : "text-text-dim"}`}>
        {label}
      </div>
      <ul className="mt-3.5 flex flex-col gap-2 text-sm text-text leading-snug">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span aria-hidden className="mt-1.5 size-1 rounded-full bg-text-dim shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-3 border-t border-border-line/60 text-[11px] uppercase tracking-[0.18em] text-text-dim">
        {priceNote}
      </div>
    </div>
  );
}
