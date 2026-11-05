import { redirect } from "next/navigation";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { NavLinks } from "@/components/layout/NavLinks";
import { Sidebar } from "@/components/layout/Sidebar";
import { SignOutButton } from "@/components/layout/SignOutButton";
import { getProfile, getUser } from "@/lib/auth/session";
import { MENU } from "@/lib/nav";
import { initials } from "@/lib/query";
import { ROLE_LABEL } from "@/lib/types";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  // Profil belum ada: JANGAN redirect ke /login (memicu loop). Tampilkan penjelasan + tombol keluar.
  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-card border border-primary/10 bg-white p-8 text-center shadow">
          <h1 className="text-xl font-bold text-primary-dark">Profil belum tersedia</h1>
          <p className="mt-2 text-sm text-ink/70">
            Akunmu sudah masuk, tetapi profilnya belum dibuat. Hubungi admin atau coba keluar lalu masuk lagi.
          </p>
          <div className="mt-5 flex justify-center">
            <SignOutButton className="bg-primary text-white hover:bg-primary-dark" />
          </div>
        </div>
      </main>
    );
  }

  const name = profile.full_name || user.email?.split("@")[0] || "Pengguna";

  return (
    <MotionProvider>
      <div className="flex min-h-screen">
        <Sidebar role={profile.role} fullName={name} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-primary/10 bg-white/70 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3 px-4 py-2 md:px-8">
              <p className="text-base font-bold text-primary-dark md:hidden">TPQ Nurul Iman</p>
              <p className="hidden text-sm text-ink/70 md:block">Sistem Informasi TPQ</p>
              <div className="flex items-center gap-2">
                <span className="hidden text-sm font-semibold text-primary-dark sm:inline">{name}</span>
                <span className="rounded-full bg-gold/25 px-2 py-0.5 text-xs font-semibold text-primary-dark">
                  {ROLE_LABEL[profile.role]}
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
                >
                  {initials(name)}
                </span>
                <div className="md:hidden">
                  <SignOutButton className="text-primary-dark hover:bg-primary/10" />
                </div>
              </div>
            </div>
            <nav aria-label="Menu utama" className="border-t border-primary/10 md:hidden">
              <NavLinks items={MENU[profile.role]} variant="bar" />
            </nav>
          </header>
          <main id="konten" className="flex-1 p-4 md:p-8">
            <div className="mx-auto max-w-5xl space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </MotionProvider>
  );
}
