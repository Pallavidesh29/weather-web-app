import React from "react";

const ThemeToggle = ({ isDark, setIsDark }) => {
  return (
    <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default ThemeToggle;
