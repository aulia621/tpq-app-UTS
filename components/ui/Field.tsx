"use client";

import { useId } from "react";

const base =
  "w-full min-h-11 rounded-xl border bg-white px-3 py-2 text-base text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary/40";

type Common = { label: string; error?: string; hint?: string };

function Wrapper({
  id,
  label,
  error,
  hint,
  children,
}: Common & { id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-semibold text-primary-dark">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-ink/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function describe(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-err`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function Field({
  label,
  error,
  hint,
  className = "",
  ...props
}: Common & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describe(id, error, hint)}
        className={`${base} ${error ? "border-danger" : "border-primary/25"} ${className}`}
        {...props}
      />
    </Wrapper>
  );
}

export function SelectField({
  label,
  error,
  hint,
  children,
  ...props
}: Common & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describe(id, error, hint)}
        className={`${base} ${error ? "border-danger" : "border-primary/25"}`}
        {...props}
      >
        {children}
      </select>
    </Wrapper>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  ...props
}: Common & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describe(id, error, hint)}
        className={`${base} ${error ? "border-danger" : "border-primary/25"}`}
        {...props}
      />
    </Wrapper>
  );
}
