import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";
import { fmt } from "./DeloitteSalaryAnalyzer";

export default function BenchmarkChart({ userSalary, levelStats, groupMedian, groupLabel }) {
  const s = levelStats?.salary;
  if (!s) return null;

  const data = [
    { name: "P10", value: s.p10, fill: "#e2e8f0" },
    { name: "P25", value: s.p25, fill: "#cbd5e1" },
    { name: "Median", value: s.p50, fill: "#2563eb" },
    { name: "P75", value: s.p75, fill: "#cbd5e1" },
    { name: "P90", value: s.p90, fill: "#e2e8f0" },
    { name: "You", value: userSalary, fill: "#f97316" },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="2 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#64748b", fontSize: 11, fontFamily: "'Fira Sans'" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 10, fontFamily: "'Fira Code'" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          cursor={{ fill: "#f1f5f9" }}
          contentStyle={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 4,
            color: "#1e293b",
            boxShadow: "none",
            fontFamily: "'Fira Code'",
            fontSize: 12,
            padding: "6px 10px",
          }}
          formatter={(v) => [fmt(v), "Base Salary"]}
        />
        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
        {userSalary && (
          <ReferenceLine y={userSalary} stroke="#f97316" strokeDasharray="3 3" strokeWidth={1} />
        )}
        {groupMedian && (
          <ReferenceLine
            y={groupMedian}
            stroke="#2563eb"
            strokeDasharray="5 3"
            strokeWidth={1}
            label={{ value: groupLabel, position: "right", fill: "#2563eb", fontSize: 10, fontFamily: "'Fira Code'" }}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
