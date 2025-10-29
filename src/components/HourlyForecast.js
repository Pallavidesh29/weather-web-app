// 📁 src/components/HourlyForecast.js
import React from "react";
import ReactAnimatedWeather from "react-animated-weather";
import { WiSunrise, WiDaySunny, WiSunset, WiNightClear } from "react-icons/wi";
import "./HourlyForecast.css";

const HourlyForecast = ({ hourly, unit }) => {
  if (!hourly || !hourly.time || !hourly.temperature) return null;

  const convertTemp = (tempC) => (unit === "C" ? tempC : (tempC * 9) / 5 + 32);

 const getIcon = (code, tempC) => {
  // Do NOT re-convert temp based on unit — always use Celsius from API
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


   const getDescription = (code) => {
    if (code === 0) return "Clear Sky";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Foggy / Low Visibility";
    if (code >= 51 && code <= 67) return "Light Rain / Drizzle";
    if (code >= 71 && code <= 86) return "Snowy / Freezing";
    if (code >= 95 && code <= 99) return "Thunderstorms / Heavy Rain";
    return "Cloudy";
  };


  // 🌤 Determine time of day icon
  const getTimeOfDayIcon = (hour) => {
    if (hour >= 5 && hour < 12)
      return <WiSunrise className="time-icon morning" title="Morning" />;
    if (hour >= 12 && hour < 17)
      return <WiDaySunny className="time-icon afternoon" title="Afternoon" />;
    if (hour >= 17 && hour < 20)
      return <WiSunset className="time-icon evening" title="Evening" />;
    return <WiNightClear className="time-icon night" title="Night" />;
  };

  // Get the current local hour to highlight
  const currentHour = new Date().getHours();

  return (
    <div className="hourly-section fade-in">
      <h2 className="forecast-title">🕓 Hourly Weather Update</h2>

      <div className="hourly-scroll">
        {hourly.time.slice(0, 24).map((time, i) => {
          const temp = hourly.temperature[i];
          const code = hourly.code[i];
          const icon = getIcon(code, temp); // pass temp in Celsius only

          const desc = getDescription(code);

          const date = new Date(time);
          const hour = date.getHours();
          const displayHour = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true,
          });

          // Check if this card is the current hour
          const isCurrent = hour === currentHour;

          return (
            <div
              className={`hour-card ${isCurrent ? "current-hour" : ""}`}
              key={i}
            >
              <div className="time-of-day-icon">{getTimeOfDayIcon(hour)}</div>

              <h4>{isCurrent ? "Now" : displayHour}</h4>

              <ReactAnimatedWeather
                icon={icon}
                color={isCurrent ? "#ff7f50" : "#0077ff"}
                size={55}
                animate={true}
              />
              <p className="temp">
                {convertTemp(temp).toFixed(1)}°{unit}
              </p>
              <p className="desc">{desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
