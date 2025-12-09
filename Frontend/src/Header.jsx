import React from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "./DarkModeContext";

// SVG Icon Components
const MoonIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const UserIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header
      className={`w-full backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-300 ${
        darkMode
          ? "bg-gray-900/30 border-blue-500/20 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          : "bg-white/40 border-blue-300/30 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-3 sm:px-4 md:px-6 py-0 sm:py-0.5 md:py-1">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
          <img
            src="/images/icon2.png"
            className="h-8 sm:h-10 md:h-12 object-cover"
            alt="veda logo"
          />
          <span
            className={`text-sm sm:text-base md:text-lg font-bold tracking-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            veda
          </span>
        </Link>
        <nav
          className={`flex items-center gap-5 sm:gap-7 md:gap-10 text-xs sm:text-sm md:text-base font-medium ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <button
            onClick={toggleDarkMode}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 ${
              darkMode
                ? "bg-blue-500/10 border-blue-500/30 text-gray-300 hover:bg-blue-500/20 hover:border-blue-400/50 shadow-[0_2px_6px_rgba(255,255,255,0.1)]"
                : "bg-blue-100/50 border-blue-400/40 text-gray-700 hover:bg-blue-200/60 hover:border-blue-500/60 shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
            }`}
          >
            {darkMode ? (
              <SunIcon size={16} className="text-yellow-400" />
            ) : (
              <MoonIcon size={16} className="text-gray-700" />
            )}
          </button>
          <Link
            to="/"
            className={`transition-colors duration-300 ${
              darkMode ? "hover:text-blue-400" : "hover:text-blue-600"
            }`}
          >
            Yoga
          </Link>
          <Link
            to="/chat"
            className={`transition-colors duration-300 ${
              darkMode ? "hover:text-blue-400" : "hover:text-blue-600"
            }`}
          >
            Chat
          </Link>
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            }`}
          >
            <UserIcon
              size={16}
              className={darkMode ? "text-gray-300" : "text-gray-700"}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
