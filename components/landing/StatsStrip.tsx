import { FOUNDED_YEAR, STATS_STATIC } from "@/lib/site";

export function StatsStrip() {
  const tahun = new Date().getFullYear() - FOUNDED_YEAR;
  const stats = [
    { value: String(FOUNDED_YEAR), label: "Berdiri Sejak" },
    { value: `${tahun}+`, label: "Tahun Berdiri" },
    { value: STATS_STATIC.santriAktif, label: "Santri Aktif" },
    { value: STATS_STATIC.alumni, label: "Alumni" },
  ];

  return (
    <section aria-label="Statistik TPQ" className="bg-white shadow-md">
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-y-8 px-4 py-10 text-center md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse">
            <dt className="mt-1 text-sm text-ink/70">{s.label}</dt>
            <dd className="text-3xl font-extrabold text-primary sm:text-4xl">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}