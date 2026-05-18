import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/forms/LeadForm";
import { getSite } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.hero" });
  return { title: t("title"), description: t("body") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const site = getSite(locale);

  return (
    <>
      <section className="bg-bg pt-32 lg:pt-48 pb-12 lg:pb-16 border-b border-border-line">
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

      <section className="bg-bg py-16 lg:py-24">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-7">
              <div className="text-xs uppercase tracking-[0.22em] text-text-dim mb-6">
                {t("form.title")}
              </div>
              <LeadForm />
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-5">
              <div className="text-xs uppercase tracking-[0.22em] text-text-dim mb-6">
                {t("direct.title")}
              </div>
              <ul className="flex flex-col gap-7 text-base">
                <li>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim">
                    {t("direct.phoneLabel")}
                  </div>
                  <a
                    href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                    className="mt-1.5 inline-block font-display font-bold text-2xl tracking-tight tabular hover:text-accent"
                  >
                    {site.phone}
                  </a>
                </li>
                <li>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim">
                    {t("direct.emailLabel")}
                  </div>
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-1.5 inline-block text-text hover:text-accent"
                  >
                    {site.email}
                  </a>
                </li>
                <li>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim">
                    {t("direct.addressLabel")}
                  </div>
                  <div className="mt-1.5 text-text">{site.address}</div>
                </li>
                <li>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim">
                    {t("direct.hoursLabel")}
                  </div>
                  <div className="mt-1.5 text-text-muted">{site.hours}</div>
                </li>
              </ul>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={site.social.whatsapp}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center border border-border-line hover:border-accent text-text text-sm h-10 px-4 rounded-full transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={site.social.telegram}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center border border-border-line hover:border-accent text-text text-sm h-10 px-4 rounded-full transition-colors"
                >
                  Telegram
                </a>
                <a
                  href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                  className="inline-flex items-center justify-center border border-border-line hover:border-accent text-text text-sm h-10 px-4 rounded-full transition-colors"
                >
                  {t("form.channelOptions.call")}
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
