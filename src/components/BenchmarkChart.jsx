import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";
import { fmt } from "./DeloitteSalaryAnalyzer";

export default function BenchmarkChart({ userSalary, levelStats, groupMedian, groupLabel }) {
  const s = levelStats?.salary;
  if (!s) return null;

  const data = [
    { name: "P10", value: s.p10, fill: "#e7e5e4" },
    { name: "P25", value: s.p25, fill: "#d6d3d1" },
    { name: "Median", value: s.p50, fill: "#8b5cf6" },
    { name: "P75", value: s.p75, fill: "#d6d3d1" },
    { name: "P90", value: s.p90, fill: "#e7e5e4" },
    { name: "You", value: userSalary, fill: "#10b981" },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#a8a29e", fontSize: 11, fontFamily: "'Plus Jakarta Sans'" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#a8a29e", fontSize: 10, fontFamily: "'Geist Mono'" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            background: "white",
            border: "1px solid #e7e5e4",
            borderRadius: 12,
            color: "#1a1a1a",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            fontFamily: "'Plus Jakarta Sans'",
            fontSize: 13,
          }}
          formatter={(v) => [fmt(v), "Base Salary"]}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
        {userSalary && (
          <ReferenceLine y={userSalary} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} />
        )}
        {groupMedian && (
          <ReferenceLine
            y={groupMedian}
            stroke="#8b5cf6"
            strokeDasharray="6 3"
            strokeWidth={1.5}
            label={{ value: groupLabel, position: "right", fill: "#8b5cf6", fontSize: 10 }}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
