import React from "react";
import ReactAnimatedWeather from "react-animated-weather";

const WeatherCard = ({ weather, unit, toggleUnit, forecast }) => {
  const convertTemp = (tempC) => (unit === "C" ? tempC : (tempC * 9) / 5 + 32);

 // 🌦️ Select correct weather icon based on code + temperature
const getIcon = (code, temp) => {
  // Extremely cold → show snow
  if (temp <= 3) return "SNOW";
  
  // Clear sky
  if (code === 0) return temp > 30 ? "CLEAR_DAY" : "CLEAR_DAY";

  // Partly cloudy
  if (code >= 1 && code <= 3) return temp > 25 ? "PARTLY_CLOUDY_DAY" : "PARTLY_CLOUDY_NIGHT";

  // Fog / Mist
  if (code >= 45 && code <= 48) return "FOG";

  // Drizzle / Light rain
  if (code >= 51 && code <= 67) return temp < 15 ? "SLEET" : "RAIN";

  // Snow / Cold rain only if temp < 5°C
  if (code >= 71 && code <= 86) return temp < 5 ? "SNOW" : "RAIN";

  // Thunderstorm
  if (code >= 95 && code <= 99) return "THUNDER_SHOWERS";

  // Default fallback
  return "CLOUDY";
};


  const feelsLike = weather.temperature + weather.windspeed / 10;
  const iconDefaults = {
    icon: getIcon(weather.weathercode, weather.temperature),
    color: "#0077ff",
    size: 100,
    animate: true,
  };

  // 🕓 Get City Local Time
  const getCityTime = (timezone) => {
    try {
      return new Date().toLocaleString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const cityTime = getCityTime(weather.timezone);

  // 🌤 Smarter weather tip based on tomorrow’s code & temp
  let nextPrediction = "";
  if (forecast && forecast.weathercode && forecast.weathercode.length > 1) {
    const nextCode = forecast.weathercode[1];
    const nextTemp = forecast.temperature_2m_max ? forecast.temperature_2m_max[1] : weather.temperature;

    if (nextCode === 0) {
      if (nextTemp > 35) nextPrediction = "☀️ Tomorrow will be scorching hot! Stay hydrated and avoid direct sunlight.";
      else if (nextTemp >= 25) nextPrediction = "🌞 A bright and warm sunny day ahead — perfect for outdoor plans!";
      else nextPrediction = "🌤️ Clear and pleasant day tomorrow. Great weather for a morning walk!";
    } 
    else if (nextCode >= 1 && nextCode <= 3) {
      if (nextTemp <= 15) nextPrediction = "🌤️ Partly cloudy with cool breeze — a light jacket might help.";
      else nextPrediction = "🌥️ A mix of clouds and sunshine expected tomorrow.";
    } 
    else if (nextCode >= 45 && nextCode <= 48) {
      nextPrediction = "🌫️ Foggy conditions likely. Drive carefully and keep headlights on!";
    } 
    else if (nextCode >= 51 && nextCode <= 67) {
      if (nextTemp < 15) nextPrediction = "🌧️ Cold rain showers expected — dress warmly and carry an umbrella.";
      else nextPrediction = "🌦️ Intermittent rain tomorrow. Keep your umbrella handy!";
    } 
    else if (nextCode >= 71 && nextCode <= 86) {
      nextPrediction = "❄️ Snowy or freezing conditions ahead — bundle up and stay warm!";
    } 
    else if (nextCode >= 95 && nextCode <= 99) {
      nextPrediction = "⛈️ Thunderstorms expected — stay indoors and unplug electronics!";
    } 
    else {
      nextPrediction = "☁️ Mild weather tomorrow with some clouds around.";
    }
  }

  return (
    <div className="weather-card fade-in">
      <h2 className="city-name">{weather.city}</h2>

      <div className="main-weather">
        <ReactAnimatedWeather
          icon={iconDefaults.icon}
          color={iconDefaults.color}
          size={iconDefaults.size}
          animate={iconDefaults.animate}
        />
        <h1 className="temp">
          {convertTemp(weather.temperature).toFixed(1)}°{unit}
        </h1>
      </div>

      <div className="extra-info">
        <div className="info-box">
          <p>💨 Wind: {weather.windspeed} km/h</p>
          <p>🧭 Direction: {weather.winddirection}°</p>
        </div>
        <div className="info-box">
          <p>🌡️ Feels Like: {convertTemp(feelsLike).toFixed(1)}°{unit}</p>
          <p>🕓 City Time: {cityTime}</p>
        </div>
      </div>

      {nextPrediction && (
        <div className="future-prediction">
          <p>{nextPrediction}</p>
        </div>
      )}

      <button className="unit-toggle" onClick={toggleUnit}>
        Switch to °{unit === "C" ? "F" : "C"}
      </button>
    </div>
  );
};

export default WeatherCard;
