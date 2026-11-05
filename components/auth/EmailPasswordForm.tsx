"use client";

import { useActionState, useState } from "react";
import { loginWithEmailAction, signupWithEmailAction } from "@/lib/actions/auth";
import type { AuthState } from "@/lib/auth/types";
import { Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ErrorBanner, SuccessBanner } from "@/components/ui/Alerts";

const initial: AuthState = {};

export function EmailPasswordForm({
  next = "",
  initialMode = "login",
}: {
  next?: string;
  initialMode?: "login" | "register";
}) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  return (
    <div className="space-y-3">
      <ModeForm key={mode} mode={mode} next={next} />
      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="min-h-11 w-full text-sm text-ink/70 underline"
      >
        {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
      </button>
    </div>
  );
}

function ModeForm({ mode, next }: { mode: "login" | "register"; next: string }) {
  const [state, formAction] = useActionState(
    mode === "login" ? loginWithEmailAction : signupWithEmailAction,
    initial,
  );
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      {mode === "register" && (
        <Field
          label="Nama lengkap"
          name="fullName"
          autoComplete="name"
          defaultValue={state.values?.fullName}
          error={fe.fullName}
          required
        />
      )}
      <Field
        label="Email atau NIS (Nomor Induk Santri)"
        name="identifier"
        autoComplete="username"
        placeholder="wali@gmail.com atau 2024001"
        hint="Tidak punya email? Gunakan NIS anak kamu."
        defaultValue={state.values?.identifier}
        error={fe.identifier}
        required
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        placeholder={mode === "register" ? "Minimal 8 karakter" : "Password"}
        error={fe.password}
        required
      />
      {state.error && <ErrorBanner>{state.error}</ErrorBanner>}
      {state.success && <SuccessBanner>{state.success}</SuccessBanner>}
      <SubmitButton className="w-full">{mode === "login" ? "Masuk" : "Daftar"}</SubmitButton>
    </form>
  );
}