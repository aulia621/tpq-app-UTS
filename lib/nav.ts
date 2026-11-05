import type { UserRole } from "@/lib/types";

export type NavItem = { href: string; label: string };

export const MENU: Record<UserRole, NavItem[]> = {
  admin: [
    { href: "/dashboard", label: "Beranda" },
    { href: "/dashboard/santri", label: "Data Santri" },
    { href: "/dashboard/hafalan", label: "Hafalan" },
    { href: "/dashboard/kelas", label: "Kelas" },
    { href: "/dashboard/pengumuman", label: "Pengumuman" },
    { href: "/dashboard/pengguna", label: "Pengguna" },
    { href: "/dashboard/api-tester", label: "API Tester" },
  ],
  guru: [
    { href: "/dashboard", label: "Beranda" },
    { href: "/dashboard/santri", label: "Daftar Santri" },
    { href: "/dashboard/hafalan", label: "Hafalan" },
    { href: "/dashboard/pengumuman", label: "Pengumuman" },
  ],
  wali: [
    { href: "/dashboard", label: "Beranda" },
    { href: "/dashboard/perkembangan", label: "Perkembangan Anak" },
    { href: "/dashboard/pengumuman", label: "Pengumuman" },
  ],
};
