"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type ChartPoint = { tanggal: string; nilai: number };

export function ProgresChart({ data }: { data: ChartPoint[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-ink/70">Belum ada data nilai untuk ditampilkan.</p>;
  }
  return (
    <div role="img" aria-label={`Grafik nilai, ${data.length} catatan. Nilai terakhir ${data[data.length - 1].nilai}.`}>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
          <XAxis dataKey="tanggal" fontSize={12} />
          <YAxis domain={[0, 100]} fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="nilai" stroke="#047857" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
