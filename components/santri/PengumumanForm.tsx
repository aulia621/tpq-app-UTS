"use client";

import { useActionState } from "react";
import { createPengumumanAction } from "@/lib/actions/pengumuman";
import type { FormState } from "@/lib/form";
import { Field, SelectField, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ErrorBanner, SuccessBanner } from "@/components/ui/Alerts";

const initial: FormState = { status: "idle" };

export function PengumumanForm({ kelasList }: { kelasList: { id: string; nama: string }[] }) {
  const [state, formAction] = useActionState(createPengumumanAction, initial);
  const fe = state.fieldErrors ?? {};
  const v = state.values ?? {};
  return (
    <form
      key={state.status === "success" ? state.ts : "form"}
      action={formAction}
      noValidate
      className="space-y-4 rounded-card border border-primary/10 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-bold text-primary-dark">Buat Pengumuman</h2>
      <Field label="Judul" name="judul" defaultValue={v.judul} error={fe.judul} maxLength={120} required />
      <TextAreaField label="Isi pengumuman" name="isi" rows={4} maxLength={2000} defaultValue={v.isi} error={fe.isi} required />
      <SelectField label="Ditujukan untuk" name="target_kelas_id" defaultValue={v.target_kelas_id ?? ""} error={fe.target_kelas_id}>
        <option value="">Semua kelas</option>
        {kelasList.map((k) => (
          <option key={k.id} value={k.id}>
            {k.nama}
          </option>
        ))}
      </SelectField>
      {state.status === "error" && state.message && <ErrorBanner>{state.message}</ErrorBanner>}
      {state.status === "success" && state.message && <SuccessBanner>{state.message}</SuccessBanner>}
      <SubmitButton pendingLabel="Menerbitkan...">Terbitkan</SubmitButton>
    </form>
  );
}
