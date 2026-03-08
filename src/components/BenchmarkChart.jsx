import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";
import { fmt } from "./DeloitteSalaryAnalyzer";

export default function BenchmarkChart({ userSalary, level, levelStats }) {
  const s = levelStats?.salary;
  if (!s) return null;

  const data = [
    { name: "P10", value: s.p10, fill: "#e2e8f0" },
    { name: "P25", value: s.p25, fill: "#cbd5e1" },
    { name: "Median", value: s.p50, fill: "#818cf8" },
    { name: "P75", value: s.p75, fill: "#cbd5e1" },
    { name: "P90", value: s.p90, fill: "#e2e8f0" },
    { name: "You", value: userSalary, fill: "#10b981" },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 12,
            color: "#0f172a",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
          formatter={(v) => [fmt(v), "Base Salary"]}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
        {userSalary && (
          <ReferenceLine
            y={userSalary}
            stroke="#10b981"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
