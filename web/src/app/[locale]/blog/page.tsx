import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getBlogPosts } from "@/lib/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("indexTitle"), description: t("indexBody") };
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const tCommon = await getTranslations("common");
  const allPosts = getBlogPosts(locale);
  const ruPosts = allPosts.length ? allPosts : getBlogPosts("ru");

  const [featured, ...rest] = ruPosts;

  return (
    <>
      <section className="bg-bg pt-32 lg:pt-48 pb-12 lg:pb-16 border-b border-border-line">
        <Container>
          <Reveal>
            <div className="text-xs uppercase tracking-[0.22em] text-accent mb-6">
              {t("categories.all")} · Quantum Form
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

      {featured && (
        <section className="bg-bg py-16 lg:py-24 border-b border-border-line">
          <Container>
            <Reveal>
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid gap-8 lg:gap-14 lg:grid-cols-12 items-end"
              >
                <div className="lg:col-span-7">
                  <div className="text-xs uppercase tracking-[0.22em] text-accent">
                    {t(`categories.${featured.category}`)}
                  </div>
                  <h2 className="mt-5 font-display font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.04] group-hover:text-accent transition-colors">
                    {featured.title}
                  </h2>
                  <p className="mt-6 max-w-xl text-base text-text-muted leading-relaxed">
                    {featured.excerpt}
                  </p>
                </div>
                <div className="lg:col-span-5 lg:text-right">
                  <div className="flex flex-wrap lg:justify-end items-center gap-3 text-xs text-text-dim">
                    <span>{formatDate(featured.date, locale)}</span>
                    <span className="size-0.5 rounded-full bg-text-dim" />
                    <span>{tCommon("minutesRead", { minutes: featured.readingMinutes })}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </Container>
        </section>
      )}

      <section className="bg-bg py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:gap-x-10 lg:gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                <Link href={`/blog/${p.slug}`} className="group flex flex-col h-full">
                  <div className="aspect-[4/3] bg-bg-elevated border border-border-line overflow-hidden rounded-sm flex items-center justify-center">
                    <span className="font-display font-extrabold text-7xl text-border-line tabular tracking-tight">
                      0{i + 2}
                    </span>
                  </div>
                  <div className="mt-5 text-xs uppercase tracking-[0.18em] text-accent">
                    {t(`categories.${p.category}`)}
                  </div>
                  <h3 className="mt-3 font-display font-bold text-lg lg:text-xl tracking-tight leading-snug group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm text-text-muted leading-relaxed">
                    {p.excerpt}
                  </p>
                  <div className="mt-auto pt-5 text-xs text-text-dim flex items-center gap-3">
                    <span>{formatDate(p.date, locale)}</span>
                    <span className="size-0.5 rounded-full bg-text-dim" />
                    <span>{tCommon("minutesRead", { minutes: p.readingMinutes })}</span>
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
