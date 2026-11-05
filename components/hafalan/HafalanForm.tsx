"use client";

import { useActionState } from "react";
import { createHafalanAction } from "@/lib/actions/hafalan";
import type { FormState } from "@/lib/form";
import { Field, SelectField, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ErrorBanner, SuccessBanner } from "@/components/ui/Alerts";

const initial: FormState = { status: "idle" };

export function HafalanForm({ santriList }: { santriList: { id: string; nama: string }[] }) {
  const [state, formAction] = useActionState(createHafalanAction, initial);
  const fe = state.fieldErrors ?? {};
  const v = state.values ?? {};

  return (
    <form
      key={state.status === "success" ? state.ts : "form"}
      action={formAction}
      noValidate
      className="space-y-4 rounded-card border border-primary/10 bg-surface p-5 shadow-sm"
    >
      <h2 className="text-lg font-bold text-heading">Catat Hafalan / Mengaji</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField label="Santri" name="santri_id" defaultValue={v.santri_id ?? ""} error={fe.santri_id} required>
          <option value="">Pilih santri</option>
          {santriList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nama}
            </option>
          ))}
        </SelectField>
        <SelectField label="Jenis" name="jenis" defaultValue={v.jenis ?? "iqro"} error={fe.jenis}>
          <option value="iqro">Iqro</option>
          <option value="quran">Al-Qur&apos;an</option>
          <option value="hafalan">Hafalan Surat</option>
        </SelectField>
      </div>
      <Field
        label="Materi"
        name="materi"
        placeholder="Contoh: Iqro 3 hal 12, atau An-Naba 1-10"
        defaultValue={v.materi}
        error={fe.materi}
        maxLength={100}
        required
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Nilai (0-100)"
          name="nilai"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          defaultValue={v.nilai ?? "80"}
          error={fe.nilai}
          required
        />
        <SelectField label="Status" name="status" defaultValue={v.status ?? "lulus"} error={fe.status}>
          <option value="lulus">Lulus</option>
          <option value="ulang">Perlu diulang</option>
        </SelectField>
      </div>
      <TextAreaField label="Catatan (opsional)" name="catatan" rows={3} maxLength={500} defaultValue={v.catatan} error={fe.catatan} />
      {state.status === "error" && state.message && <ErrorBanner>{state.message}</ErrorBanner>}
      {state.status === "success" && state.message && <SuccessBanner>{state.message}</SuccessBanner>}
      <SubmitButton pendingLabel="Menyimpan...">Simpan Catatan</SubmitButton>
    </form>
  );
}