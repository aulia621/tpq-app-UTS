"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useIsDark } from "@/components/theme/useIsDark";

export type ChartPoint = { tanggal: string; nilai: number };

// Recharts menulis warna sebagai atribut SVG, jadi nilainya dipilih di sini sesuai tema.
const COLORS = {
  light: { grid: "#d1d5db", tick: "#4b5563", line: "#047857", surface: "#ffffff", border: "#d1fae5", text: "#1f2937" },
  dark: { grid: "#2f4a41", tick: "#9ca3af", line: "#34d399", surface: "#13221d", border: "#2f4a41", text: "#e5e7eb" },
} as const;

export function ProgresChart({ data }: { data: ChartPoint[] }) {
  const c = COLORS[useIsDark() ? "dark" : "light"];
  if (data.length === 0) {
    return <p className="text-sm text-ink/70">Belum ada data nilai untuk ditampilkan.</p>;
  }
  return (
    <div role="img" aria-label={`Grafik nilai, ${data.length} catatan. Nilai terakhir ${data[data.length - 1].nilai}.`}>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
          <XAxis dataKey="tanggal" fontSize={12} tick={{ fill: c.tick }} stroke={c.grid} />
          <YAxis domain={[0, 100]} fontSize={12} tick={{ fill: c.tick }} stroke={c.grid} />
          <Tooltip
            contentStyle={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, color: c.text }}
            labelStyle={{ color: c.text }}
            itemStyle={{ color: c.line }}
          />
          <Line type="monotone" dataKey="nilai" stroke={c.line} strokeWidth={2} dot={{ r: 3, fill: c.line }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}