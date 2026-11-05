"use client";

import { useActionState, useEffect, useState } from "react";
import { sendMagicLinkAction } from "@/lib/actions/auth";
import type { MagicLinkState } from "@/lib/auth/types";
import { Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ErrorBanner, SuccessBanner } from "@/components/ui/Alerts";

const initial: MagicLinkState = { status: "idle" };

export function MagicLinkForm({ next = "" }: { next?: string }) {
  const [resetKey, setResetKey] = useState(0);
  return <Inner key={resetKey} next={next} onReset={() => setResetKey((k) => k + 1)} />;
}

function Inner({ next, onReset }: { next: string; onReset: () => void }) {
  const [state, formAction] = useActionState(sendMagicLinkAction, initial);
  const [cooldown, setCooldown] = useState(0);
  const [sentAt, setSentAt] = useState<MagicLinkState | null>(null);

  if (state.status === "sent" && sentAt !== state) {
    setSentAt(state);
    setCooldown(60);
  }

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const fe = state.fieldErrors ?? {};
  const sent = state.status === "sent";

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 6h16v12H4zM4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-sm text-ink/70">Masuk tanpa password lewat tautan yang kami kirim ke email.</p>
      </div>
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="wali@gmail.com"
        defaultValue={state.values?.email}
        error={fe.email}
        required
      />
      <Field
        label="Nama lengkap (opsional, untuk akun baru)"
        name="fullName"
        autoComplete="name"
        defaultValue={state.values?.fullName}
        error={fe.fullName}
      />
      {state.status === "error" && state.message && <ErrorBanner>{state.message}</ErrorBanner>}
      {sent && (
        <SuccessBanner>
          <p>{state.message}</p>
          <p className="mt-1">
            Terkirim ke <strong>{state.values?.email}</strong>. Buka tautan di browser yang sama dengan halaman ini.
          </p>
        </SuccessBanner>
      )}
      {cooldown > 0 ? (
        <button type="button" disabled className="min-h-11 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-white opacity-60">
          Kirim ulang dalam {cooldown} detik
        </button>
      ) : (
        <SubmitButton className="w-full" pendingLabel="Mengirim...">
          {sent ? "Kirim ulang tautan" : "Kirim Tautan Masuk"}
        </SubmitButton>
      )}
      {sent && (
        <button type="button" onClick={onReset} className="min-h-11 w-full text-sm text-ink/70 underline">
          Gunakan email lain
        </button>
      )}
    </form>
  );
}
