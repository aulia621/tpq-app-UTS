import { STEPS } from "@/lib/site";
import { SectionHeading } from "./SectionHeading";

export function StepsSection() {
  return (
    <section id="alur" aria-labelledby="judul-alur" className="scroll-mt-20">
      <SectionHeading
        id="judul-alur"
        eyebrow="Alur Penggunaan"
        title="Tahapan Menggunakan Portal"
        subtitle="Ikuti setiap tahap berikut agar wali dapat memantau perkembangan santri dengan lancar."
      />
      <ol className="mx-auto max-w-3xl">
        {STEPS.map((s, i) => (
          <li key={s.label} className="relative flex gap-5 pb-8 last:pb-0">
            {i < STEPS.length - 1 && (
              <span aria-hidden="true" className="absolute top-12 bottom-0 left-6 w-0.5 -translate-x-1/2 bg-primary/40" />
            )}
            <span
              aria-hidden="true"
              className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-dark to-primary text-lg font-bold text-white shadow-lg shadow-primary/30"
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1 rounded-card border border-primary/10 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{s.label}</p>
              <h3 className="mt-1 text-lg font-bold text-primary-dark">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/75">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}