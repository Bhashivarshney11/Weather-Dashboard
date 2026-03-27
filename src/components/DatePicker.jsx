export default function DatePicker({ date, onChange }) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Select Date
      </label>
      <input
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
        max={today}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      <p className="mt-2 text-xs text-slate-500">
        Choose today or any past date.
      </p>
    </div>
  );
}