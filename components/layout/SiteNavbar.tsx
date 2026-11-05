import Link from "next/link";
import { LiveClock } from "@/components/landing/LiveClock";
import { Logo } from "@/components/landing/Logo";
import { initials } from "@/lib/query";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { ROLE_LABEL, type UserRole } from "@/lib/types";
import { SignOutButton } from "./SignOutButton";

export type NavbarUser = { displayName: string; role?: UserRole } | null;

export function SiteNavbar({ user }: { user: NavbarUser }) {
  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-white/90 shadow-sm backdrop-blur-md">
      <nav
        aria-label="Navigasi situs"
        className="relative mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4"
      >
        <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label={`${SITE_NAME}, beranda`}>
          <Logo className="h-10 w-10 shrink-0" />
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-extrabold text-primary-dark">{SITE_NAME}</span>
            <span className="block text-[11px] font-medium text-ink/60">{SITE_TAGLINE}</span>
          </span>
        </Link>

        <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 md:block">
          <LiveClock />
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
            >
              {initials(user.displayName)}
            </span>
            <span className="hidden max-w-40 truncate text-sm font-semibold text-primary-dark lg:inline">
              {user.displayName}
            </span>
            {user.role && (
              <span className="hidden rounded-full bg-gold/25 px-2 py-0.5 text-xs font-semibold text-primary-dark lg:inline">
                {ROLE_LABEL[user.role]}
              </span>
            )}
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Dashboard
            </Link>
            <SignOutButton className="text-primary-dark hover:bg-primary/10" />
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary/10"
            >
              Masuk
            </Link>
            <Link
              href="/login?mode=daftar"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-md hover:bg-primary-dark"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6" />
              </svg>
              <span className="hidden sm:inline">Daftar Sekarang</span>
              <span className="sm:hidden">Daftar</span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}