import React, { useState, useEffect, useContext } from "react";
import { UserDataContext } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useContext(UserDataContext);
  
  const { cart } = useCart();

  // Calculate total items (sum of all quantities)
  const cartItemCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-1000 ease-in-out ${
        isScrolled
          ? "bg-black/90 backdrop-blur-xl py-4 border-b border-white/5"
          : "bg-transparent py-10"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-16 flex items-center justify-between">
        {/* LEFT: MINIMAL MENU */}
        <div className="flex flex-1 items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-4 text-white group outline-none cursor-pointer">
                <Menu
                  size={22}
                  strokeWidth={1}
                  className="group-hover:text-[#A37E2C] transition-colors"
                />
                <span className="hidden lg:block text-[10px] tracking-[0.5em] font-bold uppercase group-hover:text-[#A37E2C]">
                  Menu
                </span>
              </button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-full sm:max-w-[450px] md:max-w-[550px] bg-black border-r border-white/5 text-white p-0 flex flex-col"
            >
              <div className="z-99 flex flex-col justify-center h-full px-12 md:px-20 bg-[#050505]">
                <SheetHeader className="text-left mb-20">
                  <SheetTitle className="text-[#A37E2C] tracking-[.5em] uppercase text-[10px] font-bold opacity-70">
                    Navigation
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex mt-0 flex-col gap-6 md:gap-10">
                  {["Home", "Products", "About Us", "Cart", "Help"].map((item) => (
                    <Link
                      key={item}
                      to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setOpen(false)}
                      className="text-4xl md:text-6xl font-serif tracking-tighter hover:text-[#A37E2C] hover:italic transition-all duration-500 w-fit"
                    >
                      {item}
                    </Link>
                  ))}
                </nav>

                <div className="mt-20 pt-10 border-t border-white/5">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-medium">
                    © 2026 Timeless Excellence
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* CENTER: LOGO */}
        <Link to="/home" className="flex flex-col items-center group flex-shrink-0">
          <img
            src="/logo-2-removebg-preview.png"
            alt="Logo"
            className="w-8 md:w-12 h-auto invert brightness-0 transition-transform duration-700 group-hover:scale-105"
          />
          <h1 className="hidden md:block mt-4 text-white text-sm tracking-[0.4em] font-light uppercase text-center">
            Timeless <span className="italic font-serif normal-case tracking-normal">Elegance</span>
          </h1>
        </Link>

        {/* RIGHT: SHOP & PROFILE */}
        <div className="flex flex-1 items-center gap-8 md:gap-12 justify-end">
          <Link to="/cart" className="relative text-white hover:text-[#A37E2C] transition-colors">
            <ShoppingCart size={22} strokeWidth={1} />
            
            {/* Always show the count, even if it is 0 */}
            <span className="absolute -top-2 -right-3 bg-[#A37E2C] text-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black">
              {cartItemCount}
            </span>
          </Link>

          {user ? (
            <Link
              to="/user/profile"
              className="w-10 h-10 rounded-full border border-white/10 overflow-hidden hover:border-[#A37E2C] transition-all"
            >
              <img
                src={user?.avatar || "/default_Avatar.jpg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </Link>
          ) : (
            <Link
              to="/user/login"
              className="px-6 py-2 border border-white/20 text-[10px] tracking-[0.3em] font-bold uppercase text-white hover:bg-white hover:text-black transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;