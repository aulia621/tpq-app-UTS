import { z } from "zod";

/** Ambil pesan pertama per field dari error Zod. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

export function zodRecord(error: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

export const idSchema = z.string().uuid("ID tidak valid");

const jenisEnum = z.enum(["iqro", "quran", "hafalan"], { message: "Jenis tidak valid" });
const statusEnum = z.enum(["lulus", "ulang"], { message: "Status tidak valid" });

const nilaiForm = z
  .string()
  .trim()
  .min(1, "Nilai wajib diisi")
  .transform((v) => Number(v))
  .pipe(
    z
      .number({ message: "Nilai harus angka" })
      .int("Nilai harus bilangan bulat")
      .min(0, "Nilai minimal 0")
      .max(100, "Nilai maksimal 100"),
  );

export const hafalanSchema = z.object({
  santri_id: z.string().uuid("Pilih santri"),
  jenis: jenisEnum,
  materi: z
    .string()
    .trim()
    .min(3, "Materi minimal 3 karakter")
    .max(100, "Materi maksimal 100 karakter"),
  nilai: nilaiForm,
  status: statusEnum,
  catatan: z
    .string()
    .trim()
    .max(500, "Catatan maksimal 500 karakter")
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
});

export const kelasSchema = z.object({
  nama: z.string().trim().min(2, "Nama kelas minimal 2 karakter").max(50, "Maksimal 50 karakter"),
  guru_id: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .pipe(z.string().uuid("Guru tidak valid").nullable()),
});

export const santriSchema = z.object({
  nama: z.string().trim().min(2, "Nama minimal 2 karakter").max(100, "Maksimal 100 karakter"),
  nis: z
    .string()
    .trim()
    .max(20, "NIS maksimal 20 karakter")
    .regex(/^[A-Za-z0-9]*$/, "NIS hanya huruf dan angka")
    .transform((v) => (v === "" ? null : v)),
  tanggal_lahir: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid").nullable()),
  jenis_kelamin: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .pipe(z.enum(["L", "P"], { message: "Pilih L atau P" }).nullable()),
  kelas_id: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .pipe(z.string().uuid("Kelas tidak valid").nullable()),
  wali_email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "Terlalu panjang")
    .transform((v) => (v === "" ? null : v))
    .pipe(z.string().email("Format email tidak valid").nullable()),
  aktif: z.boolean(),
});

export const pengumumanSchema = z.object({
  judul: z.string().trim().min(3, "Judul minimal 3 karakter").max(120, "Maksimal 120 karakter"),
  isi: z.string().trim().min(5, "Isi minimal 5 karakter").max(2000, "Maksimal 2000 karakter"),
  target_kelas_id: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .pipe(z.string().uuid("Kelas tidak valid").nullable()),
});

export const roleSchema = z.enum(["admin", "guru", "wali"], { message: "Role tidak valid" });

// ---- REST API ----
export const apiCreateHafalanSchema = z
  .object({
    santri_id: z.string().uuid("santri_id harus UUID"),
    jenis: jenisEnum,
    materi: z.string().trim().min(3, "Minimal 3 karakter").max(100, "Maksimal 100 karakter"),
    nilai: z.number({ message: "nilai harus angka" }).int().min(0).max(100),
    status: statusEnum.default("lulus"),
    catatan: z.string().trim().max(500).optional(),
    tanggal: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD")
      .optional(),
  })
  .strict();

export const apiUpdateHafalanSchema = z
  .object({
    jenis: jenisEnum,
    materi: z.string().trim().min(3).max(100),
    nilai: z.number({ message: "nilai harus angka" }).int().min(0).max(100),
    status: statusEnum,
    catatan: z.string().trim().max(500),
    tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
  })
  .partial()
  .strict()
  .refine((o) => Object.keys(o).length > 0, { message: "Minimal satu field harus diisi" });

export const apiListQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: statusEnum.optional(),
  santri_id: z.string().uuid().optional(),
});
