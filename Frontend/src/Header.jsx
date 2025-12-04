import React from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "./DarkModeContext";

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="w-full backdrop-blur-2xl bg-[#0D1931]/80 border-b border-blue-500/20 shadow-2xl sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-2">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/icon2.png"
            className="h-12 object-cover"
            alt="veda logo"
          />
          <span className="text-lg font-bold tracking-tight text-white">
            veda
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-base font-medium text-white">
          <button
            onClick={toggleDarkMode}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/10 border border-blue-500/30 text-gray-300 hover:bg-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover:scale-110 shadow-lg text-sm"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
          <Link
            to="/"
            className="hover:text-blue-400 transition-all duration-300 hover:scale-105"
          >
            Home
          </Link>
          <Link
            to="/chat"
            className="hover:text-blue-400 transition-all duration-300 hover:scale-105"
          >
            Chat
          </Link>
          <Link
            to="/yoga"
            className="hover:text-blue-400 transition-all duration-300 hover:scale-105"
          >
            Yoga
          </Link>
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <i className="fas fa-user text-gray-300 text-sm"></i>
          </div>
        </nav>
      </div>
    </header>
  );
}
