import { MENU } from "@/lib/nav";
import { ROLE_LABEL, type UserRole } from "@/lib/types";
import { NavLinks } from "./NavLinks";
import { SignOutButton } from "./SignOutButton";

export function Sidebar({ role, fullName }: { role: UserRole; fullName: string }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-primary-dark p-5 text-white md:flex">
      <div className="mb-6">
        <p className="text-xl font-bold">TPQ Nurul Iman</p>
        <p className="mt-2 truncate text-sm text-white/80">{fullName}</p>
        <span className="mt-1 inline-block rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-primary-dark">
          {ROLE_LABEL[role]}
        </span>
      </div>
      <nav aria-label="Menu utama" className="flex-1 overflow-y-auto">
        <NavLinks items={MENU[role]} variant="sidebar" />
      </nav>
      <SignOutButton className="text-white/80 hover:bg-primary/50" />
    </aside>
  );
}
