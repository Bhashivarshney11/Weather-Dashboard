import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkBase =
    "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200";
  const active = "bg-white text-blue-700 shadow";
  const inactive = "text-white/90 hover:bg-white/15";

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 to-sky-800 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">🌤️ Weather Dashboard</h1>
          <p className="text-xs text-white/80 sm:text-sm">
            Current day and 2-year historical analysis
          </p>
        </div>

        <nav className="flex flex-wrap gap-2">
          <Link
            to="/current"
            className={`${linkBase} ${
              location.pathname === "/current" || location.pathname === "/"
                ? active
                : inactive
            }`}
          >
            Current Date
          </Link>
          <Link
            to="/history-range"
            className={`${linkBase} ${
              location.pathname === "/history-range" ? active : inactive
            }`}
          >
            2-Year History
          </Link>
        </nav>
      </div>
    </header>
  );
}