import fs from "node:fs";
import path from "node:path";
import type { GlobalAfterChangeHook, Payload } from "payload";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const LOCALES = ["ru", "en", "uz", "tr"] as const;

/**
 * Sync siteSettings → src/data/site.<locale>.json per locale.
 * Phone/email/socials are global; address and hours can vary per locale.
 */
async function writeLocale(payload: Payload, locale: (typeof LOCALES)[number]) {
  const doc = (await payload.findGlobal({
    slug: "siteSettings",
    locale,
    fallbackLocale: "ru",
  })) as Record<string, string | undefined>;

  const next = {
    name: "Quantum Form",
    domain: "quantumform.uz",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://quantumform.uz",
    phone: doc.phone ?? "+998 __ ___ __ __",
    email: doc.email ?? "hello@quantumform.uz",
    address: doc.address ?? "Tashkent, Uzbekistan",
    hours: doc.hours ?? "Пн–Сб 9:00–19:00",
    social: {
      instagram: doc.instagram ?? "",
      telegram: doc.telegram ?? "",
      whatsapp: doc.whatsapp ?? "",
    },
  };

  fs.writeFileSync(
    path.join(DATA_DIR, `site.${locale}.json`),
    JSON.stringify(next, null, 2) + "\n",
    "utf-8",
  );
}

export const syncSiteAfterChange: GlobalAfterChangeHook = async ({ req }) => {
  try {
    for (const locale of LOCALES) {
      await writeLocale(req.payload, locale);
    }
  } catch (err) {
    req.payload.logger.error({ err }, "[syncSite] failed to write per-locale site files");
  }
};
