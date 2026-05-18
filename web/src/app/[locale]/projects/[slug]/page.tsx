import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { InlineVideo } from "@/components/ui/InlineVideo";
import { getProject, getProjects, getRelatedProjects } from "@/lib/projects";

export function generateStaticParams() {
  return getProjects("ru").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = getProject(slug, locale);
  if (!project) return {};
  return {
    title: project.name,
    description: project.intro,
    openGraph: { images: [project.cover] },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(slug, locale);
  if (!project) notFound();

  const t = await getTranslations("projects");
  const tCta = await getTranslations("cta");
  const related = getRelatedProjects(project.slug, project.type, 3, locale);

  const metaPairs: { label: string; value: string }[] = [
    { label: t("meta.area"), value: project.area },
    { label: t("meta.duration"), value: project.duration },
    { label: t("meta.type"), value: project.typeLabel },
    { label: t("meta.segment"), value: project.segment },
    { label: t("meta.location"), value: project.location },
  ];

  return (
    <>
      <section className="relative bg-bg pt-32 lg:pt-48 pb-16 lg:pb-24 border-b border-border-line">
        <Container>
          <Reveal>
            <Link
              href="/projects"
              className="text-xs uppercase tracking-[0.22em] text-text-dim hover:text-accent transition-colors"
            >
              ← {t("indexTitle")}
            </Link>
            <h1 className="mt-8 font-display font-extrabold text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.02] max-w-4xl">
              {project.name}
            </h1>
            <p className="mt-7 max-w-2xl text-base md:text-lg text-text-muted leading-relaxed">
              {project.intro}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-bg">
        <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] bg-bg-elevated">
          <Image
            src={project.hero}
            alt={project.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-bg py-16 lg:py-24 border-b border-border-line">
        <Container>
          <Reveal>
            <dl className="grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-6">
              {metaPairs.map((m) => (
                <div key={m.label}>
                  <dt className="text-[11px] uppercase tracking-[0.22em] text-text-dim">
                    {m.label}
                  </dt>
                  <dd className="mt-2 font-display font-bold text-lg lg:text-xl tracking-tight">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {project.videos && project.videos.length > 0 && (
        <section className="bg-bg py-20 lg:py-28 border-b border-border-line">
          <Container>
            <Reveal>
              <div className="text-xs uppercase tracking-[0.22em] text-accent mb-4">
                Видео с объекта
              </div>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
                Как это выглядит вживую
              </h2>
            </Reveal>
            <div
              className={`mt-12 grid gap-5 ${
                project.videos.length === 1
                  ? "md:grid-cols-1 max-w-xl mx-auto"
                  : project.videos.length === 2
                  ? "md:grid-cols-2 max-w-3xl mx-auto"
                  : "md:grid-cols-3"
              }`}
            >
              {project.videos.map((v, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <figure>
                    <InlineVideo
                      src={v.src}
                      poster={v.poster}
                      aspect={v.aspect === "portrait" ? "portrait" : "video"}
                    />
                    {v.caption && (
                      <figcaption className="mt-3 text-sm text-text-dim text-center">
                        {v.caption}
                      </figcaption>
                    )}
                  </figure>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {project.materials.length > 0 && (
        <section className="bg-bg py-20 lg:py-28 border-b border-border-line">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12">
              <Reveal className="lg:col-span-4">
                <div className="text-xs uppercase tracking-[0.22em] text-accent">
                  {t("materialsTitle")}
                </div>
                <h2 className="mt-4 font-display font-extrabold text-3xl md:text-4xl tracking-tight">
                  {t("materialsTitle")}
                </h2>
              </Reveal>
              <Reveal delay={0.06} className="lg:col-span-7 lg:col-start-6">
                <ul className="flex flex-col gap-3 text-base text-text">
                  {project.materials.map((m) => (
                    <li
                      key={m}
                      className="flex items-start gap-3 border-b border-border-line pb-3"
                    >
                      <span aria-hidden className="mt-2.5 size-1 rounded-full bg-accent shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section className="bg-bg py-20 lg:py-28 border-b border-border-line">
          <Container>
            <Reveal>
              <div className="text-xs uppercase tracking-[0.22em] text-accent mb-4">
                {t("galleryTitle")}
              </div>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
                {t("galleryTitle")}
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {project.gallery.map((shot, i) => (
                <Reveal
                  key={i}
                  delay={(i % 2) * 0.06}
                  className={i === 0 ? "md:col-span-2" : ""}
                >
                  <figure>
                    <div
                      className={`relative ${
                        i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"
                      } overflow-hidden bg-bg-elevated rounded-sm`}
                    >
                      <Image
                        src={shot.src}
                        alt={shot.caption ?? project.name}
                        fill
                        sizes={i === 0 ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                        className="object-cover"
                      />
                    </div>
                    {shot.caption && (
                      <figcaption className="mt-3 text-sm text-text-dim">
                        {shot.caption}
                      </figcaption>
                    )}
                  </figure>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {project.quote && (
        <section className="bg-paper-soft text-bg py-24 lg:py-32 border-y border-paper-border">
          <Container>
            <Reveal>
              <figure className="max-w-3xl">
                <span
                  aria-hidden
                  className="font-editorial italic text-6xl text-accent leading-none -mb-2 block"
                >
                  &ldquo;
                </span>
                <blockquote className="font-editorial italic text-2xl lg:text-3xl leading-[1.4] text-bg">
                  {project.quote.text}
                </blockquote>
                <figcaption className="mt-7 pt-5 border-t border-paper-border text-sm text-text-dim">
                  {project.quote.author}
                </figcaption>
              </figure>
            </Reveal>
          </Container>
        </section>
      )}

      <section className="bg-bg py-20 lg:py-28 border-t border-border-line">
        <Container className="text-center">
          <Reveal>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight max-w-3xl mx-auto leading-[1.04]">
              {tCta("ready")}
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

      {related.length > 0 && (
        <section className="bg-bg py-20 lg:py-28 border-t border-border-line">
          <Container>
            <Reveal>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight">
                {t("relatedTitle")}
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.06}>
                  <Link href={`/projects/${p.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-bg-elevated rounded-sm">
                      <Image
                        src={p.cover}
                        alt={p.name}
                        fill
                        sizes="(min-width: 768px) 30vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="font-display font-bold text-lg tracking-tight">
                        {p.name}
                      </h3>
                      <span className="text-xs text-text-dim tabular">{p.area}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
