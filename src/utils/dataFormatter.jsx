export const buildHourlyData = (forecast, air) => {
  const times = forecast.hourly?.time || [];

  return times.map((time, i) => ({
    time: time.slice(11, 16),
    temperature: forecast.hourly.temperature_2m?.[i],
    humidity: forecast.hourly.relative_humidity_2m?.[i],
    precipitation: forecast.hourly.precipitation?.[i],
    visibility: forecast.hourly.visibility?.[i],
    wind: forecast.hourly.windspeed_10m?.[i],
    pm10: air.hourly?.pm10?.[i],
    pm25: air.hourly?.pm2_5?.[i]
  }));
};

export const buildCurrentCards = (forecast, air, date) => {
  const d = forecast.daily;
  const idx = d.time.indexOf(date);
  const current = forecast.current_weather;

  return {
    tempMin: d.temperature_2m_min?.[idx],
    tempMax: d.temperature_2m_max?.[idx],
    tempCurrent: current?.temperature,
    precipitation: d.precipitation_sum?.[idx],
    sunrise: d.sunrise?.[idx]?.slice(11, 16),
    sunset: d.sunset?.[idx]?.slice(11, 16),
    maxWind: d.wind_speed_10m_max?.[idx],
    humidity: d.relative_humidity_2m_max?.[idx],
    uvIndex: d.uv_index_max?.[idx],
    precipProbMax: d.precipitation_probability_max?.[idx],

    // Air Quality
    aqi: air.current?.european_aqi ?? air.hourly?.european_aqi?.[0],
    pm10: air.current?.pm10 ?? air.hourly?.pm10?.[0],
    pm25: air.current?.pm2_5 ?? air.hourly?.pm2_5?.[0],
    co: air.current?.carbon_monoxide ?? air.hourly?.carbon_monoxide?.[0],
    co2: air.current?.carbon_dioxide ?? air.hourly?.carbon_dioxide?.[0],
    no2: air.current?.nitrogen_dioxide ?? air.hourly?.nitrogen_dioxide?.[0],
    so2: air.current?.sulphur_dioxide ?? air.hourly?.sulphur_dioxide?.[0]
  };
};