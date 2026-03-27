import { useEffect, useState } from "react";
import { getLocation, getWeatherByDate } from "../services/weatherApi";
import { buildHourlyData, buildCurrentCards } from "../utils/dataFormatter";
import DatePicker from "../components/DatePicker";
import WeatherCard from "../components/WeatherCard";
import ScrollChart from "../components/ScrollChart";

const today = new Date().toISOString().split("T")[0];

export default function Current() {
  const [date, setDate] = useState(today);
  const [data, setData] = useState(null);
  const [unit, setUnit] = useState("C");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData(today);
  }, []);

  const loadData = async (selectedDate) => {
    try {
      setError("");
      const { lat, lon } = await getLocation();
      const res = await getWeatherByDate(lat, lon, selectedDate);

      setData({
        hourly: buildHourlyData(res.forecast, res.air),
        current: buildCurrentCards(res.forecast, res.air, selectedDate)
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load data. Allow location or check API.");
    }
  };

  const convertTemp = (t) =>
    t == null ? "--" : unit === "C" ? t : (t * 9) / 5 + 32;

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data) return <p>Loading...</p>;

  const c = data.current;

  return (
    <div style={{ padding: 20 }}>
      <h2>Current Weather</h2>

      <DatePicker
        date={date}
        onChange={(d) => {
          setDate(d);
          loadData(d);
        }}
      />

      <button onClick={() => setUnit(unit === "C" ? "F" : "C")}>
        Switch to °{unit === "C" ? "F" : "C"}
      </button>

      <div className="card-grid">
        <WeatherCard label="Min Temp" value={convertTemp(c.tempMin)} unit={`°${unit}`} />
        <WeatherCard label="Max Temp" value={convertTemp(c.tempMax)} unit={`°${unit}`} />
        <WeatherCard label="Current Temp" value={convertTemp(c.tempCurrent)} unit={`°${unit}`} />
        <WeatherCard label="Humidity" value={c.humidity} unit="%" />
        <WeatherCard label="UV Index" value={c.uvIndex} />
        <WeatherCard label="AQI" value={c.aqi} />
      </div>

      <ScrollChart
        data={data.hourly.map(d => ({
          ...d,
          temperature: convertTemp(d.temperature)
        }))}
        yKey="temperature"
        title={`Temperature (°${unit})`}
      />

      <ScrollChart data={data.hourly} yKey="humidity" title="Humidity" />
      <ScrollChart data={data.hourly} yKey="precipitation" title="Precipitation" type="bar" />
      <ScrollChart data={data.hourly} yKey="visibility" title="Visibility" />
      <ScrollChart data={data.hourly} yKey="wind" title="Wind Speed" />
      <ScrollChart data={data.hourly} yKeys={["pm10", "pm25"]} title="PM10 & PM2.5" />
    </div>
  );
}