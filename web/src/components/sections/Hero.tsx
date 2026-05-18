"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), {
  ssr: false,
  loading: () => null,
});

export function Hero() {
  const t = useTranslations();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden pt-28 pb-16 sm:pb-20 lg:pb-28">
      <Image
        src="/media/posters/IMG_3843-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center -z-10"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/90 via-bg/70 to-bg/95" />
      {!prefersReducedMotion && (
        <div
          aria-hidden
          className="absolute right-[-12%] top-[10%] w-[48%] h-[60%] -z-10 hidden lg:block opacity-50"
        >
          <HeroScene />
        </div>
      )}

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.24em] text-accent mb-6 sm:mb-8 flex items-center gap-2.5 sm:gap-3">
            <span className="size-1.5 rounded-full bg-accent" />
            Quantum Form · Tashkent
          </div>
          <h1 className="font-display font-extrabold text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] tracking-tight leading-[1.02] sm:leading-[0.98]">
            {t("home.hero.headline")}
          </h1>
          <p className="mt-6 sm:mt-8 max-w-2xl text-sm sm:text-base md:text-lg text-text-muted leading-relaxed">
            {t("home.hero.subheadline")}
          </p>
          <div className="mt-9 sm:mt-12 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-bg font-semibold text-sm h-12 px-7 rounded-full transition-colors"
            >
              {t("cta.orderMeasurement")}
            </Link>
            <Link
              href="/process"
              className="inline-flex items-center text-text-muted hover:text-text text-sm h-12 px-1 transition-colors"
            >
              {t("cta.viewProcess")} →
            </Link>
          </div>
        </motion.div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3 text-text-dim"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">
          {t("home.hero.scrollHint")}
        </span>
        <span className="w-px h-10 bg-gradient-to-b from-text-dim to-transparent" />
      </motion.div>
    </section>
  );
}
