import React, { useState } from "react";

// Map weather conditions to emojis/icons
const weatherIcons = {
  "clear sky": "☀️",
  "few clouds": "🌤️",
  "scattered clouds": "⛅",
  "broken clouds": "☁️",
  "overcast clouds": "☁️",
  "shower rain": "🌦️",
  "rain": "🌧️",
  "thunderstorm": "⛈️",
  "snow": "❄️",
  "mist": "🌫️"
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);

  const apiKey = import.meta.env.VITE_APP_ID;

  const fetchWeather = async () => {
    if (!city) return;
    try {
      // Fetch weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      // Fetch air quality
      const { coord } = weatherData; // { lat, lon }
      const airRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`
      );
      const airData = await airRes.json();
      setAirQuality(airData.list[0]);
    } catch (err) {
      console.error(err);
    }
  };

  // Styles
  const cardStyle = {
    background: "linear-gradient(to bottom, #6dd5fa, #ffffff)",
    maxWidth: "400px",
    margin: "20px auto",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "60%",
    marginRight: "10px",
    fontSize: "16px",
  };

  const buttonStyle = {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2196F3",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  };

  const infoStyle = {
    margin: "8px 0",
    fontSize: "16px",
    fontWeight: "500",
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        🌤️ Weather App
      </h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={inputStyle}
      />
      <button onClick={fetchWeather} style={buttonStyle}>
        Get Weather
      </button>

      {weather && weather.main && (
        <div style={cardStyle}>
          <h2>
            {weather.name}{" "}
            {weatherIcons[weather.weather[0].description] || "🌡️"}
          </h2>
          <p style={infoStyle}>
            <strong>Temperature:</strong> {weather.main.temp}°C
          </p>
          <p style={infoStyle}>
            <strong>Weather:</strong> {weather.weather[0].description}
          </p>
          <p style={infoStyle}>
            <strong>Humidity:</strong> {weather.main.humidity}%
          </p>
          <p style={infoStyle}>
            <strong>Wind Speed:</strong> {weather.wind.speed} m/s
          </p>
          <p style={infoStyle}>
            <strong>Pressure:</strong> {weather.main.pressure} hPa
          </p>
          {weather.rain && (
            <p style={infoStyle}>
              <strong>Rain:</strong> {weather.rain["1h"] || 0} mm
            </p>
          )}
          {weather.snow && (
            <p style={infoStyle}>
              <strong>Snow:</strong> {weather.snow["1h"] || 0} mm
            </p>
          )}
          {airQuality && (
            <p style={infoStyle}>
              <strong>Air Quality Index (AQI):</strong> {airQuality.main.aqi} (
              {["Good", "Fair", "Moderate", "Poor", "Very Poor"][
                airQuality.main.aqi - 1
              ]}
              )
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
