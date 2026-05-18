"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/services", key: "services" },
  { href: "/process", key: "process" },
  { href: "/projects", key: "projects" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
] as const;

export function Header() {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "bg-bg/90 backdrop-blur-md border-b border-border-line"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-4 sm:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="Quantum Form"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/logo.png"
              alt="Quantum Form"
              width={264}
              height={293}
              priority
              className="h-9 sm:h-10 lg:h-11 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm text-text-muted font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-text transition-colors"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-bg font-semibold text-sm h-10 px-5 rounded-full transition-colors"
            >
              {t("cta.freeMeasurement")}
            </Link>
            <button
              type="button"
              className="lg:hidden relative size-10 -mr-2 flex items-center justify-center text-text"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Menu"
            >
              <span
                className={cn(
                  "absolute block w-5 h-px bg-current transition-transform duration-300",
                  open ? "rotate-45" : "-translate-y-1.5",
                )}
              />
              <span
                className={cn(
                  "absolute block w-5 h-px bg-current transition-transform duration-300",
                  open ? "-rotate-45" : "translate-y-1.5",
                )}
              />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
            open ? "max-h-[80svh] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <nav className="pt-3 pb-8 flex flex-col gap-1 text-base">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-3.5 text-text-muted hover:text-text border-b border-border-line/60 transition-colors"
              >
                <span>{t(`nav.${item.key}`)}</span>
                <span aria-hidden className="text-text-dim">→</span>
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-5 inline-flex items-center justify-center bg-accent text-bg font-semibold text-sm h-12 px-6 rounded-full"
            >
              {t("cta.freeMeasurement")}
            </Link>
            <div className="mt-5 pt-5 border-t border-border-line/60">
              <LanguageSwitcher size="lg" />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
