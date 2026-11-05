"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { AnimatedConfirmModal } from "@/components/ui/AnimatedConfirmModal";
import { Spinner } from "@/components/ui/SubmitButton";
import type { RowActionState } from "@/lib/form";

type Action = (prev: RowActionState, formData: FormData) => Promise<RowActionState>;

function Trigger({ label, onOpen }: { label: string; onOpen: () => void }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={pending}
      aria-haspopup="dialog"
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-danger/40 px-3 text-sm font-semibold text-danger hover:bg-danger/10 disabled:opacity-60"
    >
      {pending && <Spinner />}
      {pending ? "Menghapus..." : label}
    </button>
  );
}

export function ConfirmDeleteButton({
  action,
  id,
  title,
  description,
  label = "Hapus",
}: {
  action: Action;
  id: string;
  title: string;
  description: string;
  label?: string;
}) {
  const [state, formAction] = useActionState(action, { status: "idle" } as RowActionState);
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="id" value={id} />
        <Trigger label={label} onOpen={() => setOpen(true)} />
      </form>
      {state.status === "error" && state.message && (
        <p role="alert" className="mt-1 text-xs font-medium text-danger">
          {state.message}
        </p>
      )}
      <AnimatedConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          formRef.current?.requestSubmit();
        }}
        title={title}
        description={description}
      />
    </div>
  );
}
