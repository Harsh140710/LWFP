import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-white dark:bg-black text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div className="flex flex-col gap-3">
          <img src="/logo-2-removebg-preview.png" alt="Logo" className="w-12 h-auto dark:invert" />
          <h2 className="text-xl font-bold text-white">Timeless Elegance</h2>
          <p className="text-black dark:text-gray-400">
            Redefining luxury, one timeless moment at a time. Explore our curated
            collection of premium watches crafted for elegance and precision.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-black dark:text-white mb-2">Quick Links</h3>
          <Link to="/home" className="hover:text-green-500 transition-colors text-black dark:text-white">Home</Link>
          <Link to="/about-us" className="hover:text-green-500 transition-colors text-black dark:text-white">About Us</Link>
          <Link to="/products" className="hover:text-green-500 transition-colors text-black dark:text-white">Products</Link>
          <Link to="/cart" className="hover:text-green-500 transition-colors text-black dark:text-white">Cart</Link>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-black dark:text-white mb-2">Contact</h3>
          <p className="text-black dark:text-white">Email: <a href="mailto:info@timelesselegance.com" className="hover:text-green-500 text-black dark:text-white">luxora293@gmail.com</a></p>
          <p className="text-black dark:text-white">Phone: <a href="tel:+91 9601666086" className="hover:text-green-500 text-black dark:text-white">+91 9601666086</a></p>
          <p className="text-black dark:text-white">Address: 123 Luxury St, Geneva, Switzerland</p>
        </div>

        {/* Social Media */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibol mb-2 text-black dark:text-white">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-green-500 transition-colors text-black dark:text-white"><Facebook size={24} /></a>
            <a href="#" className="hover:text-green-500 transition-colors text-black dark:text-white"><Instagram size={24} /></a>
            <a href="#" className="hover:text-green-500 transition-colors text-black dark:text-white"><Twitter size={24} /></a>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-black dark:text-white text-sm">
        &copy; {new Date().getFullYear()} Timeless Elegance. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
