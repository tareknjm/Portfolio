"use server";

import { z } from "zod";
import { headers } from "next/headers";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(100, "Le nom ne peut pas dépasser 100 caractères."),
  email: z.string().email("Veuillez entrer une adresse email valide."),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères.")
    .max(5000, "Le message ne peut pas dépasser 5000 caractères."),
});

export type ContactFormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

// Simple in-memory rate limiting (per server instance)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;

  record.count++;
  return true;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends the notification email via Resend's REST API.
 * No-op (returns false) when RESEND_API_KEY is not set — so the form works
 * today and "just works" the moment a key is added to the environment.
 * Uses fetch directly, so no extra dependency is required.
 */
async function sendEmail(data: { name: string; email: string; message: string }): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const to = process.env.CONTACT_TO_EMAIL || "tareknajem277@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: data.email,
      subject: `[Portfolio] Nouveau message de ${data.name}`,
      html: `<p><strong>De :</strong> ${escapeHtml(data.name)} (${escapeHtml(data.email)})</p><p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${detail}`);
  }
  return true;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot check — silently succeed to avoid revealing the trap
  if (formData.get("_honey")) {
    return { success: true, message: "Message envoyé avec succès !" };
  }

  // Rate limit per client IP
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "local";
  if (!checkRateLimit(ip)) {
    return {
      success: false,
      message: "Trop de tentatives. Merci de réessayer dans une minute.",
    };
  }

  const validated = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Veuillez corriger les erreurs ci-dessous.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = validated.data;

  try {
    const emailSent = await sendEmail({ name, email, message });

    // Persistence is optional — only attempt when a database is configured.
    if (process.env.DATABASE_URL) {
      // TODO: persist with Drizzle/Neon once the schema is wired.
      // await db.insert(messages).values({ name, email, message });
    }

    if (!emailSent) {
      console.warn(
        "⚠️ [Contact Form] RESEND_API_KEY est manquante dans .env.local.\n" +
        "Le message est simulé et n'a pas été envoyé par email.\n" +
        "Pour recevoir les emails sur tareknajem19@gmail.com, ajoutez RESEND_API_KEY=re_... dans .env.local.\n" +
        "Contenu reçu :",
        { name, email, message }
      );
    }

    return {
      success: true,
      message: "Message envoyé avec succès ! Je vous répondrai rapidement.",
    };
  } catch (error) {
    console.error("[Contact Form Error]", error);
    return {
      success: false,
      message: "Une erreur est survenue. Veuillez réessayer plus tard.",
    };
  }
}
