import fs from "node:fs";
import path from "node:path";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  Payload,
} from "payload";

const BLOG_ROOT = path.join(process.cwd(), "content", "blog");
const LOCALES = ["ru", "en", "uz", "tr"] as const;

type LexicalText = {
  type: string;
  text?: string;
  children?: LexicalText[];
  tag?: string;
  format?: number;
};

function nodeToMarkdown(node: LexicalText, depth = 0): string {
  if (!node) return "";
  if (node.type === "text") {
    let s = node.text ?? "";
    if (node.format) {
      if (node.format & 1) s = `**${s}**`;
      if (node.format & 2) s = `*${s}*`;
    }
    return s;
  }
  const childrenMd = (node.children ?? []).map((c) => nodeToMarkdown(c, depth + 1)).join("");
  switch (node.type) {
    case "root":
      return childrenMd;
    case "paragraph":
      return `${childrenMd}\n\n`;
    case "heading": {
      const level = parseInt(node.tag?.replace("h", "") ?? "2", 10);
      return `${"#".repeat(level)} ${childrenMd}\n\n`;
    }
    case "list":
      return (
        (node.children ?? [])
          .map((c, i) => {
            const marker = node.tag === "ol" ? `${i + 1}.` : "-";
            return `${marker} ${nodeToMarkdown(c).trim()}`;
          })
          .join("\n") + "\n\n"
      );
    case "listitem":
      return childrenMd;
    case "quote":
      return `> ${childrenMd.trim()}\n\n`;
    case "link":
      return `[${childrenMd}](${(node as { url?: string }).url ?? "#"})`;
    default:
      return childrenMd;
  }
}

function lexicalToMd(doc: unknown): string {
  if (!doc || typeof doc !== "object") return "";
  const root = (doc as { root?: LexicalText }).root;
  if (!root) return "";
  return nodeToMarkdown(root).trim();
}

function escapeYaml(s: string): string {
  return `"${s.replace(/"/g, '\\"')}"`;
}

async function writeLocaleFile(payload: Payload, postId: string | number, slug: string, locale: (typeof LOCALES)[number], previousSlug?: string) {
  // Fetch this locale's version; if the doc has no translation, Payload falls back to ru.
  const doc = (await payload.findByID({
    collection: "posts",
    id: postId,
    locale,
    fallbackLocale: "ru",
  })) as Record<string, unknown>;

  const dir = path.join(BLOG_ROOT, locale);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (previousSlug && previousSlug !== slug) {
    const oldFile = path.join(dir, `${previousSlug}.mdx`);
    if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
  }

  const title = (doc.title as string) ?? slug;
  const excerpt = (doc.excerpt as string) ?? "";
  const category = (doc.category as string) ?? "process";
  const dateRaw = doc.date as string | undefined;
  const date = dateRaw
    ? new Date(dateRaw).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  const body = lexicalToMd(doc.body);

  const mdx = [
    "---",
    `title: ${escapeYaml(title)}`,
    `excerpt: ${escapeYaml(excerpt)}`,
    `category: ${category}`,
    `date: "${date}"`,
    "---",
    "",
    body,
    "",
  ].join("\n");

  fs.writeFileSync(path.join(dir, `${slug}.mdx`), mdx, "utf-8");
}

export const syncPostAfterChange: CollectionAfterChangeHook = async ({ doc, req, previousDoc }) => {
  try {
    const slug = doc.slug as string;
    if (!slug) return;
    const previousSlug = previousDoc?.slug as string | undefined;

    for (const locale of LOCALES) {
      await writeLocaleFile(req.payload, doc.id, slug, locale, previousSlug);
    }
  } catch (err) {
    req.payload.logger.error({ err }, "[syncPost] failed to write MDX");
  }
};

export const syncPostAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  try {
    const slug = doc?.slug;
    if (!slug) return;
    for (const locale of LOCALES) {
      const file = path.join(BLOG_ROOT, locale, `${slug}.mdx`);
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
  } catch (err) {
    req.payload.logger.error({ err }, "[syncPost] failed to delete MDX");
  }
};
