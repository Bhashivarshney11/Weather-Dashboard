import { useEffect, useMemo, useState } from "react";
import {
  getLocation,
  getCurrentWeather,
  getAirQualityData
} from "../services/weatherApi";
import DatePicker  from "../components/DatePicker";
import WeatherCard  from "../components/WeatherCard";
import  ScrollChart  from "../components/ScrollChart";

const DEFAULT_COORDS = { lat: 28.67, lon: 77.42 };
const today = new Date().toISOString().split("T")[0];

export default function Current() {
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [selectedDate, setSelectedDate] = useState(today);
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    getLocation()
      .then((pos) => setCoords(pos))
      .catch(() => {
        setGeoError("Location access blocked. Using default location.");
      });
  }, []);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setFetchError("");

      try {
        const weatherResponse = await getCurrentWeather(
          coords.lat,
          coords.lon,
          selectedDate
        );
        const airQualityResponse = await getAirQualityData(
          coords.lat,
          coords.lon,
          selectedDate
        );

        const dailyTime = weatherResponse.daily?.time || [];
        const dailyIndex = dailyTime.indexOf(selectedDate);

        if (dailyIndex !== -1) {
          setWeatherData({
            temperature_2m_max:
              weatherResponse.daily.temperature_2m_max?.[dailyIndex],
            temperature_2m_min:
              weatherResponse.daily.temperature_2m_min?.[dailyIndex],
            precipitation_sum:
              weatherResponse.daily.precipitation_sum?.[dailyIndex],
            wind_speed_10m_max:
              weatherResponse.daily.wind_speed_10m_max?.[dailyIndex],
            relative_humidity_2m_max:
              weatherResponse.daily.relative_humidity_2m_max?.[dailyIndex],
            uv_index_max: weatherResponse.daily.uv_index_max?.[dailyIndex],
            sunrise: weatherResponse.daily.sunrise?.[dailyIndex],
            sunset: weatherResponse.daily.sunset?.[dailyIndex],
            precipitation_probability_max:
              weatherResponse.daily.precipitation_probability_max?.[dailyIndex],
            european_aqi:
              airQualityResponse.current?.european_aqi ??
              airQualityResponse.hourly?.european_aqi?.[0],
            pm10:
              airQualityResponse.current?.pm10 ??
              airQualityResponse.hourly?.pm10?.[0],
            pm25:
              airQualityResponse.current?.pm2_5 ??
              airQualityResponse.hourly?.pm2_5?.[0],
            co:
              airQualityResponse.current?.carbon_monoxide ??
              airQualityResponse.hourly?.carbon_monoxide?.[0],
            co2:
              airQualityResponse.current?.carbon_dioxide ??
              airQualityResponse.hourly?.carbon_dioxide?.[0],
            no2:
              airQualityResponse.current?.nitrogen_dioxide ??
              airQualityResponse.hourly?.nitrogen_dioxide?.[0],
            so2:
              airQualityResponse.current?.sulphur_dioxide ??
              airQualityResponse.hourly?.sulphur_dioxide?.[0]
          });
        } else {
          setFetchError("No daily data found for the selected date.");
        }

        const hourlyTimes = weatherResponse.hourly?.time || [];
        const hourlyDataList = hourlyTimes.map((time, i) => ({
          time: new Date(time).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
          }),
          temperature: weatherResponse.hourly.temperature_2m?.[i],
          humidity: weatherResponse.hourly.relative_humidity_2m?.[i],
          precipitation: weatherResponse.hourly.precipitation?.[i],
          visibility: weatherResponse.hourly.visibility?.[i],
          wind: weatherResponse.hourly.windspeed_10m?.[i],
          pm10: airQualityResponse.hourly?.pm10?.[i],
          pm25: airQualityResponse.hourly?.pm2_5?.[i]
        }));

        setHourlyData(hourlyDataList);
      } catch (error) {
        console.error("Weather fetch error:", error);
        setFetchError(
          error?.response?.data?.reason ||
            error?.message ||
            "Failed to load weather data."
        );
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [selectedDate, coords]);

  const titleDate = useMemo(() => selectedDate, [selectedDate]);

  if (!weatherData && loading) {
    return (
      <div className="p-8 text-center">
        Loading weather data...
      </div>
    );
  }

  if (!weatherData && fetchError) {
    return (
      <div className="p-8 text-center text-red-600">
        {fetchError}
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="p-8 text-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6 min-h-screen">
      {geoError ? (
        <p className="text-sm text-amber-600">{geoError}</p>
      ) : null}

      <DatePicker date={selectedDate} onChange={setSelectedDate} />

      {loading ? (
        <p className="text-sm text-blue-600">Refreshing data for {titleDate}...</p>
      ) : null}

      {fetchError ? (
        <p className="text-sm text-red-600">{fetchError}</p>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WeatherCard
          label="Temperature"
          value={`${weatherData.temperature_2m_max?.toFixed(1)}° / ${weatherData.temperature_2m_min?.toFixed(1)}°C`}
        />
        <WeatherCard
          label="Precipitation"
          value={(weatherData.precipitation_sum || 0).toFixed(1)}
          unit="mm"
        />
        <WeatherCard
          label="Max Wind"
          value={(weatherData.wind_speed_10m_max || 0).toFixed(1)}
          unit="km/h"
        />
        <WeatherCard
          label="Humidity"
          value={`${(weatherData.relative_humidity_2m_max || 0).toFixed(0)}%`}
        />
        <WeatherCard
          label="UV Index"
          value={weatherData.uv_index_max?.toFixed(1) || 0}
        />
        <WeatherCard
          label="Sunrise"
          value={
            weatherData.sunrise
              ? new Date(weatherData.sunrise).toLocaleTimeString("en-IN")
              : "--:--"
          }
        />
        <WeatherCard
          label="Sunset"
          value={
            weatherData.sunset
              ? new Date(weatherData.sunset).toLocaleTimeString("en-IN")
              : "--:--"
          }
        />
        <WeatherCard label="AQI" value={weatherData.european_aqi ?? "--"} />
        <WeatherCard label="PM10" value={weatherData.pm10 ?? "--"} unit="µg/m³" />
        <WeatherCard label="PM2.5" value={weatherData.pm25 ?? "--"} unit="µg/m³" />
        <WeatherCard label="CO" value={weatherData.co ?? "--"} />
        <WeatherCard label="CO2" value={weatherData.co2 ?? "--"} />
        <WeatherCard label="NO2" value={weatherData.no2 ?? "--"} />
        <WeatherCard label="SO2" value={weatherData.so2 ?? "--"} />
        <WeatherCard
          label="Precipitation Probability Max"
          value={weatherData.precipitation_probability_max ?? "--"}
          unit="%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScrollChart
          data={hourlyData}
          yKey="temperature"
          title="Temperature (°C)"
          type="line"
          colors={["#3B82F6"]}
        />
        <ScrollChart
          data={hourlyData}
          yKey="humidity"
          title="Relative Humidity (%)"
          type="line"
          colors={["#10B981"]}
        />
        <ScrollChart
          data={hourlyData}
          yKey="precipitation"
          title="Precipitation"
          type="bar"
          colors={["#EF4444"]}
        />
        <ScrollChart
          data={hourlyData}
          yKey="visibility"
          title="Visibility"
          type="line"
          colors={["#06B6D4"]}
        />
        <ScrollChart
          data={hourlyData}
          yKey="wind"
          title="Wind Speed (10m)"
          type="line"
          colors={["#F59E0B"]}
        />
        <ScrollChart
          data={hourlyData}
          yKeys={["pm10", "pm25"]}
          title="PM10 & PM2.5"
          type="line"
          colors={["#8B5CF6", "#EC4899"]}
        />
      </div>
    </div>
  );
}