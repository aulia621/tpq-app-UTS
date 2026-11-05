export type UserRole = "admin" | "guru" | "wali";
export type Jenis = "iqro" | "quran" | "hafalan";
export type HafalanStatus = "lulus" | "ulang";

export const JENIS_LIST = ["iqro", "quran", "hafalan"] as const;
export const STATUS_LIST = ["lulus", "ulang"] as const;
export const ROLE_LIST = ["admin", "guru", "wali"] as const;

export const JENIS_LABEL: Record<Jenis, string> = {
  iqro: "Iqro",
  quran: "Al-Qur'an",
  hafalan: "Hafalan Surat",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Admin",
  guru: "Guru",
  wali: "Wali",
};

export type Profile = {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
};

export type KelasRow = { id: string; nama: string; guru_id: string | null };

export type SantriRow = {
  id: string;
  nama: string;
  nis: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: "L" | "P" | null;
  kelas_id: string | null;
  wali_id: string | null;
  aktif: boolean;
  kelas: { nama: string } | null;
};

export type HafalanRow = {
  id: string;
  santri_id: string;
  guru_id: string | null;
  tanggal: string;
  jenis: Jenis;
  materi: string;
  nilai: number | null;
  status: HafalanStatus;
  catatan: string | null;
  santri: { nama: string } | null;
};

export type PengumumanRow = {
  id: string;
  judul: string;
  isi: string;
  dibuat_oleh: string | null;
  created_at: string;
  kelas: { nama: string } | null;
};

export type AdminUserRow = {
  id: string;
  email: string | null;
  full_name: string;
  role: UserRole;
  created_at: string;
};
