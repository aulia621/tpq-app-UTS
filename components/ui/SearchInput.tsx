"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchInput({ placeholder, label }: { placeholder: string; label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const v = value.trim();
    if (v) params.set("search", v);
    else params.delete("search");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <div className="w-full sm:max-w-sm">
      <label htmlFor="search-input" className="sr-only">
        {label}
      </label>
      <input
        id="search-input"
        type="search"
        maxLength={100}
        defaultValue={searchParams.get("search") ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full rounded-xl border border-primary/25 bg-white px-4 text-base placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}
