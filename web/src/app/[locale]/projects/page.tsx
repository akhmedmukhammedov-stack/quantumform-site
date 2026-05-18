import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getProjects } from "@/lib/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return { title: t("indexTitle"), description: t("indexBody") };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const projects = getProjects(locale);

  return (
    <>
      <section className="bg-bg pt-32 lg:pt-48 pb-16 lg:pb-24 border-b border-border-line">
        <Container>
          <Reveal>
            <div className="text-xs uppercase tracking-[0.22em] text-accent mb-6">
              {t("indexEyebrow")}
            </div>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[0.98] max-w-5xl">
              {t("indexTitle")}
            </h1>
            <p className="mt-8 max-w-2xl text-base md:text-lg text-text-muted leading-relaxed">
              {t("indexBody")}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-bg py-20 lg:py-28">
        <Container>
          <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:gap-x-14 lg:gap-y-24">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 0.06}>
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
                        {t("meta.ongoing")}
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="font-display font-bold text-xl lg:text-2xl tracking-tight">
                      {p.name}
                    </h2>
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
        </Container>
      </section>
    </>
  );
}
