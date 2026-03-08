import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";
import { fmt } from "./DeloitteSalaryAnalyzer";

export default function BenchmarkChart({ userSalary, level, levelStats }) {
  const s = levelStats?.salary;
  if (!s) return null;

  const data = [
    { name: "P10", value: s.p10, fill: "#334155" },
    { name: "P25", value: s.p25, fill: "#475569" },
    { name: "Median", value: s.p50, fill: "#6366f1" },
    { name: "P75", value: s.p75, fill: "#475569" },
    { name: "P90", value: s.p90, fill: "#334155" },
    { name: "You", value: userSalary, fill: "#22c55e" },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 10,
            color: "#f1f5f9",
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
            stroke="#22c55e"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
