import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Brush,
  Legend,
} from "recharts";

export default function RangeChart({
  data,
  title,
  lines,
  type = "line",
  yTickFormatter,
  tooltipFormatter,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="mb-4 text-lg font-bold text-slate-800">{title}</h3>

      <div className="w-full overflow-x-auto">
        <div className="h-[360px] min-w-[1000px]">
          <ResponsiveContainer width="100%" height="100%">
            {type === "bar" ? (
              <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" minTickGap={20} />
                <YAxis tickFormatter={yTickFormatter} />
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
                {lines.map((line) => (
                  <Bar key={line.key} dataKey={line.key} fill={line.color} />
                ))}
                <Brush dataKey="date" height={22} />
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" minTickGap={20} />
                <YAxis tickFormatter={yTickFormatter} />
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
                {lines.map((line) => (
                  <Line
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    stroke={line.color}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
                <Brush dataKey="date" height={22} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}