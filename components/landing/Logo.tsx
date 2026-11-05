/** Lambang sederhana: perisai hijau, bulan sabit emas, dan kitab terbuka. Ganti dengan logo asli TPQ jika ada. */
export function Logo({ className = "h-10 w-10", label }: { className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path
        d="M32 3 58 13v23c0 13-10 21-26 26C16 57 6 49 6 36V13z"
        fill="#064e3b"
        stroke="#d9a441"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="21" r="9" fill="#d9a441" />
      <circle cx="36" cy="19" r="8" fill="#064e3b" />
      <circle cx="41" cy="14" r="1.8" fill="#fffbeb" />
      <path d="M13 38c6-3 13-3 19 1 6-4 13-4 19-1v11c-6-3-13-3-19 1-6-4-13-4-19-1z" fill="#fffbeb" />
      <path d="M32 39v11" stroke="#064e3b" strokeWidth="1.5" />
    </svg>
  );
}