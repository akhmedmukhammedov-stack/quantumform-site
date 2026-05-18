import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import ru from "../messages/ru.json";

type Messages = typeof ru;

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Deep-merges localized messages over the Russian baseline.
 * Empty strings and undefined values fall back to ru, so partially-translated
 * locales (uz, tr, en in early stages) still render every page.
 */
function mergeMessages(base: unknown, override: unknown): unknown {
  if (!isObject(base) || !isObject(override)) {
    if (typeof override === "string" && override.trim() === "") return base;
    return override !== undefined ? override : base;
  }
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    out[key] = mergeMessages(base[key], override[key]);
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  let messages: Messages = ru;
  if (locale !== "ru") {
    const localized = (await import(`../messages/${locale}.json`)).default;
    messages = mergeMessages(ru, localized) as Messages;
  }

  return { locale, messages };
});
