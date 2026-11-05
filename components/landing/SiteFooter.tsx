import Link from "next/link";
import { CONTACT, SITE_MOTTO, SITE_NAME, SITE_VERSION, SOCIALS } from "@/lib/site";
import { Icon, type IconName } from "./Icons";
import { Logo } from "./Logo";

const QUICK_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/#profil", label: "Profil TPQ" },
  { href: "/#alur", label: "Alur Penggunaan" },
  { href: "/#fitur", label: "Fitur Portal" },
  { href: "/login", label: "Masuk" },
];

const PORTAL_LINKS = [
  { href: "/login?mode=daftar", label: "Daftar Akun Wali" },
  { href: "/login", label: "Masuk ke Portal" },
  { href: "/#alur", label: "Panduan Wali" },
  { href: "/#kontak", label: "Hubungi Admin" },
];

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-l-4 border-emerald-400 pl-3 text-sm font-extrabold uppercase tracking-[0.2em] text-white">
      {children}
    </h2>
  );
}

function LinkList({ label, links }: { label: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={label}>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="inline-flex min-h-8 items-center gap-2 text-emerald-100 hover:text-white hover:underline">
              <span aria-hidden="true" className="text-emerald-400">›</span>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ContactItem({ icon, label, children }: { icon: IconName; label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-400/30 bg-black/25 text-emerald-300">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-300">{label}</p>
        <div className="text-sm text-emerald-50 wrap-break-word">{children}</div>
      </div>
    </li>
  );
}

export function SiteFooter({ configured, connected }: { configured: boolean; connected: boolean }) {
  const year = new Date().getFullYear();
  return (
    <>
      {/* Gelombang pemisah */}
      <div aria-hidden="true" className="bg-page leading-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-12 w-full text-heading sm:h-16">
          <path fill="currentColor" d="M0 44C200 4 420 84 720 44s520-40 720 0V80H0z" />
        </svg>
      </div>

      <footer id="kontak" className="scroll-mt-20 bg-primary-dark text-emerald-100">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-14 w-14 shrink-0" />
              <p className="text-2xl font-extrabold text-white">{SITE_NAME}</p>
            </div>
            <p dir="rtl" lang="ar" className="mt-5 font-arab text-3xl leading-loose text-gold">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="mt-2 text-sm text-emerald-100">{SITE_MOTTO}</p>
            {SOCIALS.length > 0 && (
              <ul aria-label="Media sosial" className="mt-5 flex flex-wrap gap-3">
                {SOCIALS.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} (buka di tab baru)`}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/40 text-emerald-200 transition hover:bg-emerald-400/20 hover:text-white"
                    >
                      <Icon name={s.name} className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <Heading>Tautan Cepat</Heading>
            <LinkList label="Tautan cepat" links={QUICK_LINKS} />
          </div>

          <div>
            <Heading>Info Portal</Heading>
            <LinkList label="Info portal" links={PORTAL_LINKS} />
          </div>

          <div>
            <Heading>Kontak Kami</Heading>
            <ul className="mt-5 space-y-4">
              <ContactItem icon="pin" label="Alamat">
                {CONTACT.alamat}
              </ContactItem>
              <ContactItem icon="phone" label="Telepon">
                {CONTACT.telepon}
                {" · "}
                <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                  WhatsApp
                </a>
              </ContactItem>
              <ContactItem icon="mail" label="Email">
                <a href={`mailto:${CONTACT.email}`} className="underline hover:text-white">
                  {CONTACT.email}
                </a>
              </ContactItem>
              <ContactItem icon="clock" label="Jam Kerja">
                {CONTACT.jamKerja}
              </ContactItem>
            </ul>
            <a
              href={CONTACT.petaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-emerald-400/40 font-semibold text-emerald-200 hover:bg-emerald-400/15 hover:text-white"
            >
              <Icon name="pin" className="h-5 w-5" />
              Lihat di Peta
              <span className="sr-only"> (buka di tab baru)</span>
            </a>
          </div>
        </div>

        <div className="border-t border-emerald-400/30 bg-black/30">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-sm text-emerald-100 sm:flex-row">
            <p>
              © {year} {SITE_NAME}. Hak cipta dilindungi.
            </p>
            <p className="flex flex-wrap items-center justify-center gap-3">
              <span>Dibangun dengan Next.js &amp; Supabase</span>
              <span className="rounded-full border border-emerald-400/40 px-3 py-0.5 text-xs">{SITE_VERSION}</span>
              <span className="inline-flex items-center gap-2 text-xs">
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-400" : "bg-red-400"}`} />
                {!configured ? "Konfigurasi belum diisi" : connected ? "Database terhubung" : "Database bermasalah"}
              </span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}