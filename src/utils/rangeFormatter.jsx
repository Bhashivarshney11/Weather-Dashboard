const avg = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const values = arr.filter((v) => v != null && !Number.isNaN(Number(v))).map(Number);
  if (!values.length) return null;
  return values.reduce((s, n) => s + n, 0) / values.length;
};

const toHourValue = (isoString) => {
  if (!isoString || typeof isoString !== "string") return null;
  const h = Number(isoString.slice(11, 13));
  const m = Number(isoString.slice(14, 16));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h + m / 60;
};

export const formatHourToTime = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "--";
  const h = Math.floor(Number(value));
  const m = Math.round((Number(value) - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const buildRangeData = (forecast, air) => {
  const days = forecast?.daily?.time || [];
  const pmGroups = new Map();

  const airTimes = air?.hourly?.time || [];
  airTimes.forEach((ts, i) => {
    const date = ts.slice(0, 10);
    if (!pmGroups.has(date)) {
      pmGroups.set(date, { pm10: [], pm25: [] });
    }

    const group = pmGroups.get(date);
    const pm10 = air?.hourly?.pm10?.[i];
    const pm25 = air?.hourly?.pm2_5?.[i];

    if (pm10 != null) group.pm10.push(Number(pm10));
    if (pm25 != null) group.pm25.push(Number(pm25));
  });

  return days.map((date, i) => ({
    date,
    tempMean: forecast?.daily?.temperature_2m_mean?.[i],
    tempMax: forecast?.daily?.temperature_2m_max?.[i],
    tempMin: forecast?.daily?.temperature_2m_min?.[i],
    sunrise: toHourValue(forecast?.daily?.sunrise?.[i]),
    sunset: toHourValue(forecast?.daily?.sunset?.[i]),
    precipitation: forecast?.daily?.precipitation_sum?.[i],
    windSpeed: forecast?.daily?.wind_speed_10m_max?.[i],
    windDir: forecast?.daily?.wind_direction_10m_dominant?.[i],
    pm10: avg(pmGroups.get(date)?.pm10 || []),
    pm25: avg(pmGroups.get(date)?.pm25 || []),
  }));
};