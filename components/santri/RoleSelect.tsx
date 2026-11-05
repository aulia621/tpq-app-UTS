"use client";

import { useActionState } from "react";
import { setUserRoleAction } from "@/lib/actions/users";
import type { RowActionState } from "@/lib/form";
import { ROLE_LABEL, ROLE_LIST, type UserRole } from "@/lib/types";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function RoleSelect({ id, role, disabled }: { id: string; role: UserRole; disabled?: boolean }) {
  const [state, action] = useActionState(setUserRoleAction, { status: "idle" } as RowActionState);
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`role-${id}`}>
        Peran pengguna
      </label>
      <select
        id={`role-${id}`}
        name="role"
        defaultValue={role}
        disabled={disabled}
        className="min-h-11 rounded-xl border border-primary/25 bg-surface px-3 text-sm disabled:opacity-60"
      >
        {ROLE_LIST.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABEL[r]}
          </option>
        ))}
      </select>
      {!disabled && (
        <SubmitButton variant="outline" pendingLabel="Menyimpan...">
          Simpan
        </SubmitButton>
      )}
      {state.message && (
        <p role={state.status === "error" ? "alert" : "status"} className={`w-full text-xs font-medium ${state.status === "error" ? "text-danger" : "text-success"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}