import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionConfig } from "payload";

const dirname = path.dirname(fileURLToPath(import.meta.url));
// Resolve to <web>/public/media/uploads so Next serves uploaded files directly.
const STATIC_DIR = path.resolve(dirname, "../../../public/media/uploads");

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Файл", plural: "Медиа" },
  access: {
    read: () => true,
  },
  admin: {
    description:
      "Фото и видео для блога, проектов, секций. Файлы складываются в /public/media/uploads и доступны на сайте сразу.",
    defaultColumns: ["filename", "alt", "filesize", "createdAt"],
  },
  upload: {
    staticDir: STATIC_DIR,
    mimeTypes: ["image/*", "video/mp4", "video/webm", "video/quicktime"],
    imageSizes: [
      { name: "thumb", width: 480, position: "centre" },
      { name: "card", width: 1200, position: "centre" },
      { name: "hero", width: 2400, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt-текст",
      admin: {
        description: "Краткое описание для SEO и доступности. Например: «Гостиная после ремонта».",
      },
    },
    {
      name: "caption",
      type: "text",
      label: "Подпись",
      admin: { description: "Необязательная подпись под изображением." },
    },
  ],
};
