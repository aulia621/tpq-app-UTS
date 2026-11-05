// Satu sumber kebenaran untuk identitas dan isi halaman depan.
// Semua nilai bertanda "CONTOH" HARUS diganti dengan data TPQ yang sebenarnya.

export const SITE_NAME = "TPQ Nurul Iman";
export const SITE_TAGLINE = "Sistem Informasi Santri";
export const SITE_MOTTO = "Membaca, memahami, dan mengamalkan Al-Qur'an.";
export const SITE_VERSION = "v1.0.0";

// Zona waktu untuk jam di navbar (WIB)
export const TIME_ZONE = "Asia/Jakarta";

// Foto latar hero. Taruh file di folder public/, lalu isi path-nya. Contoh: "/hero-tpq.jpg"
// Biarkan null untuk memakai latar pola geometris bawaan.
export const HERO_IMAGE: string | null = null;

// ---- Strip statistik (CONTOH: ganti dengan data asli) ----
export const FOUNDED_YEAR = 2015;
export const STATS_STATIC = {
  santriAktif: "100+",
  alumni: "500+",
};

// ---- Kartu profil (CONTOH). "image" opsional: taruh foto di public/ lalu isi path-nya ----
export type ProfileIcon = "mosque" | "book" | "users";
export type ProfileCard = { title: string; text: string; icon: ProfileIcon; image?: string };

export const PROFILE_CARDS: ProfileCard[] = [
  {
    title: "Tentang Kami",
    text: "Lembaga pendidikan Al-Qur'an yang membimbing santri belajar membaca, memahami, dan mengamalkan Al-Qur'an sejak dini.",
    icon: "mosque",
  },
  {
    title: "Program Belajar",
    text: "Belajar bertahap mulai dari Iqro, membaca Al-Qur'an, hingga hafalan surat-surat pendek dan doa harian.",
    icon: "book",
  },
  {
    title: "Pembinaan Santri",
    text: "Setiap santri dibimbing ustadz dan ustadzah, dengan perkembangan hafalan yang dicatat dan dapat dipantau wali.",
    icon: "users",
  },
];

// ---- Alur memakai portal ----
export const STEPS = [
  {
    label: "Tahap I",
    title: "Daftar Akun Wali",
    text: "Buat akun wali santri lewat portal ini memakai email, atau gunakan NIS anak jika tidak memiliki email.",
  },
  {
    label: "Tahap II",
    title: "Hubungkan dengan Data Santri",
    text: "Admin TPQ menghubungkan akunmu dengan data santri. Hubungi admin dan sebutkan email yang kamu pakai untuk mendaftar.",
  },
  {
    label: "Tahap III",
    title: "Pantau Perkembangan Santri",
    text: "Masuk ke portal untuk melihat catatan hafalan, nilai, grafik perkembangan, dan pengumuman terbaru dari TPQ.",
  },
] as const;

// ---- Kontak (CONTOH: ganti dengan data asli) ----
export const CONTACT = {
  alamat: "Jl. Contoh No. 1, Desa Contoh, Kecamatan Contoh, Kabupaten Contoh",
  telepon: "(0000) 0000 0000",
  whatsapp: "https://wa.me/6280000000000",
  email: "info@contoh-tpq.id",
  jamKerja: "Setiap hari, 15:30-18:00 WIB",
  petaUrl: "https://www.google.com/maps",
};

// Hapus baris yang tidak dipakai. Ganti href dengan akun TPQ yang sebenarnya.
export type SocialName = "instagram" | "youtube" | "facebook" | "whatsapp" | "tiktok";
export const SOCIALS: { name: SocialName; label: string; href: string }[] = [
  { name: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { name: "youtube", label: "YouTube", href: "https://www.youtube.com/" },
  { name: "facebook", label: "Facebook", href: "https://www.facebook.com/" },
  { name: "whatsapp", label: "WhatsApp", href: CONTACT.whatsapp },
  { name: "tiktok", label: "TikTok", href: "https://www.tiktok.com/" },
];