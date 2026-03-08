import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-[#050505] text-white py-20 px-6 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Identity */}
          <div className="space-y-6">
            <img 
              src="/logo-2-removebg-preview.png" 
              alt="Timeless Elegance" 
              className="w-16 h-auto brightness-0 invert opacity-80" 
            />
            <div className="space-y-4">
              <h2 className="text-[14px] tracking-[0.5em] uppercase font-black text-[#A37E2C]">
                Timeless Elegance
              </h2>
              <p className="text-[11px] leading-relaxed tracking-widest text-gray-500 uppercase font-light">
                Redefining luxury through precision horology. Our curated vault 
                houses the world's most prestigious timepieces.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-gray-400 mb-4">Navigations</h3>
            <div className="flex flex-col gap-3">
              {['Home', 'About Us', 'Products', 'Cart', 'Help'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-[11px] tracking-widest uppercase text-gray-500 hover:text-[#A37E2C] transition-colors duration-500 font-medium"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Concierge */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-gray-400 mb-4">Concierge</h3>
            <div className="space-y-4">
              <a href="mailto:luxora293@gmail.com" className="flex items-center gap-3 group">
                <Mail size={14} className="text-[#A37E2C]" />
                <span className="text-[11px] tracking-widest uppercase text-gray-500 group-hover:text-white transition-colors">luxora293@gmail.com</span>
              </a>
              <a href="tel:+919601666086" className="flex items-center gap-3 group">
                <Phone size={14} className="text-[#A37E2C]" />
                <span className="text-[11px] tracking-widest uppercase text-gray-500 group-hover:text-white transition-colors">+91 9601666086</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-[#A37E2C]" />
                <span className="text-[11px] tracking-widest uppercase text-gray-500 leading-relaxed">
                  Ahmedabad, Gujarat <br /> 380001, India
                </span>
              </div>
            </div>
          </div>

          {/* Social Presence */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-gray-400 mb-4">Social Presence</h3>
            <div className="flex gap-6">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="text-gray-500 hover:text-[#A37E2C] transition-all duration-500 transform hover:-translate-y-1"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600 mt-6 italic">
              Experience elegance daily.
            </p>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] tracking-[0.5em] uppercase text-gray-600">
            &copy; {new Date().getFullYear()} Timeless Elegance. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-[9px] tracking-[0.3em] uppercase text-gray-600 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-[9px] tracking-[0.3em] uppercase text-gray-600 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;