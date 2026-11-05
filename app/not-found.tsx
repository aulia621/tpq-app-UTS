import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md rounded-card border border-primary/10 bg-white p-8 text-center shadow">
        <h1 className="text-xl font-bold text-primary-dark">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-sm text-ink/70">Alamat yang kamu tuju tidak tersedia.</p>
        <Link
          href="/"
          className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 font-semibold text-white hover:bg-primary-dark"
        >
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
