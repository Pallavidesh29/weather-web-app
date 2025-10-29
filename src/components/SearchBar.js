import React, { useState } from "react";

const SearchBar = ({ city, setCity, onSearch }) => {
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length > 2) {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${value}`
      );
      const data = await res.json();
      if (data.results) {
        setSuggestions(data.results.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (cityName) => {
    setCity(cityName);
    onSearch(cityName);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(city);
      setSuggestions([]);
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          value={city}
          placeholder="Search city..."
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => onSearch(city)}>🔍</button>
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => handleSelect(s.name)}>
              <span className="city-name">{s.name}</span>
              {s.admin1 && <span className="region">, {s.admin1}</span>}
              <span className="country"> ({s.country_code})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
