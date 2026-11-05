import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UnifiedAuthCard } from "@/components/auth/UnifiedAuthCard";
import { getUser } from "@/lib/auth/session";
import { sanitizeNext } from "@/lib/auth/safeNext";
import { first, type RawParams } from "@/lib/query";

export const metadata: Metadata = { title: "Masuk" };

const ERRORS: Record<string, string> = {
  oauth_denied: "Izin login GitHub dibatalkan.",
  oauth_callback_failed:
    "Login gagal. Jika memakai tautan email, buka di browser yang sama dengan saat meminta tautan, atau minta tautan baru.",
  oauth_start_failed: "Tidak dapat memulai login GitHub. Coba lagi nanti.",
  magiclink_failed: "Tautan email tidak valid atau kedaluwarsa. Minta tautan baru.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const raw = await searchParams;
  const next = sanitizeNext(first(raw.next));
  const initialMode = first(raw.mode) === "daftar" ? "register" : "login";
  const code = first(raw.error);
  const errorMessage = code && Object.hasOwn(ERRORS, code) ? ERRORS[code] : undefined;

  const user = await getUser();
  if (user) redirect(next);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-primary-dark via-primary to-primary-dark p-4">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gold/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cream/20 blur-3xl" />
      <div className="relative flex w-full flex-col items-center gap-4">
        <UnifiedAuthCard next={next} errorMessage={errorMessage} initialMode={initialMode} />
        <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-cream underline">
          ← Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}