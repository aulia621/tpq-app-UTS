"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sanitizeNext } from "@/lib/auth/safeNext";
import { getOrigin } from "@/lib/auth/origin";
import {
  emailSchema,
  identifierSchema,
  normalizeIdentifier,
  passwordSignupSchema,
} from "@/lib/auth/identifier";
import type { AuthState, MagicLinkState } from "@/lib/auth/types";
import { fieldErrors } from "@/lib/schemas";
import { str } from "@/lib/form";

const loginSchema = z.object({
  identifier: identifierSchema,
  password: z.string().min(1, "Password wajib diisi").max(72, "Password terlalu panjang"),
});

const signupSchema = z.object({
  identifier: identifierSchema,
  password: passwordSignupSchema,
  fullName: z.string().trim().min(2, "Nama lengkap minimal 2 karakter").max(100, "Maksimal 100 karakter"),
});

function isRateLimit(error: { status?: number; code?: string }): boolean {
  return error.status === 429 || error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit";
}

export async function loginWithEmailAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const identifier = str(formData, "identifier");
  const parsed = loginSchema.safeParse({ identifier, password: str(formData, "password") });
  if (!parsed.success) {
    const fe = fieldErrors(parsed.error);
    return { fieldErrors: { identifier: fe.identifier, password: fe.password }, values: { identifier } };
  }

  const { email } = normalizeIdentifier(parsed.data.identifier);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: parsed.data.password });
  if (error) {
    if (isRateLimit(error)) return { error: "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.", values: { identifier } };
    return { error: "Email/NIS atau password salah.", values: { identifier } };
  }

  revalidatePath("/", "layout");
  redirect(sanitizeNext(formData.get("next")));
}

export async function signupWithEmailAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const identifier = str(formData, "identifier");
  const fullName = str(formData, "fullName");
  const parsed = signupSchema.safeParse({ identifier, password: str(formData, "password"), fullName });
  if (!parsed.success) {
    const fe = fieldErrors(parsed.error);
    return {
      fieldErrors: { identifier: fe.identifier, password: fe.password, fullName: fe.fullName },
      values: { identifier, fullName },
    };
  }

  const { email, kind } = normalizeIdentifier(parsed.data.identifier);
  const supabase = await createClient();
  // Hanya full_name yang dikirim sebagai metadata. Role selalu 'wali' (trigger database).
  const { data, error } = await supabase.auth.signUp({
    email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  });

  if (error) {
    console.error("signup error", error.code ?? error.status);
    if (isRateLimit(error)) return { error: "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.", values: { identifier, fullName } };
    if (error.code === "weak_password") return { error: "Password terlalu lemah. Gunakan kombinasi yang lebih kuat.", values: { identifier, fullName } };
    return { error: "Pendaftaran gagal. Periksa data kamu atau coba email/NIS lain.", values: { identifier, fullName } };
  }

  revalidatePath("/", "layout");
  if (data.session) redirect(sanitizeNext(formData.get("next")));

  return {
    success:
      kind === "nis"
        ? "Akun dibuat. Silakan langsung masuk dengan NIS dan password kamu."
        : "Pendaftaran berhasil. Jika verifikasi email aktif, cek kotak masuk kamu. Jika tidak, silakan langsung masuk.",
  };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

/** Mulai OAuth (PKCE). Penyimpanan code verifier terjadi di server lewat cookie. */
async function startOAuth(provider: "github", next: string): Promise<never> {
  const supabase = await createClient();
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error || !data.url) redirect("/login?error=oauth_start_failed");
  redirect(data.url);
}

export async function signInWithGithubAction(formData: FormData): Promise<void> {
  await startOAuth("github", sanitizeNext(formData.get("next")));
}

const magicSchema = z.object({
  email: emailSchema,
  fullName: z
    .string()
    .trim()
    .max(100, "Maksimal 100 karakter")
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
});

export async function sendMagicLinkAction(_prev: MagicLinkState, formData: FormData): Promise<MagicLinkState> {
  const rawEmail = str(formData, "email").trim();
  const rawName = str(formData, "fullName");
  const values = { email: rawEmail, fullName: rawName };

  if (!rawEmail.includes("@")) {
    return {
      status: "error",
      fieldErrors: { email: "Tautan email membutuhkan email asli. Jika masuk dengan NIS, gunakan tab Password." },
      values,
    };
  }

  const parsed = magicSchema.safeParse({ email: rawEmail, fullName: rawName });
  if (!parsed.success) {
    const fe = fieldErrors(parsed.error);
    return { status: "error", fieldErrors: { email: fe.email, fullName: fe.fullName }, values };
  }

  const next = sanitizeNext(formData.get("next"));
  const origin = await getOrigin();
  const supabase = await createClient();
  // shouldCreateUser (default true) membuat alur ini juga berfungsi sebagai pendaftaran wali.
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      data: parsed.data.fullName ? { full_name: parsed.data.fullName } : undefined,
    },
  });

  if (error) {
    console.error("magic link error", error.code ?? error.status);
    if (isRateLimit(error)) return { status: "error", message: "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.", values };
    return { status: "error", message: "Tidak dapat mengirim tautan sekarang. Coba lagi nanti.", values };
  }

  return {
    status: "sent",
    message: "Jika email valid, tautan masuk sudah dikirim. Periksa kotak masuk dan folder spam.",
    values: { email: parsed.data.email },
  };
}
