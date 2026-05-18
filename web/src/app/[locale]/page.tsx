import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { RecentProjects } from "@/components/sections/RecentProjects";
import { ProcessSnapshot } from "@/components/sections/ProcessSnapshot";
import { NumbersStrip } from "@/components/sections/NumbersStrip";
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Pillars />
      <ServicesPreview />
      <RecentProjects />
      <ProcessSnapshot />
      <NumbersStrip />
      <BlogTeaser />
      <FinalCTA />
    </>
  );
}
