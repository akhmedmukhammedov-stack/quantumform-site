import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getSite } from "@/lib/site";

export function FinalCTA() {
  const t = useTranslations("home.finalCta");
  const tCta = useTranslations("cta");
  const locale = useLocale();
  const site = getSite(locale);

  return (
    <section className="relative bg-bg py-20 sm:py-28 lg:py-44 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(227,111,42,0.12),transparent_65%)]" />
      <Container className="relative">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.04]">
              {t("title")}
            </h2>
            <p className="mt-5 sm:mt-7 text-sm sm:text-base lg:text-lg text-text-muted leading-relaxed">
              {t("body")}
            </p>
            <div className="mt-9 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-bg font-semibold text-sm h-12 px-8 rounded-full transition-colors w-full sm:w-auto"
              >
                {tCta("orderMeasurement")}
              </Link>
              <a
                href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                className="inline-flex items-center justify-center text-text-muted hover:text-text text-sm h-12 px-1 tabular transition-colors"
              >
                {site.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
