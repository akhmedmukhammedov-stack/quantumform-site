import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProjects } from "@/lib/projects";
import { getBlogPosts } from "@/lib/blog";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quantumform.uz";

const staticPaths = [
  "",
  "/services",
  "/process",
  "/projects",
  "/about",
  "/blog",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const p of staticPaths) {
      out.push({
        url: `${baseUrl}/${locale}${p}`,
        changeFrequency: "monthly",
        priority: p === "" ? 1 : 0.7,
      });
    }
    for (const project of getProjects(locale)) {
      out.push({
        url: `${baseUrl}/${locale}/projects/${project.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const post of getBlogPosts(locale).length ? getBlogPosts(locale) : getBlogPosts("ru")) {
      out.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: post.date,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return out;
}
