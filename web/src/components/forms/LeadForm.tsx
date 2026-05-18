"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

const schema = z.object({
  name: z.string().min(2, "Имя слишком короткое"),
  phone: z
    .string()
    .min(7, "Укажите телефон")
    .regex(/^[+\d\s()-]+$/, "Только цифры и +"),
  objectType: z.enum(["apartment", "cottage", "office", "dacha", "other"]),
  area: z.string().optional(),
  date: z.string().optional(),
  channel: z.enum(["whatsapp", "telegram", "call"]),
  comment: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function LeadForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { objectType: "apartment", channel: "whatsapp" },
  });

  async function onSubmit(data: FormData) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-accent/40 bg-accent/[0.07] rounded-sm p-8">
        <div className="text-xs uppercase tracking-[0.22em] text-accent">
          ✓ {t("successTitle")}
        </div>
        <p className="mt-4 text-text leading-relaxed">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <Field label={t("fields.name")} error={errors.name}>
        <input
          type="text"
          autoComplete="name"
          {...register("name")}
          className={inputClass(!!errors.name)}
        />
      </Field>

      <Field label={t("fields.phone")} error={errors.phone}>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+998 __ ___ __ __"
          {...register("phone")}
          className={inputClass(!!errors.phone)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("fields.objectType")}>
          <select {...register("objectType")} className={inputClass(false)}>
            <option value="apartment">{t("objectOptions.apartment")}</option>
            <option value="cottage">{t("objectOptions.cottage")}</option>
            <option value="office">{t("objectOptions.office")}</option>
            <option value="dacha">{t("objectOptions.dacha")}</option>
            <option value="other">{t("objectOptions.other")}</option>
          </select>
        </Field>
        <Field label={t("fields.area")}>
          <input
            type="text"
            inputMode="numeric"
            {...register("area")}
            className={inputClass(false)}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("fields.date")}>
          <input
            type="date"
            {...register("date")}
            className={inputClass(false)}
          />
        </Field>
        <Field label={t("fields.channel")}>
          <select {...register("channel")} className={inputClass(false)}>
            <option value="whatsapp">{t("channelOptions.whatsapp")}</option>
            <option value="telegram">{t("channelOptions.telegram")}</option>
            <option value="call">{t("channelOptions.call")}</option>
          </select>
        </Field>
      </div>

      <Field label={t("fields.comment")}>
        <textarea
          rows={4}
          {...register("comment")}
          className={`${inputClass(false)} resize-none`}
        />
      </Field>

      {status === "error" && (
        <div className="text-sm text-accent border border-accent/40 bg-accent/[0.07] rounded-sm px-4 py-3">
          <strong className="block font-semibold">{t("errorTitle")}</strong>
          <span className="block mt-1 text-text-muted">{t("errorBody")}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-bg font-semibold text-sm h-12 px-7 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed self-start"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: { message?: string };
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{label}</span>
      {children}
      {error && (
        <span className="text-xs text-accent">{error.message}</span>
      )}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return [
    "bg-bg-elevated border rounded-sm px-4 py-3.5 text-base text-text min-h-[48px]",
    "placeholder:text-text-dim",
    "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent",
    hasError ? "border-accent/70" : "border-border-line",
  ].join(" ");
}
