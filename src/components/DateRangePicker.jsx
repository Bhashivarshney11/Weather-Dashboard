export default function DateRangePicker({ range, onChange }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-800">
          Date Range
        </h3>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          Max 2 years
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Start Date
          </label>
          <input
            type="date"
            value={range.start}
            onChange={(e) => onChange({ ...range, start: e.target.value })}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            End Date
          </label>
          <input
            type="date"
            value={range.end}
            onChange={(e) => onChange({ ...range, end: e.target.value })}
            min={range.start}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
    </div>
  );
}