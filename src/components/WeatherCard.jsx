export default function WeatherCard({ label, value, unit = "" }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-2xl font-bold text-slate-900">
          {value ?? "--"}
        </span>
        {unit ? <span className="pb-1 text-sm text-slate-500">{unit}</span> : null}
      </div>
    </div>
  );
}