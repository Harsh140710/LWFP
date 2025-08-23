import React from "react";
import ThemeToggleButton from "./ui/theme-toggle-button";

const Header = () => {
  return (
    <header className="flex sm:flex-row items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-900">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <img
          src="/logo-2-removebg-preview.png"
          alt="Watch-logo"
          className="w-16 h-auto dark:invert"
        />
        
        <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-900 dark:text-white">
          Timeless
          <span style={{ fontFamily: "'Great Vibes', cursive" }} className="ml-">Elegance</span>
        </h2>
      </div>

      {/* Toggle */}
      <div className="mt-3 sm:mt-0">
        <ThemeToggleButton />
      </div>
    </header>
  );
};

export default Header;
