import React, { useEffect, useState } from "react";
import "./App.css";
import "./components/HourlyForecast.css";

import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggle";
import HourlyForecast from "./components/HourlyForecast";
import { motion, AnimatePresence } from "framer-motion";
import ReactAnimatedWeather from "react-animated-weather";
const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [unit, setUnit] = useState("C");
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [backgroundClass, setBackgroundClass] = useState("clear");
  const [locationDenied, setLocationDenied] = useState(false);
  const [weatherTip, setWeatherTip] = useState("");

  // ✅ Fetch weather using coordinates
  const fetchWeather = async (lat, lon, cityName = "Your Location") => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
      );

      if (!res.ok) throw new Error("Weather data not found");
      const data = await res.json();

      const current = data.current_weather;

      setWeather({
        ...current,
        city: cityName,
        timezone: data.timezone,
      });

      // ✅ Save hourly and daily forecast data safely
      setForecast({
        daily: data.daily || {},
        hourly: {
          time: data?.hourly?.time || [],
          temperature: data?.hourly?.temperature_2m || [],
          code: data?.hourly?.weathercode || [],
        },
      });

      updateBackground(current.weathercode, current.temperature);
      updateTip(current.weathercode);

      if (cityName && cityName !== "Your Location") {
        const updated = [cityName, ...history.filter((c) => c !== cityName)].slice(0, 5);
        setHistory(updated);
        localStorage.setItem("history", JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Failed to fetch weather:", e);
      alert("Failed to fetch weather data. Try again.");
    }
  };

  // ✅ Dynamic tips
  const updateTip = (code) => {
    if (code === 0) setWeatherTip("☀️ It's sunny! Stay hydrated and wear sunglasses!");
    else if (code >= 1 && code <= 3) setWeatherTip("🌤 Partly cloudy — good day for a walk!");
    else if (code >= 45 && code <= 48) setWeatherTip("🌫 Foggy — drive carefully!");
    else if (code >= 51 && code <= 67) setWeatherTip("🌧 Rain ahead — don’t forget your umbrella!");
    else if (code >= 71 && code <= 86) setWeatherTip("❄️ Cold & snowy — wear warm clothes!");
    else if (code >= 95) setWeatherTip("⛈ Thunderstorms likely — stay safe indoors!");
    else setWeatherTip("🌍 Calm weather — enjoy your day!");
  };

  // ✅ Get coordinates by city name
  const getCoordinates = async (cityName) => {
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`
      );
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const { latitude, longitude, name } = data.results[0];
        fetchWeather(latitude, longitude, name);
      } else {
        alert("City not found!");
      }
    } catch {
      alert("Error fetching location data. Please try again.");
    }
  };

  // ✅ Get user's live location weather
  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeather(latitude, longitude, "Your Location");
        setLocationDenied(false);
      },
      (err) => {
        if (err.code === 1) setLocationDenied(true);
        else alert("Unable to get your location. Please try again.");
      }
    );
  };

  // ✅ Automatically get location on first load
  useEffect(() => {
    getLocationWeather();
  }, []);

  // ✅ Update background by condition
  const updateBackground = (code, temp) => {
    if (temp <= 5) setBackgroundClass("snowy");
    else if (code === 0) setBackgroundClass("sunny");
    else if (code >= 1 && code <= 3) setBackgroundClass("cloudy");
    else if (code >= 45 && code <= 48) setBackgroundClass("foggy");
    else if (code >= 51 && code <= 67) setBackgroundClass("rainy");
    else if (code >= 71 && code <= 86 && temp < 5) setBackgroundClass("snowy");
    else if (code >= 95 && code <= 99) setBackgroundClass("stormy");
    else setBackgroundClass("default");
  };

  const toggleUnit = () => setUnit(unit === "C" ? "F" : "C");

  return (
    <div className={`app ${isDarkMode ? "dark" : ""} ${backgroundClass}`}>
      <div className="container">
       <motion.h1
  className="title flex items-center justify-center gap-3 text-4xl font-bold tracking-wide"
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  {/* Animated Weather Icon with smooth motion */}
  <motion.div
    animate={{
      rotate: [0, 15, -15, 0], // small side tilt effect
      y: [0, -3, 0], // soft floating bounce
    }}
    transition={{
      repeat: Infinity,
      repeatType: "reverse",
      duration: 3,
      ease: "easeInOut",
    }}
    className="flex items-center"
  >
    <ReactAnimatedWeather
      icon="CLEAR_DAY"
      color="#f7da3bff"
      size={50}
      animate={true}
    />
  </motion.div>

  Weather Now
</motion.h1>


        <ThemeToggle isDark={isDarkMode} setIsDark={setIsDarkMode} />

        {/* 📍 Use My Location */}
        <div className="location-btn-container">
          <motion.button
            className="my-location-btn"
            onClick={getLocationWeather}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📍 Use My Location
          </motion.button>
        </div>

        {/* 🔍 Search City */}
        <SearchBar city={city} setCity={setCity} onSearch={getCoordinates} />

        {/* ⚠️ Location Warning */}
        {locationDenied && (
          <div className="location-warning">
            <p>📍 Location access is blocked. Enable it in your browser settings.</p>
            <p className="small-tip">
              👉 Go to <b>Settings → Site Permissions → Location</b> → <b>Allow</b>.
            </p>
            <button onClick={getLocationWeather}>🔄 Try Again</button>
          </div>
        )}

        {/* 🕘 Recent Searches */}
        {history.length > 0 && (
          <div className="history">
            <AnimatePresence>
              {history.map((c, i) => (
                <motion.button
                  key={c}
                  onClick={() => getCoordinates(c)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}
                  className="history-btn"
                >
                  {c}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* 🌡 Weather Info */}
        {weather && (
          <>
            <WeatherCard weather={weather} unit={unit} toggleUnit={toggleUnit} />

               <motion.div
              className="weather-tip"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p>{weatherTip}</p>
            </motion.div>

            {/* 🕒 Hourly Forecast Scrollable Section */}
            {forecast?.hourly && <HourlyForecast hourly={forecast.hourly} unit={unit} />}

            {/* 🌤 Weather Tip */}
         
          </>
        )}

        {/* 🗓 Daily Forecast Section */}
        {forecast?.daily && <Forecast forecast={forecast.daily} unit={unit} />}
      </div>

      {/* 💙 Footer */}
      <footer className="footer">
        <div className="footer-content">
          <i className="fas fa-handshake footer-icon"></i>
          <p>
            Developed By <span className="footer-name">Bharath</span>{" "}
            <span className="heart">💙</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
