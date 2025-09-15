import React, { useState, useRef, useContext } from "react";
import { UserDataContext } from "@/context/UserContext";
import ThemeToggleButton from "./ui/theme-toggle-button";
import { Link } from "react-router-dom";
import { Book, Home, LogIn, Search, ShoppingCart, Watch } from "lucide-react";
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
  const searchRef = useRef(null);

  const { user } = useContext(UserDataContext);

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
    <header className="fixed top-0 left-0 w-full z-50 bg-green-700 dark:bg-black shadow-md">
      {/* Main Header Row */}
      <div className="grid grid-cols-3 items-center px-4 sm:px-6 py-4">
        {/* Left - Menu */}
        <div className="flex relative z-50 items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-1 text-white dark:text-[#FEEFEF]">
                <span className="hidden md:flex text-lg font-bold">MENU</span>
                <MenuButton open={open} />
              </button>
            </SheetTrigger>
            <SheetContent side="top" className="h-screen dark:bg-[#0B0B0D]">
              <SheetHeader>
                <SheetTitle className="text-lg font-bold text-black dark:text-[#FEFEFE]">
                  Menu
                </SheetTitle>
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
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-3 px-3 py-2 rounded-lg font-medium
                          transition-colors duration-300
                        text-gray-800 dark:text-gray-200
                        hover:text-green-500 dark:hover:text-green-500"
                      >
                        <Icon className="w-5 h-5 shrink-0 transition-colors duration-300" />
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
        </div>

        {/* Center - Logo (Responsive) */}
        <div className="flex-1 flex justify-center items-center gap-2">
          <img
            src="/logo-2-removebg-preview.png"
            alt="Watch-logo"
            className="hidden md:block w-10 h-auto invert"
          />
          <h2 className="hidden md:block font-bold text-lg sm:text-xl md:text-2xl text-white dark:text-[#F9FAFB]">
            Timeless
            <span
              style={{ fontFamily: "'Great Vibes', cursive" }}
              className="ml-1.5 text-white"
            >
              Elegance
            </span>
          </h2>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3 justify-end">
          {/* Search (Desktop / Tablet only)
          <div className="hidden md:flex items-center relative">
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search"
              className="font-semibold border border-[#B48E57] dark:border-[#B48E57] bg-transparent text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg w-44 placeholder:text-sm placeholder:text-[#B48E57] focus:outline-none focus:ring-1 focus:ring-gray-500 pr-9"
            />
            <button type="button" onClick={handleSearchFocus}>
              <Search className="absolute size-[1.1rem] right-3 top-1/2 -translate-y-1/2 text-[#B48E57] dark:text-[#B48E57]" />
            </button>
          </div> */}

          {/* Theme Toggle */}
          <ThemeToggleButton />

          {/* Cart */}
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-circle transition-all duration-300
                bg-green-700 hover:border-2 hover:border-white text-white dark:bg-[#0B0B0D] dark:text-white shadow-none border-green-700 dark:border-[#111]"
              >
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div
                tabIndex={0}
                className="card card-compact dropdown-content z-50 mt-3 w-52 shadow"
              >
                <div className="card-body">
                  <span className="text-lg font-bold text-black dark:text-white">8 Items</span>
                  <span className="text-info">Subtotal: $999</span>
                  <div className="card-actions">
                    <Link
                      to="/cart"
                      className="btn btn-primary btn-block bg-green-500 hover:bg-green-600 border-none"
                    >
                      View cart
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:bg-[#B48E57] hover:border hover:border-green-500 transition-colors"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden">
                {/* ✅ Avatar from backend context */}
                <img
                  alt="Profile"
                  src={user?.avatar || "/default_Avatar.jpg"}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#FEFEFE] dark:bg-[#0B0B0D] rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link
                  to={"/user/profile"}
                  className="font-semibold text-[#1D1D1D] dark:text-white hover:bg-green-500 dark:hover:bg-[#B48E57] transition-colors"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to={"/user/logout"}
                  className="font-semibold text-[#1D1D1D] dark:text-white hover:bg-red-500 dark:hover:bg-[#B48E57] transition-colors"
                >
                  Log Out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Search (below header)
      <div className="px-4 pb-3 flex md:hidden items-center relative bg-[#F9FAFB] dark:bg-[#0B0B0D]">
        <input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          placeholder="Search"
          className="font-semibold border border-[#E5E7EB] dark:border-[#1E293B] bg-transparent text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg w-full placeholder:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-gray-500 pr-9"
        />
        <button type="button" onClick={handleSearchFocus}>
          <Search className="absolute size-[1.1rem] right-6 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300" />
        </button>
      </div> */}
    </header>
  );
};

export default Header;
