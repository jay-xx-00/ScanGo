"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const dailyData = [
  { day: "Mon", Cleared: 38, Mismatch: 4, Flagged: 12 },
  { day: "Tue", Cleared: 52, Mismatch: 6, Flagged: 19 },
  { day: "Wed", Cleared: 44, Mismatch: 3, Flagged: 10 },
  { day: "Thu", Cleared: 61, Mismatch: 8, Flagged: 22 },
  { day: "Fri", Cleared: 55, Mismatch: 5, Flagged: 17 },
  { day: "Sat", Cleared: 70, Mismatch: 2, Flagged: 8 },
  { day: "Sun", Cleared: 29, Mismatch: 1, Flagged: 5 },
];

const totals = dailyData.reduce(
  (acc, d) => ({
    Cleared: acc.Cleared + d.Cleared,
    Mismatch: acc.Mismatch + d.Mismatch,
    Flagged: acc.Flagged + d.Flagged,
  }),
  { Cleared: 0, Mismatch: 0, Flagged: 0 }
);

const pieData = [
  { name: "Cleared", value: totals.Cleared },
  { name: "Mismatch", value: totals.Mismatch },
  { name: "Flagged", value: totals.Flagged },
];

const COLORS = ["#7cd9a1", "#ffb4a5", "#0f7a4b"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl p-3 text-xs" style={{ background: "rgba(28,32,38,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <p className="text-on-surface font-bold mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function StatsPage() {
  return (
    <main className="flex-grow pt-24 pb-32 px-container-margin max-w-2xl mx-auto w-full">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/5 backdrop-blur-md border-b border-white/10 h-16 flex items-center px-container-margin">
        <div>
          <span className="font-bold text-primary text-[18px]">ScanGo</span>
          <span className="text-on-surface-variant text-[10px] tracking-widest uppercase ml-2">Analytics</span>
        </div>
      </header>

      <div className="mb-8">
        <h1 className="font-headline-lg-mobile text-on-surface font-bold mb-1">Stats</h1>
        <p className="font-body-md text-on-surface-variant/80">Last 7 days — verification outcomes</p>
      </div>

      {/* Summary Chips */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {pieData.map((d, i) => (
          <div key={d.name} className="glass-card rounded-xl px-4 py-3 flex-1 min-w-[90px] bg-white/5 border border-white/10 text-center">
            <p className="font-label-sm text-on-surface-variant/60 text-[10px] mb-1 uppercase tracking-wider">{d.name}</p>
            <p className="font-headline-md font-bold" style={{ color: COLORS[i] }}>{d.value}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="glass-card rounded-2xl p-5 mb-6 bg-white/5 border border-white/10">
        <h2 className="font-headline-md text-on-surface font-semibold mb-4 text-base">Daily Breakdown</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={dailyData} barSize={10} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: "#becabf", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#becabf", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#becabf", paddingTop: "12px" }} />
            <Bar dataKey="Cleared" fill="#7cd9a1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Flagged" fill="#0f7a4b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Mismatch" fill="#ffb4a5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="glass-card rounded-2xl p-5 bg-white/5 border border-white/10">
        <h2 className="font-headline-md text-on-surface font-semibold mb-4 text-base">7-Day Outcome Split</h2>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#becabf" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
