import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProjects } from "@/lib/projects";

export function RecentProjects() {
  const t = useTranslations("home.projects");
  const tCta = useTranslations("cta");
  const tProjects = useTranslations("projects");
  const locale = useLocale();

  const featured = getProjects(locale).slice(0, 4);

  return (
    <section className="bg-bg py-20 sm:py-24 lg:py-36">
      <Container>
        <Reveal>
          <SectionHeader eyebrow={t("eyebrow")} title={t("title")} size="xl" />
        </Reveal>

        <div className="mt-12 sm:mt-16 lg:mt-20 grid gap-8 sm:gap-10 lg:gap-14 md:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link href={`/projects/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-bg-elevated rounded-sm">
                  <Image
                    src={p.cover}
                    alt={p.name}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  {p.status === "ongoing" && (
                    <span className="absolute top-4 left-4 bg-bg/85 backdrop-blur-sm text-[10px] uppercase tracking-[0.22em] text-accent border border-accent/30 px-3 py-1.5 rounded-full">
                      {tProjects("meta.ongoing")}
                    </span>
                  )}
                </div>
                <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display font-bold text-xl tracking-tight">
                    {p.name}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.18em] text-text-dim tabular">
                    {p.area}
                  </span>
                </div>
                <div className="mt-1.5 text-sm text-text-muted">
                  {p.typeLabel} · {p.segment} · {p.location}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-14 flex">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent transition-colors"
            >
              <span className="border-b border-border-line group-hover:border-accent pb-1">
                {tCta("viewProjects")}
              </span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
