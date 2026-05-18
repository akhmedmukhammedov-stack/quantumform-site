import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

type ServiceKey = "apartment" | "cottage" | "office" | "dacha";

const services: { key: ServiceKey; href: string; image: string }[] = [
  { key: "apartment", href: "/services#apartment", image: "/media/posters/IMG_3843-poster.jpg" },
  { key: "cottage",   href: "/services#cottage",   image: "/media/posters/IMG_8724-poster.jpg" },
  { key: "office",    href: "/services#office",    image: "/media/posters/IMG_6213-poster.jpg" },
  { key: "dacha",     href: "/services#dacha",     image: "/media/posters/IMG_5456-poster.jpg" },
];

export function ServicesPreview() {
  const t = useTranslations("home.services");
  const tCta = useTranslations("cta");

  return (
    <section className="bg-bg py-20 sm:py-24 lg:py-36">
      <Container>
        <Reveal>
          <SectionHeader eyebrow={t("eyebrow")} title={t("title")} size="xl" />
        </Reveal>

        <div className="mt-12 sm:mt-16 lg:mt-20 grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.key} delay={i * 0.06}>
              <Link
                href={service.href}
                className="group relative block aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-sm bg-bg-elevated"
              >
                <Image
                  src={service.image}
                  alt={t(`${service.key}.title`)}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <div className="font-display font-extrabold text-lg sm:text-xl lg:text-2xl tracking-tight">
                    {t(`${service.key}.title`)}
                  </div>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-text-muted leading-snug max-w-[220px] line-clamp-2 sm:line-clamp-none">
                    {t(`${service.key}.description`)}
                  </p>
                  <span className="block mt-3 sm:mt-5 h-px w-8 sm:w-10 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-14 flex">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent transition-colors"
            >
              <span className="border-b border-border-line group-hover:border-accent pb-1">
                {tCta("viewServices")}
              </span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
