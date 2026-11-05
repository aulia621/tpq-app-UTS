"use client";

import { useFormStatus } from "react-dom";
import { buttonClass, type ButtonVariant } from "./buttonStyles";

export function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

export function SubmitButton({
  children,
  pendingLabel = "Memproses...",
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: ButtonVariant;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass(variant, className)}>
      {pending && <Spinner />}
      {pending ? pendingLabel : children}
    </button>
  );
}
