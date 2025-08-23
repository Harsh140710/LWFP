import React from "react";
import ThemeToggleButton from "./ui/theme-toggle-button";

const Header = () => {
  return (
    <div className="flex items-start justify-between px-10 py-3 bg-gray-100">
      <div className="flex items-center">
        <img
          src="../public//logo-2-removebg-preview.png"
          alt="Watch-logo"
          width={80}
        />
        <h2 className="font-bold text-2xl">
          Timeless<span className="font-light">Elegance</span>
        </h2>
      </div>

      <ThemeToggleButton />
    </div>
  );
};

export default Header;
