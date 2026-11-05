import Link from "next/link";
import { Badge, StatusBadge } from "@/components/ui/StatusBadge";
import { formatTanggal } from "@/lib/query";
import { JENIS_LABEL, type HafalanRow } from "@/lib/types";
import { HafalanRowActions } from "./HafalanRowActions";

export function HafalanCard({
  item,
  canToggle,
  canDelete,
  showSantri = true,
}: {
  item: HafalanRow;
  canToggle: boolean;
  canDelete: boolean;
  showSantri?: boolean;
}) {
  const nama = item.santri?.nama ?? "Santri";
  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        {showSantri ? (
          <Link
            href={`/dashboard/santri/${item.santri_id}`}
            className="min-w-0 wrap-break-word font-bold text-heading underline-offset-2 hover:underline"
          >
            {nama}
          </Link>
        ) : (
          <span className="font-semibold text-heading">{formatTanggal(item.tanggal)}</span>
        )}
        {showSantri && <span className="shrink-0 text-xs text-ink/60">{formatTanggal(item.tanggal)}</span>}
      </div>
      <div className="mt-2">
        <Badge tone="muted">{JENIS_LABEL[item.jenis]}</Badge>
      </div>
      <p dir="auto" className="mt-3 wrap-break-word font-arab text-2xl leading-relaxed text-heading">
        {item.materi}
      </p>
      {item.catatan && <p className="mt-1 wrap-break-word text-sm text-ink/70">{item.catatan}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-ink">Nilai {item.nilai ?? "-"}</span>
        <StatusBadge status={item.status} />
      </div>
      <div className="mt-3">
        <HafalanRowActions
          id={item.id}
          status={item.status}
          canToggle={canToggle}
          canDelete={canDelete}
          materi={item.materi}
          santriNama={nama}
        />
      </div>
    </div>
  );
}