import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { HealthRecord } from "@/dto/HealthRecord";

export function VitalsTrendChart({ record }: { record: HealthRecord }) {
  const data = record.vitalsTrend.map((v) => ({
    date: v.date.slice(5),
    "BP Sys": v.bpSys,
    "BP Dia": v.bpDia,
    "Heart Rate": v.heartRate,
    Glucose: v.glucose ?? 0,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="var(--muted)" />
          <YAxis tick={{ fontSize: 12 }} stroke="var(--muted)" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="BP Sys" stroke="#0f766e" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="BP Dia" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="Glucose" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}