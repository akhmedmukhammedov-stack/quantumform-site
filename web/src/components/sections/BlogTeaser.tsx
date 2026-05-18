import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getBlogPosts } from "@/lib/blog";

function formatDate(iso: string, locale: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogTeaser() {
  const t = useTranslations("home.blog");
  const tBlog = useTranslations("blog");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const posts = getBlogPosts(locale).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="bg-bg py-20 sm:py-24 lg:py-36 border-t border-border-line">
      <Container>
        <Reveal>
          <SectionHeader eyebrow={t("eyebrow")} title={t("title")} size="lg" />
        </Reveal>

        <div className="mt-12 sm:mt-16 lg:mt-20 grid gap-8 sm:gap-10 lg:gap-8 md:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link href={`/blog/${p.slug}`} className="group flex flex-col h-full">
                <div className="aspect-[4/3] bg-bg-elevated border border-border-line overflow-hidden rounded-sm flex items-center justify-center">
                  <span className="font-display font-extrabold text-7xl text-border-line tabular tracking-tight">
                    0{i + 1}
                  </span>
                </div>
                <div className="mt-5 text-xs uppercase tracking-[0.18em] text-accent">
                  {tBlog(`categories.${p.category}`)}
                </div>
                <h3 className="mt-3 font-display font-bold text-lg lg:text-xl tracking-tight leading-snug group-hover:text-accent transition-colors">
                  {p.title}
                </h3>
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
  );
}
