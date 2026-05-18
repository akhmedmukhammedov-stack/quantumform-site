import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getBlogPost, getBlogPosts } from "@/lib/blog";

export function generateStaticParams() {
  return getBlogPosts("ru").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getBlogPost(locale, slug) ?? getBlogPost("ru", slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getBlogPost(locale, slug) ?? getBlogPost("ru", slug);
  if (!post) notFound();

  const t = await getTranslations("blog");
  const tCommon = await getTranslations("common");
  const allPosts = (getBlogPosts(locale).length ? getBlogPosts(locale) : getBlogPosts("ru")).filter(
    (p) => p.slug !== post.slug,
  );
  const related = allPosts.filter((p) => p.category === post.category).slice(0, 3);
  const fallback = allPosts.slice(0, 3);
  const relatedList = related.length ? related : fallback;

  return (
    <>
      <section className="bg-bg pt-32 lg:pt-44 pb-12 lg:pb-16 border-b border-border-line">
        <Container>
          <Reveal>
            <Link
              href="/blog"
              className="text-xs uppercase tracking-[0.22em] text-text-dim hover:text-accent transition-colors"
            >
              ← {t("indexTitle")}
            </Link>
            <div className="mt-8 text-xs uppercase tracking-[0.22em] text-accent">
              {t(`categories.${post.category}`)}
            </div>
            <h1 className="mt-5 font-display font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.04] max-w-4xl">
              {post.title}
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-text-dim">
              <span>{formatDate(post.date, locale)}</span>
              <span className="size-0.5 rounded-full bg-text-dim" />
              <span>{tCommon("minutesRead", { minutes: post.readingMinutes })}</span>
              <span className="size-0.5 rounded-full bg-text-dim" />
              <span>{t("authorTeam")}</span>
            </div>
          </Reveal>
        </Container>
      </section>

      <article className="bg-bg py-16 lg:py-24">
        <Container>
          <Reveal>
            <div className="prose-qf max-w-3xl mx-auto">
              <MDXRemote source={post.body} />
            </div>
          </Reveal>
        </Container>
      </article>

      {relatedList.length > 0 && (
        <section className="bg-bg py-16 lg:py-24 border-t border-border-line">
          <Container>
            <Reveal>
              <h2 className="font-display font-bold text-2xl tracking-tight">
                {t("relatedTitle")}
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {relatedList.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.06}>
                  <Link href={`/blog/${p.slug}`} className="group flex flex-col h-full">
                    <div className="text-xs uppercase tracking-[0.18em] text-accent">
                      {t(`categories.${p.category}`)}
                    </div>
                    <h3 className="mt-3 font-display font-bold text-lg tracking-tight leading-snug group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                    <div className="mt-auto pt-4 text-xs text-text-dim">
                      {formatDate(p.date, locale)}
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
