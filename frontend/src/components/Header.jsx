import React, { useState, useRef } from "react";
import ThemeToggleButton from "./ui/theme-toggle-button";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

const Header = () => {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const searchRef = useRef(null);

  const handleSearchFocus = () => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-900 shadow-md">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <img
          src="/logo-2-removebg-preview.png"
          alt="Watch-logo"
          className="w-14 h-auto dark:invert"
        />
        <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-900 dark:text-white">
          Timeless
          <span
            style={{ fontFamily: "'Great Vibes', cursive" }}
            className="ml-1.5"
          >
            Elegance
          </span>
        </h2>
      </div>

      {/* Navbar Links (Hidden on small screens) */}
      <div className="hidden md:flex items-center justify-center gap-10 font-bold">
        <Link to={"/home"}>Home</Link>
        <Link to={"/about-us"}>About Us</Link>
        <Link to={"/product"}>Products</Link>
        <Link to={"/user/login"}>LogIn</Link>
        <Link to={"/user/register"}>Sign Up</Link>
      </div>

      {/* Right Section: Search + Toggle + Hamburger */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="flex items-center relative bg-gray-50 dark:bg-gray-700 shadow-lg rounded-lg">
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder="Search"
            className="font-semibold border border-gray-300 dark:border-gray-600
                       bg-transparent text-gray-900 dark:text-gray-100
                       px-3 py-2 rounded-lg w-40 sm:w-48
                       placeholder:text-sm focus:outline-none focus:ring-1
                       focus:ring-gray-500 pr-10"
          />
          <button type="button" onClick={handleSearchFocus}>
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        {/* Theme Toggle */}
        <ThemeToggleButton />

        {/* Hamburger Menu (Visible on small screens only) */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
        </button>
      </div>

      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="fixed top-0 left-0 w-64 h-full bg-gray-100 dark:bg-gray-900 shadow-lg p-6 flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="self-end mb-6"
            >
              <X className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </button>

            {/* Sidebar Links */}
            <nav className="flex flex-col gap-6 font-bold text-lg">
              <Link to={"/home"} onClick={() => setSidebarOpen(false)}>
                Home
              </Link>
              <Link to={"/about-us"} onClick={() => setSidebarOpen(false)}>
                About Us
              </Link>
              <Link to={"/product"} onClick={() => setSidebarOpen(false)}>
                Products
              </Link>
              <Link to={"/user/login"} onClick={() => setSidebarOpen(false)}>
                LogIn
              </Link>
              <Link to={"/user/register"} onClick={() => setSidebarOpen(false)}>
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
