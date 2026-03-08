import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ShoppingCart, HelpCircle, LogOut, User, MapPin, Phone, Mail } from "lucide-react";
import { UserDataContext } from "@/context/UserContext";
import Header from "../../components/Header"; // Ensure correct path
import { toast } from "sonner";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(res.data.data);
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Session expired. Please sign in.");
        navigate("/user/login");
      }
    };
    fetchProfile();
  }, [setUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/user/login");
    toast.success("Signed out of the collection.");
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050505]">
        <div className="w-12 h-12 border-t-2 border-[#A37E2C] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-20">
        {/* Header Section */}
        <div className="mb-16">
          <h2 className="text-[10px] tracking-[0.6em] uppercase font-bold text-[#A37E2C] mb-2">Member Dashboard</h2>
          <h1 className="text-4xl md:text-6xl font-serif italic">The House of {userData.fullname.firstname}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: IDENTITY CARD */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="relative group w-fit mx-auto lg:mx-0">
              <img
                src={userData.avatar || "/default_Avatar.jpg"}
                alt="Avatar"
                className="rounded-full h-64 w-64 object-cover border border-white/10 grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 border border-[#A37E2C] translate-x-3 translate-y-3 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
            </div>

            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-4 group">
                <div className="p-2 border border-white/5 bg-white/5 text-[#A37E2C]">
                  <User size={16} strokeWidth={1} />
                </div>
                <div>
                  <p className="text-[9px] tracking-widest text-gray-500 uppercase font-bold">Member ID</p>
                  <p className="text-sm font-medium">@{userData.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 border border-white/5 bg-white/5 text-[#A37E2C]">
                  <Mail size={16} strokeWidth={1} />
                </div>
                <div>
                  <p className="text-[9px] tracking-widest text-gray-500 uppercase font-bold">Email Registry</p>
                  <p className="text-sm font-medium">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 border border-white/5 bg-white/5 text-[#A37E2C]">
                  <Phone size={16} strokeWidth={1} />
                </div>
                <div>
                  <p className="text-[9px] tracking-widest text-gray-500 uppercase font-bold">Secure Contact</p>
                  <p className="text-sm font-medium">{userData.phoneNumber || "Verified Account"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 border border-white/5 bg-white/5 text-[#A37E2C]">
                  <MapPin size={16} strokeWidth={1} />
                </div>
                <div>
                  <p className="text-[9px] tracking-widest text-gray-500 uppercase font-bold">Primary Residence</p>
                  <p className="text-sm font-medium italic text-gray-400">{userData.address || "Global Citizen"}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: QUICK ACTIONS */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Action Cards */}
              {[
                { label: "Order History", icon: <Package size={24}/>, path: "/orders/history", desc: "Review your acquired pieces" },
                { label: "Boutique Cart", icon: <ShoppingCart size={24}/>, path: "/cart", desc: "Items currently in selection" },
                { label: "Concierge", icon: <HelpCircle size={24}/>, path: "/help", desc: "Get assistance from our specialists" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="group p-8 border border-white/10 bg-transparent hover:border-[#A37E2C] transition-all duration-500 text-left flex flex-col justify-between h-48"
                >
                  <div className="text-gray-400 group-hover:text-[#A37E2C] transition-colors uppercase tracking-[0.3em] text-[10px] flex justify-between items-start w-full">
                    {item.label}
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-lg font-serif italic mb-1">{item.label}</p>
                    <p className="text-[11px] text-gray-600 group-hover:text-gray-400 transition-colors uppercase tracking-widest font-bold">
                      {item.desc}
                    </p>
                  </div>
                </button>
              ))}

              {/* Logout Card */}
              <button
                onClick={handleLogout}
                className="group p-8 border border-white/10 bg-transparent hover:bg-red-950/20 hover:border-red-900 transition-all duration-500 text-left flex flex-col justify-between h-48"
              >
                <div className="text-gray-400 group-hover:text-red-500 transition-colors uppercase tracking-[0.3em] text-[10px] flex justify-between items-start w-full">
                  Account
                  <LogOut size={24}/>
                </div>
                <div>
                  <p className="text-lg font-serif italic mb-1">Sign Out</p>
                  <p className="text-[11px] text-gray-600 uppercase tracking-widest font-bold">End current session</p>
                </div>
              </button>

            </div>

            {/* Banner/Note */}
            <div className="mt-8 p-10 border border-[#A37E2C]/20 bg-[#A37E2C]/5 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#A37E2C] mb-2">Member Privilege</h3>
                 <p className="font-serif text-xl italic">"True elegance is not being noticed, it is being remembered."</p>
               </div>
               <div className="absolute top-0 right-0 p-4 text-[40px] opacity-10 font-serif">2026</div>
            </div>
          </motion.div>

        </div>
      </main>

      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-[9px] tracking-[1em] uppercase text-gray-700 font-bold">Timeless Excellence</p>
      </footer>
    </div>
  );
}