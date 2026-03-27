import { useState } from "react";
import { getLocation,  getHistoricalRange } from "../services/weatherApi";
import { buildRangeData, formatHourToTime } from "../utils/rangeFormatter";
import DateRangePicker from "../components/DateRangePicker";
import RangeChart from "../components/RangeChart";

export default function HistoryRange() {
  const [range, setRange] = useState({ start: "", end: "" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setError("");

    if (!range.start || !range.end) {
      setError("Select start and end dates.");
      return;
    }

    const diffDays =
      (new Date(range.end).getTime() - new Date(range.start).getTime()) /
      (1000 * 60 * 60 * 24);

    if (diffDays < 0) {
      setError("End date must be after start date.");
      return;
    }

    if (diffDays > 730) {
      setError("Max range is 2 years.");
      return;
    }

    try {
      setLoading(true);
      const { lat, lon } = await getLocation();
      const res = await getWeatherRange(lat, lon, range.start, range.end);
      setData(buildRangeData(res.forecast, res.air));
    } catch (err) {
      setData([]);
      setError(
        err?.response?.data?.reason ||
          err?.message ||
          "Failed to load historical data."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          2-Year Weather Analysis
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Pick a range and the charts will appear below. Scroll horizontally and
          use the brush to zoom.
        </p>
      </div>

      <div className="mb-5 space-y-4">
        <DateRangePicker range={range} onChange={setRange} />

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Fetch"}
          </button>

          <span className="text-xs text-slate-500">
            Best results come from shorter date windows when the range is very large.
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {data.length > 0 ? (
        <div className="space-y-6">
          <RangeChart
            title="Temperature (Mean / Max / Min)"
            data={data}
            lines={[
              { key: "tempMean", color: "#10B981" },
              { key: "tempMax", color: "#EF4444" },
              { key: "tempMin", color: "#3B82F6" },
            ]}
          />

          <RangeChart
            title="Sunrise & Sunset (IST)"
            data={data}
            lines={[
              { key: "sunrise", color: "#F59E0B" },
              { key: "sunset", color: "#6366F1" },
            ]}
            yTickFormatter={formatHourToTime}
            tooltipFormatter={(value) => formatHourToTime(value)}
          />

          <RangeChart
            title="Precipitation"
            data={data}
            type="bar"
            lines={[{ key: "precipitation", color: "#06B6D4" }]}
          />

          <RangeChart
            title="Max Wind Speed & Dominant Wind Direction"
            data={data}
            lines={[
              { key: "windSpeed", color: "#EF4444" },
              { key: "windDir", color: "#8B5CF6" },
            ]}
          />

          <RangeChart
            title="PM10 & PM2.5"
            data={data}
            lines={[
              { key: "pm10", color: "#F97316" },
              { key: "pm25", color: "#EC4899" },
            ]}
          />
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
            Pick a range and click Fetch.
          </div>
        )
      )}
    </main>
  );
}