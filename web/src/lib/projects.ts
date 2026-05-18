import projectsRu from "@/data/projects.ru.json";
import projectsEn from "@/data/projects.en.json";
import projectsUz from "@/data/projects.uz.json";
import projectsTr from "@/data/projects.tr.json";

export type ProjectType = "apartment" | "cottage" | "office" | "dacha";
export type ProjectStatus = "completed" | "ongoing";

export type Project = {
  slug: string;
  name: string;
  type: ProjectType;
  typeLabel: string;
  segment: string;
  area: string;
  location: string;
  duration: string;
  status: ProjectStatus;
  year: string;
  cover: string;
  hero: string;
  intro: string;
  materials: string[];
  gallery: { src: string; caption?: string }[];
  videos?: { src: string; poster: string; caption?: string; aspect?: "video" | "portrait" }[];
  quote?: { text: string; author: string };
};

type Locale = "ru" | "en" | "uz" | "tr";

const BY_LOCALE: Record<Locale, Project[]> = {
  ru: projectsRu as Project[],
  en: projectsEn as Project[],
  uz: projectsUz as Project[],
  tr: projectsTr as Project[],
};

export function getProjects(locale: string = "ru"): Project[] {
  return BY_LOCALE[(locale as Locale)] ?? BY_LOCALE.ru;
}

export const projects = BY_LOCALE.ru;

export function getProject(slug: string, locale: string = "ru"): Project | undefined {
  return getProjects(locale).find((p) => p.slug === slug);
}

export function getRelatedProjects(
  slug: string,
  type: ProjectType,
  limit = 3,
  locale: string = "ru",
): Project[] {
  const all = getProjects(locale);
  const same = all.filter((p) => p.slug !== slug && p.type === type).slice(0, limit);
  if (same.length >= limit) return same;
  const fill = all.filter((p) => p.slug !== slug && p.type !== type).slice(0, limit - same.length);
  return [...same, ...fill];
}
