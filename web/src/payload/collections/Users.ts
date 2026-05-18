import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  labels: { singular: "Пользователь", plural: "Пользователи" },
  admin: { useAsTitle: "email" },
  fields: [{ name: "name", type: "text", label: "Имя" }],
};
