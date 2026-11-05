"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md rounded-card border border-primary/10 bg-white p-8 text-center shadow">
        <h1 className="text-xl font-bold text-primary-dark">Terjadi kesalahan</h1>
        <p className="mt-2 text-sm text-ink/70">
          Halaman tidak dapat dimuat. Pastikan file <code>.env.local</code> sudah berisi
          URL dan key Supabase, lalu coba lagi.
        </p>
        <button
          onClick={reset}
          className="mt-5 min-h-11 rounded-xl bg-primary px-5 font-semibold text-white hover:bg-primary-dark"
        >
          Coba lagi
        </button>
      </div>
    </main>
  );
}
