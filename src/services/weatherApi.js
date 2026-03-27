import axios from "axios";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
const AIR_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

const api = axios.create({
  timeout: 15000
});

export const getLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  });

const todayStr = () => new Date().toISOString().slice(0, 10);

export const getCurrentWeather = async (lat, lon, date = null) => {
  const params = {
    latitude: lat,
    longitude: lon,
    hourly:
      "temperature_2m,relative_humidity_2m,precipitation,visibility,windspeed_10m",
    daily:
      "temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max,uv_index_max,relative_humidity_2m_max,precipitation_probability_max",
    current_weather: true,
    timezone: "Asia/Kolkata"
  };

  if (date) {
    params.start_date = date;
    params.end_date = date;
  }

  const res = await api.get(FORECAST_URL, { params });
  return res.data;
};

export const getAirQualityData = async (lat, lon, date = null) => {
  const params = {
    latitude: lat,
    longitude: lon,
    hourly:
      "pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,european_aqi",
    current:
      "pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,european_aqi",
    timezone: "Asia/Kolkata"
  };

  if (date) {
    params.start_date = date;
    params.end_date = date;
  }

  const res = await api.get(AIR_URL, { params });
  return res.data;
};

export const getHistoricalRange = async (lat, lon, start, end) => {
  const res = await api.get(ARCHIVE_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      start_date: start,
      end_date: end,
      daily:
        "temperature_2m_mean,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant",
      timezone: "Asia/Kolkata"
    }
  });

  return res.data;
};