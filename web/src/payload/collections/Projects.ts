import type { CollectionConfig } from "payload";
import { syncProjectAfterChange, syncProjectAfterDelete } from "../hooks/syncProject";

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Проект", plural: "Проекты" },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "type", "segment", "area", "status", "order"],
    description:
      "Кейсы для портфолио. После сохранения проект появляется на /projects. Меньшее «Сортировка» = выше в списке.",
    listSearchableFields: ["name", "slug", "location"],
  },
  defaultSort: "order",
  hooks: {
    afterChange: [syncProjectAfterChange],
    afterDelete: [syncProjectAfterDelete],
  },
  fields: [
    {
      name: "order",
      type: "number",
      label: "Сортировка",
      required: true,
      defaultValue: 100,
      admin: {
        description: "Меньше = выше в списке. Премиум-завершённые: 10–50. Стройка: 90+.",
        position: "sidebar",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      label: "Статус",
      defaultValue: "completed",
      options: [
        { label: "Сдан", value: "completed" },
        { label: "В работе", value: "ongoing" },
      ],
      admin: { position: "sidebar" },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Основное",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              localized: true,
              label: "Название проекта",
              admin: { placeholder: "Например: Премиум-квартира в новостройке" },
            },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              label: "Slug (URL)",
              admin: {
                description:
                  "Латиница и дефис. Например: tashkent-apartment-premium → /projects/tashkent-apartment-premium. Один на все языки.",
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "type",
                  type: "select",
                  required: true,
                  label: "Тип объекта",
                  defaultValue: "apartment",
                  options: [
                    { label: "Квартира", value: "apartment" },
                    { label: "Коттедж", value: "cottage" },
                    { label: "Офис", value: "office" },
                    { label: "Дача", value: "dacha" },
                  ],
                },
                {
                  name: "typeLabel",
                  type: "text",
                  localized: true,
                  label: "Подпись типа",
                  admin: {
                    description: '«Квартира» / «Санузел» / «Apartment» / «Bathroom»',
                  },
                },
                {
                  name: "segment",
                  type: "text",
                  localized: true,
                  label: "Сегмент",
                  admin: {
                    placeholder: "Премиум / Средний / Вторичка → Премиум",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "area",
                  type: "text",
                  localized: true,
                  label: "Площадь",
                  admin: { placeholder: "120 м² / 120 m²" },
                },
                {
                  name: "duration",
                  type: "text",
                  localized: true,
                  label: "Длительность",
                  admin: { placeholder: "11 недель / 11 weeks" },
                },
                {
                  name: "location",
                  type: "text",
                  localized: true,
                  label: "Локация",
                  admin: { placeholder: "Ташкент / Tashkent" },
                },
                {
                  name: "year",
                  type: "text",
                  label: "Год",
                  admin: { placeholder: "2025" },
                },
              ],
            },
            {
              name: "intro",
              type: "textarea",
              localized: true,
              label: "Описание проекта",
              admin: {
                description: "2–4 предложения о том, что делали и как.",
              },
            },
          ],
        },
        {
          label: "Обложка и hero",
          fields: [
            {
              name: "cover",
              type: "upload",
              relationTo: "media",
              label: "Обложка (карточка на /projects и главной)",
              admin: {
                description: "Квадратное или 4:3. Должна выглядеть премиально.",
              },
            },
            {
              name: "hero",
              type: "upload",
              relationTo: "media",
              label: "Главное фото на странице проекта",
              admin: {
                description: "Широкий формат 16:9. Если не указано, используется обложка.",
              },
            },
          ],
        },
        {
          label: "Материалы",
          description: "Список того, что использовалось в проекте",
          fields: [
            {
              name: "materials",
              type: "array",
              localized: true,
              label: "Материалы",
              labels: { singular: "Материал", plural: "Материалы" },
              admin: { description: "По одной позиции на строку." },
              fields: [
                {
                  name: "value",
                  type: "text",
                  required: true,
                  label: "Описание",
                  admin: {
                    placeholder: "Например: Декоративная штукатурка · перламутровое тиснение",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Галерея",
          description: "Фотографии для секции «Галерея» на странице проекта",
          fields: [
            {
              name: "gallery",
              type: "array",
              label: "Фотографии",
              labels: { singular: "Кадр", plural: "Кадры" },
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                  label: "Фото",
                },
                {
                  name: "caption",
                  type: "text",
                  localized: true,
                  label: "Подпись (необязательно)",
                },
              ],
            },
          ],
        },
        {
          label: "Видео",
          description: "Видео с объекта — в проигрывателе click-to-play",
          fields: [
            {
              name: "videos",
              type: "array",
              label: "Видео",
              fields: [
                {
                  name: "video",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                  label: "Видеофайл (MP4)",
                },
                {
                  name: "poster",
                  type: "upload",
                  relationTo: "media",
                  label: "Постер (превью) — необязательно",
                  admin: { description: "Если не указан, возьмётся первый кадр видео." },
                },
                {
                  name: "caption",
                  type: "text",
                  localized: true,
                  label: "Подпись",
                },
                {
                  name: "aspect",
                  type: "select",
                  label: "Соотношение сторон",
                  defaultValue: "portrait",
                  options: [
                    { label: "Портрет (9:16) — телефонная съёмка", value: "portrait" },
                    { label: "Альбом (16:9) — горизонтальное видео", value: "video" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Отзыв клиента",
          description: "Цитата клиента (необязательно)",
          fields: [
            {
              name: "quote",
              type: "group",
              label: " ",
              fields: [
                {
                  name: "text",
                  type: "textarea",
                  localized: true,
                  label: "Текст цитаты",
                  admin: {
                    description: "В рендере оборачивается в кавычки и курсив.",
                  },
                },
                {
                  name: "author",
                  type: "text",
                  localized: true,
                  label: "Подпись",
                  admin: {
                    placeholder: "Клиент · Квартира 140 м²",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
