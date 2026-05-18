import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "next-intl";
import { getSite } from "@/lib/site";

const navItems = [
  { href: "/services", key: "services" },
  { href: "/process", key: "process" },
  { href: "/projects", key: "projects" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const site = getSite(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-line bg-bg pt-16 sm:pt-20 pb-8 sm:pb-10">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10">
        <div className="grid gap-10 sm:gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image
              src="/logo.png"
              alt="Quantum Form"
              width={264}
              height={293}
              className="h-12 sm:h-14 w-auto"
            />
            <p className="mt-5 sm:mt-6 max-w-sm text-sm text-text-muted leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="md:col-span-3 text-sm">
            <div className="text-xs uppercase tracking-[0.18em] text-text-dim mb-4">
              {t("footer.navigation")}
            </div>
            <ul className="flex flex-col gap-2.5 text-text-muted">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-text transition-colors">
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 text-sm">
            <div className="text-xs uppercase tracking-[0.18em] text-text-dim mb-4">
              {t("footer.contacts")}
            </div>
            <ul className="flex flex-col gap-2.5 text-text-muted">
              <li>
                <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="hover:text-text">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-text">
                  {site.email}
                </a>
              </li>
              <li>{site.address}</li>
              <li className="text-text-dim">{site.hours}</li>
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted">
              <a href={site.social.instagram} target="_blank" rel="noopener" className="hover:text-text">
                Instagram
              </a>
              <a href={site.social.telegram} target="_blank" rel="noopener" className="hover:text-text">
                Telegram
              </a>
              <a href={site.social.whatsapp} target="_blank" rel="noopener" className="hover:text-text">
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 pt-6 border-t border-border-line flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-5 text-xs text-text-dim">
          <span>© {year} Quantum Form. {t("footer.rights")}.</span>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
