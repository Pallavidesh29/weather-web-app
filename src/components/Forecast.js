import React from "react";
import ReactAnimatedWeather from "react-animated-weather";

const Forecast = ({ forecast, unit }) => {
  const convertTemp = (tempC) => (unit === "C" ? tempC : (tempC * 9) / 5 + 32);

const getIcon = (code, temp, unit) => {
  // Convert Fahrenheit to Celsius internally for logic consistency
  const tempC = unit === "F" ? ((temp - 32) * 5) / 9 : temp;

  // Safety check: fix unrealistic snow at high temps
  if (code >= 71 && code <= 86 && tempC > 8) return "RAIN";

  if (tempC <= 3) return "SNOW";
  if (code === 0) return "CLEAR_DAY";
  if (code >= 1 && code <= 3) return "PARTLY_CLOUDY_DAY";
  if (code >= 45 && code <= 48) return "FOG";
  if (code >= 51 && code <= 67) return tempC < 10 ? "SLEET" : "RAIN";
  if (code >= 71 && code <= 86) return "SNOW";
  if (code >= 95 && code <= 99) return "THUNDER_SHOWERS";
  return "CLOUDY";
};

const getDescription = (code, temp, unit) => {
  // Convert Fahrenheit to Celsius for same reasoning
  const tempC = unit === "F" ? ((temp - 32) * 5) / 9 : temp;

  if (code >= 71 && code <= 86 && tempC > 8) return "Rainy (Warm)";
  if (code === 0) return tempC > 30 ? "Hot & Clear" : "Clear Sky";
  if (code >= 1 && code <= 3)
    return tempC > 28 ? "Warm & Partly Cloudy" : "Partly Cloudy";
  if (code >= 45 && code <= 48) return "Foggy / Low Visibility";
  if (code >= 51 && code <= 67) return tempC < 10 ? "Cold Rain" : "Light Rain";
  if (code >= 71 && code <= 86) return "Snowy / Freezing";
  if (code >= 95 && code <= 99) return "Thunderstorms / Heavy Rain";
  return "Cloudy";
};

  return (
    <div className="forecast fade-in">
      <h2 className="forecast-title">🌦 5-Day Weather Overview</h2>
      <div className="forecast-list">
        {forecast.time.slice(0, 5).map((date, i) => {
          const tempMax = forecast.temperature_2m_max[i];
          const tempMin = forecast.temperature_2m_min[i];
          const code = forecast.weathercode[i];
          const icon = getIcon(code, tempMax);
          const desc = getDescription(code);
          const day = new Date(date).toLocaleDateString("en-US", { weekday: "short" });

          return (
            <div className="forecast-item lift" key={i}>
              <h3>{day}</h3>
              <ReactAnimatedWeather icon={icon} color="#0077ff" size={60} animate={true} />
              <p className="desc">{desc}</p>
              <p className="temps">
                <b>{convertTemp(tempMax).toFixed(1)}°{unit}</b> / {convertTemp(tempMin).toFixed(1)}°{unit}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default Forecast;
