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
  Legend,
} from "recharts";

function BaseChart({ data, yKey, yKeys, type, colors }) {
  const formatTime = (tick) => {
    if (!tick) return "";
    if (typeof tick === "string" && tick.includes("T")) return tick.slice(11, 16);
    return tick;
  };

  const common = {
    data,
    margin: { top: 10, right: 20, left: 0, bottom: 20 },
  };

  if (type === "bar") {
    return (
      <BarChart {...common}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tickFormatter={formatTime} minTickGap={16} />
        <YAxis />
        <Tooltip labelFormatter={formatTime} />
        <Legend />
        {Array.isArray(yKeys) ? (
          yKeys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={colors[i] || "#3B82F6"} />
          ))
        ) : (
          <Bar dataKey={yKey} fill={colors[0] || "#3B82F6"} />
        )}
      </BarChart>
    );
  }

  return (
    <LineChart {...common}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" tickFormatter={formatTime} minTickGap={16} />
      <YAxis />
      <Tooltip labelFormatter={formatTime} />
      <Legend />
      {Array.isArray(yKeys) ? (
        yKeys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[i] || "#3B82F6"}
            strokeWidth={2}
            dot={false}
          />
        ))
      ) : (
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={colors[0] || "#3B82F6"}
          strokeWidth={2}
          dot={false}
        />
      )}
    </LineChart>
  );
}

export default function ScrollChart({
  data,
  yKey,
  yKeys,
  title,
  type = "line",
  colors = ["#3B82F6"],
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="h-[340px] min-w-[900px]">
          <ResponsiveContainer width="100%" height="100%">
            <BaseChart
              data={data}
              yKey={yKey}
              yKeys={yKeys}
              type={type}
              colors={colors}
            />
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}