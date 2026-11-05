"use client";

import { useActionState } from "react";
import { toggleHafalanStatusAction, deleteHafalanAction } from "@/lib/actions/hafalan";
import type { RowActionState } from "@/lib/form";
import type { HafalanStatus } from "@/lib/types";
import { ConfirmDeleteButton } from "@/components/ui/ConfirmDeleteButton";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function HafalanRowActions({
  id,
  status,
  canToggle,
  canDelete,
  materi,
  santriNama,
}: {
  id: string;
  status: HafalanStatus;
  canToggle: boolean;
  canDelete: boolean;
  materi?: string;
  santriNama?: string;
}) {
  const [toggleState, toggleAction] = useActionState(toggleHafalanStatusAction, { status: "idle" } as RowActionState);
  if (!canToggle && !canDelete) return null;

  return (
    <div className="flex flex-wrap items-start gap-2">
      {canToggle && (
        <div>
          <form action={toggleAction}>
            <input type="hidden" name="id" value={id} />
            <SubmitButton variant="outline" pendingLabel="Menyimpan...">
              {status === "lulus" ? "Tandai Ulangi" : "Tandai Lulus"}
            </SubmitButton>
          </form>
          {toggleState.status === "error" && toggleState.message && (
            <p role="alert" className="mt-1 text-xs font-medium text-danger">
              {toggleState.message}
            </p>
          )}
        </div>
      )}
      {canDelete && (
        <ConfirmDeleteButton
          action={deleteHafalanAction}
          id={id}
          title="Hapus catatan hafalan?"
          description={
            materi && santriNama
              ? `Catatan "${materi}" milik ${santriNama} akan dihapus permanen dan tidak bisa dikembalikan.`
              : "Catatan ini akan dihapus permanen dan tidak bisa dikembalikan."
          }
        />
      )}
    </div>
  );
}
