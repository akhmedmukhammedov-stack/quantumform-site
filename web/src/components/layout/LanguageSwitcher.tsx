"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/cn";

const labels: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  uz: "UZ",
  tr: "TR",
};

export function LanguageSwitcher({
  tone = "dark",
  size = "sm",
}: {
  tone?: "dark" | "light";
  size?: "sm" | "lg";
}) {
  const t = useTranslations("language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  const baseColor = tone === "light" ? "text-text-dim" : "text-text-muted";
  const activeColor = tone === "light" ? "text-bg" : "text-text";

  return (
    <div
      className={cn(
        "flex items-center font-medium tracking-wide",
        size === "lg" ? "gap-3 text-sm" : "gap-1 text-xs",
        baseColor,
      )}
      aria-label={t("switcher")}
      data-pending={isPending || undefined}
    >
      <Globe
        className={cn(size === "lg" ? "size-4 opacity-70" : "size-3.5 opacity-60")}
        aria-hidden
      />
      <div className={cn("flex items-center", size === "lg" ? "gap-1" : "")} role="group">
        {routing.locales.map((loc, idx) => (
          <span key={loc} className="flex items-center">
            {idx > 0 && (
              <span
                className={cn(
                  "opacity-30",
                  size === "lg" ? "mx-2" : "mx-1",
                )}
              >
                ·
              </span>
            )}
            <button
              type="button"
              onClick={() => switchLocale(loc)}
              className={cn(
                "hover:text-accent transition-colors uppercase",
                size === "lg" ? "px-2 py-1.5 -mx-2" : "",
                loc === locale ? activeColor : "",
              )}
              aria-current={loc === locale ? "true" : undefined}
            >
              {labels[loc]}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
