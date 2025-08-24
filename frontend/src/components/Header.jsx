import React, { useState, useRef } from "react";
import ThemeToggleButton from "./ui/theme-toggle-button";
import { Link } from "react-router-dom";
import { Book, Home, LogIn, Menu, MenuIcon, Search, Watch } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MenuButton from "@/animation/MenuButton";
import { Separator } from "./ui/separator";

const Header = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [orientation, setOreintation] = useState("vetical");
  const searchRef = useRef(null);

  const items = [
    { title: "Home", url: "/home", icons: Home },
    { title: "About Us", url: "/about-us", icons: Book },
    { title: "Products", url: "/product", icons: Watch },
    { title: "Log In", url: "/user/login", icons: LogIn },
  ];

  const handleSearchFocus = () => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  return (
    <header className="relative top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 py-4 bg-[#F9FAFB] dark:bg-[#0B0B0D] shadow-md">
      {/* Hamburger / Cross Button */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button>
            <MenuButton open={open} />
          </button>
        </SheetTrigger>

        {/* Top Slide Menu */}
        <SheetContent side="top" className="h-screen dark:bg-[#0B0B0D]">
          <SheetHeader>
            <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col md:flex-row relative pl-10">
            {/* Menu Items */}
            <div className="flex flex-col gap-4 w-[200px] shrink-0">
              {items.map((item) => {
                const Icon = item.icons;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    className="group flex items-center gap-3 px-3 py-2 rounded-lg
             transition-all duration-300 hover:text-[#B48E57]
             text-gray-800 dark:text-gray-200 dark:hover:text-[#B48E57] font-medium"
                    onClick={() => setOpen(false)}
                  >
                    <Icon
                      className="w-5 h-5 text-[#111827] dark:text-[#F9FAFB] 
                   group-hover:text-[#B48E57] dark:group-hover:text-[#B48E57]"
                    />
                    {item.title}
                  </Link>
                );
              })}
            </div>

            {/* Vertical Separator */}
            <Separator
              orientation="vertical"
              className="h-full mx-4 bg-gray-600 hidden md:block"
            />

            <div className="hidden md:flex flex-1 px-4">
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Products
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Your product list or any component will show here.
                </p>
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
        <img
          src="/logo-2-removebg-preview.png"
          alt="Watch-logo"
          className="w-12 h-auto dark:invert"
        />
        <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-[#111827] dark:text-[#F9FAFB]">
          Timeless
          <span
            style={{ fontFamily: "'Great Vibes', cursive" }}
            className="ml-1.5 text-[#B48E57]"
          >
            Elegance
          </span>
        </h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative bg-[#F9FAFB] dark:bg-[#0B0B0D] rounded-lg">
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder="Search"
            className="font-semibold border border-[#E5E7EB] dark:border-[#1E293B]
                       bg-transparent text-gray-900 dark:text-gray-100
                       px-3 py-2 rounded-lg w-48
                       placeholder:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1
                       focus:ring-gray-500 pr-10"
          />
          <button type="button" onClick={handleSearchFocus}>
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#] dark:text-gray-300" />
          </button>
        </div>

        {/* Theme Toggle */}
        <ThemeToggleButton />
      </div>
    </header>
  );
};

export default Header;
