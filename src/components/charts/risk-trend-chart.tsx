'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export type TrendPoint = {
  label: string;
  score: number;
  stage: number;
};

export function RiskTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-72 w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" stroke="#64748b" />
          <YAxis domain={[0, 100]} stroke="#64748b" />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
