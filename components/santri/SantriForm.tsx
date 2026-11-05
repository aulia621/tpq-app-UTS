"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveSantriAction } from "@/lib/actions/santri";
import type { FormState } from "@/lib/form";
import { Field, SelectField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { buttonClass } from "@/components/ui/buttonStyles";
import { ErrorBanner } from "@/components/ui/Alerts";

export type SantriInitial = {
  id?: string;
  nama?: string;
  nis?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: string;
  kelas_id?: string;
  wali_email?: string;
  aktif?: boolean;
};

const initial: FormState = { status: "idle" };

export function SantriForm({
  kelasList,
  santri,
}: {
  kelasList: { id: string; nama: string }[];
  santri?: SantriInitial;
}) {
  const [state, formAction] = useActionState(saveSantriAction, initial);
  const fe = state.fieldErrors ?? {};
  const v = state.values ?? {};
  const isEdit = Boolean(santri?.id);
  const val = (k: keyof SantriInitial) => v[k as string] ?? (santri?.[k] as string | undefined) ?? "";

  return (
    <form action={formAction} noValidate className="max-w-xl space-y-4 rounded-card border border-primary/10 bg-surface p-5 shadow-sm">
      {isEdit && <input type="hidden" name="id" value={santri?.id} />}
      <Field label="Nama santri" name="nama" defaultValue={val("nama")} error={fe.nama} maxLength={100} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="NIS" name="nis" defaultValue={val("nis")} error={fe.nis} maxLength={20} hint="Huruf dan angka. Dipakai wali untuk login." />
        <Field label="Tanggal lahir" name="tanggal_lahir" type="date" defaultValue={val("tanggal_lahir")} error={fe.tanggal_lahir} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Jenis kelamin" name="jenis_kelamin" defaultValue={val("jenis_kelamin")} error={fe.jenis_kelamin}>
          <option value="">Tidak diisi</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </SelectField>
        <SelectField label="Kelas" name="kelas_id" defaultValue={val("kelas_id")} error={fe.kelas_id}>
          <option value="">Belum ada kelas</option>
          {kelasList.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nama}
            </option>
          ))}
        </SelectField>
      </div>
      <Field
        label="Email akun wali (opsional)"
        name="wali_email"
        type="email"
        defaultValue={val("wali_email")}
        error={fe.wali_email}
        hint="Wali harus sudah mendaftar. Kosongkan jika belum ada atau untuk melepas wali."
      />
      {isEdit && (
        <label className="flex min-h-11 items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" name="aktif" defaultChecked={santri?.aktif ?? true} className="h-5 w-5 accent-primary" />
          Santri aktif
        </label>
      )}
      {state.status === "error" && state.message && <ErrorBanner>{state.message}</ErrorBanner>}
      <div className="flex flex-wrap gap-3">
        <SubmitButton pendingLabel="Menyimpan...">{isEdit ? "Simpan Perubahan" : "Tambah Santri"}</SubmitButton>
        <Link href="/dashboard/santri" className={buttonClass("outline")}>
          Batal
        </Link>
      </div>
    </form>
  );
}