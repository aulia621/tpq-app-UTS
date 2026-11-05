import Image from "next/image";
import { PROFILE_CARDS, SITE_NAME } from "@/lib/site";
import { Icon } from "./Icons";
import { SectionHeading } from "./SectionHeading";

export function ProfileSection() {
  return (
    <section id="profil" aria-labelledby="judul-profil" className="scroll-mt-20">
      <SectionHeading
        id="judul-profil"
        eyebrow="Profil"
        title={SITE_NAME}
        subtitle={`Mengenal lebih dekat ${SITE_NAME}.`}
      />
      <ul className="grid gap-6 md:grid-cols-3">
        {PROFILE_CARDS.map((c) => (
          <li
            key={c.title}
            className="overflow-hidden rounded-card border border-primary/10 bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <div className="relative flex h-44 items-center justify-center bg-linear-to-br from-primary-dark to-primary">
              {c.image ? (
                <Image src={c.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              ) : (
                <Icon name={c.icon} className="h-16 w-16 text-gold" />
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-heading">{c.title}</h3>
              <p className="mt-2 text-sm text-ink/75">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}