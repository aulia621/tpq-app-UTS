import Image from "next/image";
import Link from "next/link";
import { HeroCta } from "@/components/landing/HeroCta";
import { Logo } from "@/components/landing/Logo";
import { ProfileSection } from "@/components/landing/ProfileSection";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { StatsStrip } from "@/components/landing/StatsStrip";
import { StepsSection } from "@/components/landing/StepsSection";
import { SiteNavbar, type NavbarUser } from "@/components/layout/SiteNavbar";
import { Metric } from "@/components/ui/Card";
import { getProfile, getUser } from "@/lib/auth/session";
import { formatTanggal } from "@/lib/query";
import { HERO_IMAGE, SITE_NAME } from "@/lib/site";
import { readSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { ROLE_LABEL } from "@/lib/types";

const FEATURES = [
  { title: "Data Santri", text: "Kelola data santri, kelas, dan wali dalam satu tempat." },
  { title: "Catatan Hafalan", text: "Catat Iqro, Al-Qur'an, dan hafalan surat lengkap dengan nilai dan grafik." },
  { title: "Pengumuman", text: "Sampaikan informasi TPQ ke seluruh wali dengan cepat." },
];

const TABLES = [
  { name: "profiles", text: "Akun dan peran (admin, guru, wali)" },
  { name: "kelas", text: "Kelas dan guru pengampu" },
  { name: "santri", text: "Data santri, terhubung ke kelas dan wali" },
  { name: "hafalan", text: "Pencapaian hafalan dan mengaji" },
  { name: "pengumuman", text: "Informasi untuk wali santri" },
];

// Pola bintang segi delapan (motif geometris Islami) sebagai latar bila tidak ada foto
const TILE =
  '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><g fill="none" stroke="#d9a441" stroke-opacity=".22" stroke-width="1"><rect x="20" y="20" width="40" height="40"/><rect x="20" y="20" width="40" height="40" transform="rotate(45 40 40)"/></g></svg>';
const PATTERN = `url("data:image/svg+xml,${encodeURIComponent(TILE)}")`;

export default async function Home() {
  const configured = readSupabaseEnv() !== null;
  let connected = false;
  let navUser: NavbarUser = null;
  let metrics: { santri: number; kelas: number; hafalan: number } | null = null;
  let pengumuman: { id: string; judul: string; created_at: string }[] = [];

  if (configured) {
    try {
      const supabase = await createClient();
      const probe = await supabase.from("kelas").select("id", { count: "exact", head: true });
      connected = !probe.error;

      const user = await getUser();
      if (user) {
        // Profil null tidak boleh melempar error atau redirect (mencegah loop)
        const profile = await getProfile();
        navUser = {
          displayName: profile?.full_name || user.email?.split("@")[0] || "Pengguna",
          role: profile?.role,
        };
        if (profile) {
          const c = (t: "santri" | "kelas" | "hafalan") =>
            supabase.from(t).select("id", { count: "exact", head: true });
          const [s, k, h, p] = await Promise.all([
            c("santri"),
            c("kelas"),
            c("hafalan"),
            supabase.from("pengumuman").select("id, judul, created_at").order("created_at", { ascending: false }).limit(3),
          ]);
          metrics = { santri: s.count ?? 0, kelas: k.count ?? 0, hafalan: h.count ?? 0 };
          pengumuman = (p.data ?? []) as typeof pengumuman;
        }
      }
    } catch {
      connected = false;
    }
  }

  const loggedIn = navUser !== null;

  return (
    <>
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-primary-dark focus:shadow-lg"
      >
        Lewati ke konten utama
      </a>
      <SiteNavbar user={navUser} />

      <main id="konten-utama" tabIndex={-1} className="focus:outline-none">
        <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] items-center justify-center overflow-hidden bg-primary-dark px-4 py-16 text-white">
          {HERO_IMAGE && (
            <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
          )}
          <div
            aria-hidden="true"
            className={`absolute inset-0 -z-10 ${
              HERO_IMAGE
                ? "bg-linear-to-b from-primary-dark/85 via-primary-dark/75 to-primary-dark/95"
                : "bg-linear-to-br from-primary-dark via-primary to-primary-dark"
            }`}
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-70" style={{ backgroundImage: PATTERN }} />
          <div aria-hidden="true" className="absolute -top-28 -right-28 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            {!configured && (
              <p role="alert" className="mx-auto mb-6 max-w-md rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-primary-dark">
                Konfigurasi Supabase belum diisi. Lengkapi file .env.local lalu restart server.
              </p>
            )}

            <Logo className="mx-auto h-20 w-20 drop-shadow-lg sm:h-24 sm:w-24" />

            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="currentColor" aria-hidden="true">
                <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
              </svg>
              Portal Resmi Santri &amp; Wali
            </p>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
              Sistem Informasi Santri
              <span className="mt-1 block text-emerald-300">{SITE_NAME}</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-white/90 sm:text-lg">
              {loggedIn
                ? `Assalamu'alaikum, ${navUser?.displayName}${navUser?.role ? ` (${ROLE_LABEL[navUser.role]})` : ""}. Lanjutkan pengelolaan TPQ dari dashboard.`
                : `Selamat datang di portal resmi ${SITE_NAME}. Pantau hafalan dan mengaji, kelola data santri, serta terima pengumuman dalam satu tempat.`}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {loggedIn ? (
                <HeroCta href="/dashboard" label="Buka Dashboard" icon="dashboard" />
              ) : (
                <>
                  <HeroCta href="/login?mode=daftar" label="Daftar Sekarang" icon="user-plus" />
                  <HeroCta href="#informasi" label="Lihat Informasi" variant="outline" icon="info" />
                </>
              )}
              {loggedIn && <HeroCta href="#informasi" label="Lihat Informasi" variant="outline" icon="info" />}
            </div>

            {!loggedIn && (
              <p className="mt-5 text-sm text-white/80">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-bold text-emerald-200 underline underline-offset-4">
                  Masuk di sini
                </Link>
              </p>
            )}
            {navUser?.role === "admin" && (
              <p className="mt-4">
                <Link href="/dashboard/api-tester" className="inline-flex min-h-11 items-center text-sm font-semibold text-white underline">
                  Uji REST API
                </Link>
              </p>
            )}
          </div>
        </section>

        <StatsStrip />

        <div id="informasi" className="mx-auto max-w-6xl scroll-mt-20 space-y-20 px-4 py-16">
          <ProfileSection />
          <StepsSection />

          {metrics && (
            <section aria-labelledby="ringkasan">
              <h2 id="ringkasan" className="mb-4 text-2xl font-bold text-primary-dark">
                Ringkasan
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <Metric label="Santri" value={metrics.santri} />
                <Metric label="Kelas" value={metrics.kelas} />
                <Metric label="Catatan hafalan" value={metrics.hafalan} />
              </div>
              {pengumuman.length > 0 && (
                <ul className="mt-4 divide-y divide-primary/10 rounded-card border border-primary/10 bg-white px-5">
                  {pengumuman.map((p) => (
                    <li key={p.id} className="flex justify-between gap-3 py-3 text-sm">
                      <span className="wrap-break-word">{p.judul}</span>
                      <span className="shrink-0 text-xs text-ink/60">{formatTanggal(p.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section id="fitur" aria-labelledby="fitur-judul" className="scroll-mt-20">
            <h2 id="fitur-judul" className="mb-4 text-2xl font-bold text-primary-dark">
              Fitur utama
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-card border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-md">
                  <h3 className="font-bold text-primary-dark">{f.title}</h3>
                  <p className="mt-2 text-sm text-ink/80">{f.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="arsitektur">
            <h2 id="arsitektur" className="mb-4 text-2xl font-bold text-primary-dark">
              Arsitektur data
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {TABLES.map((t) => (
                <div key={t.name} className="rounded-card border border-primary/10 bg-white p-4">
                  <p className="font-mono text-sm font-bold text-primary">{t.name}</p>
                  <p className="mt-1 text-xs text-ink/70">{t.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-ink/70">
              Seluruh data dilindungi Row Level Security di database: setiap peran hanya melihat data yang menjadi haknya.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter configured={configured} connected={connected} />
    </>
  );
}