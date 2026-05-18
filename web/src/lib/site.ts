import siteRu from "@/data/site.ru.json";
import siteEn from "@/data/site.en.json";
import siteUz from "@/data/site.uz.json";
import siteTr from "@/data/site.tr.json";

export type SiteData = {
  name: string;
  domain: string;
  url: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  social: {
    instagram: string;
    telegram: string;
    whatsapp: string;
  };
};

type Locale = "ru" | "en" | "uz" | "tr";

const BY_LOCALE: Record<Locale, SiteData> = {
  ru: siteRu as SiteData,
  en: siteEn as SiteData,
  uz: siteUz as SiteData,
  tr: siteTr as SiteData,
};

export function getSite(locale: string = "ru"): SiteData {
  return BY_LOCALE[(locale as Locale)] ?? BY_LOCALE.ru;
}

// Back-compat: components that already import `site` get the RU version.
// New code should use getSite(locale).
export const site = BY_LOCALE.ru;
