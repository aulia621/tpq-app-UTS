"use client";

import { useActionState } from "react";
import { createKelasAction } from "@/lib/actions/kelas";
import type { FormState } from "@/lib/form";
import { Field, SelectField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ErrorBanner, SuccessBanner } from "@/components/ui/Alerts";

const initial: FormState = { status: "idle" };

export function KelasForm({ guruList }: { guruList: { id: string; full_name: string }[] }) {
  const [state, formAction] = useActionState(createKelasAction, initial);
  const fe = state.fieldErrors ?? {};
  const v = state.values ?? {};
  return (
    <form
      key={state.status === "success" ? state.ts : "form"}
      action={formAction}
      noValidate
      className="space-y-4 rounded-card border border-primary/10 bg-surface p-5 shadow-sm"
    >
      <h2 className="text-lg font-bold text-heading">Tambah Kelas</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nama kelas" name="nama" placeholder="Contoh: Iqro 1" defaultValue={v.nama} error={fe.nama} maxLength={50} required />
        <SelectField label="Guru pengampu (opsional)" name="guru_id" defaultValue={v.guru_id ?? ""} error={fe.guru_id}>
          <option value="">Belum ditentukan</option>
          {guruList.map((g) => (
            <option key={g.id} value={g.id}>
              {g.full_name || "(tanpa nama)"}
            </option>
          ))}
        </SelectField>
      </div>
      {state.status === "error" && state.message && <ErrorBanner>{state.message}</ErrorBanner>}
      {state.status === "success" && state.message && <SuccessBanner>{state.message}</SuccessBanner>}
      <SubmitButton pendingLabel="Menyimpan...">Tambah Kelas</SubmitButton>
    </form>
  );
}