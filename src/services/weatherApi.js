import axios from "axios";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
const AIR_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

export const getLocation = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      reject
    );
  });

const todayStr = () => new Date().toISOString().slice(0, 10);

export const getWeatherByDate = async (lat, lon, date) => {
  const isToday = date === todayStr();

  const weatherParams = {
    latitude: lat,
    longitude: lon,
    timezone: "Asia/Kolkata",
    hourly:
      "temperature_2m,relative_humidity_2m,precipitation,visibility,windspeed_10m",
    daily:
      "temperature_2m_min,temperature_2m_max,relative_humidity_2m_max,precipitation_sum,sunrise,sunset,wind_speed_10m_max,uv_index_max,precipitation_probability_max",
    start_date: date,
    end_date: date
  };

  if (isToday) weatherParams.current_weather = true;

  const airParams = {
    latitude: lat,
    longitude: lon,
    timezone: "Asia/Kolkata",
    hourly:
      "pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,european_aqi",
    current:
      "pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,european_aqi",
    start_date: date,
    end_date: date
  };

  const [weatherRes, airRes] = await Promise.all([
    axios.get(isToday ? FORECAST_URL : ARCHIVE_URL, {
      params: weatherParams
    }),
    axios.get(AIR_URL, { params: airParams })
  ]);

  return {
    forecast: weatherRes.data,
    air: airRes.data
  };
};

/* ✅ THIS WAS MISSING */
export const getWeatherRange = async (lat, lon, start, end) => {
  const [weatherRes, airRes] = await Promise.all([
    axios.get(ARCHIVE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        timezone: "Asia/Kolkata",
        timeformat: "iso8601",
        start_date: start,
        end_date: end,
        daily:
          "temperature_2m_mean,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant"
      }
    }),
    axios.get(AIR_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        timezone: "Asia/Kolkata",
        timeformat: "iso8601",
        start_date: start,
        end_date: end,
        hourly: "pm10,pm2_5"
      }
    })
  ]);

  return { forecast: weatherRes.data, air: airRes.data };
};