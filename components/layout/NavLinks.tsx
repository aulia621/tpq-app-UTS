"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/nav";

export function NavLinks({ items, variant }: { items: NavItem[]; variant: "sidebar" | "bar" }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  if (variant === "bar") {
    return (
      <ul className="flex gap-1 overflow-x-auto px-3 py-2">
        {items.map((i) => (
          <li key={i.href} className="shrink-0">
            <Link
              href={i.href}
              aria-current={isActive(i.href) ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap ${
                isActive(i.href) ? "bg-primary text-white" : "bg-surface text-heading border border-primary/15"
              }`}
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-1">
      {items.map((i) => (
        <li key={i.href}>
          <Link
            href={i.href}
            aria-current={isActive(i.href) ? "page" : undefined}
            className={`flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition ${
              isActive(i.href) ? "bg-primary text-white" : "text-white/85 hover:bg-primary/50"
            }`}
          >
            {i.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}