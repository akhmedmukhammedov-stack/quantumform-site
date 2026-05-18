import type { CollectionConfig } from "payload";
import { syncPostAfterChange, syncPostAfterDelete } from "../hooks/syncPost";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Статья", plural: "Блог" },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "date"],
    description:
      "Статьи блога. Переключатель языка в правом верхнем углу формы — что не заполнишь в EN/UZ/TR, подтянется с русской версии.",
    listSearchableFields: ["title", "slug"],
  },
  hooks: {
    afterChange: [syncPostAfterChange],
    afterDelete: [syncPostAfterDelete],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      label: "Заголовок",
      admin: {
        placeholder: "Например: 5 причин, почему ремонт срывается на 2 месяца",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug (URL)",
      admin: {
        description:
          "Латиница и дефис. Например: why-renovations-run-late → /blog/why-renovations-run-late. Один на все языки.",
        placeholder: "why-renovations-run-late",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      label: "Краткое описание",
      admin: {
        description: "1–2 предложения. Карточка на /blog + meta description.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "category",
          type: "select",
          required: true,
          label: "Категория",
          defaultValue: "process",
          options: [
            { label: "Процесс", value: "process" },
            { label: "Материалы", value: "materials" },
            { label: "Дизайн", value: "design" },
            { label: "Кейсы", value: "cases" },
          ],
        },
        {
          name: "date",
          type: "date",
          required: true,
          label: "Дата публикации",
          defaultValue: () => new Date().toISOString(),
          admin: {
            date: { pickerAppearance: "dayOnly", displayFormat: "d MMMM yyyy" },
          },
        },
      ],
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "Обложка (необязательно)",
    },
    {
      name: "body",
      type: "richText",
      required: true,
      localized: true,
      label: "Текст статьи",
    },
  ],
};
