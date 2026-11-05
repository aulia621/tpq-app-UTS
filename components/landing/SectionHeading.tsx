export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-3xl font-extrabold text-heading sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-ink/70">{subtitle}</p>}
    </div>
  );
}