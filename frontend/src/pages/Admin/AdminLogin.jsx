import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Mail, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { UserDataContext } from "@/context/UserContext";
import api from "@/utils/api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/v1/users/login", { email, password });
      const { user, accessToken, refreshToken } = response.data.data;

      if (user.role !== "admin") {
        toast.error("Access Denied: Administrative privileges required.");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user);

      toast.success("Identity Verified. Welcome, Admin.");
      const redirectTo = location.state?.from || "/admin/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#A37E2C]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#A37E2C]/5 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-4 border border-[#A37E2C]/30 bg-[#A37E2C]/5 text-[#A37E2C] mb-6">
            <ShieldCheck size={32} strokeWidth={1} />
          </div>
          <h2 className="text-[10px] tracking-[0.8em] uppercase font-bold text-[#A37E2C] mb-3">Secure Gateway</h2>
          <h1 className="text-4xl font-serif italic">Administrator Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-[#A37E2C] transition-colors">
                <Mail size={18} strokeWidth={1.5} />
              </div>
              <input
                type="email"
                placeholder="ADMINISTRATIVE EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-white/10 p-4 pl-12 text-[11px] tracking-widest uppercase focus:border-[#A37E2C] outline-none transition-all placeholder:text-gray-700"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-[#A37E2C] transition-colors">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <input
                type="password"
                placeholder="SECURE PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-white/10 p-4 pl-12 text-[11px] tracking-widest focus:border-[#A37E2C] outline-none transition-all placeholder:text-gray-700"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-8 py-5 bg-[#A37E2C] text-black text-[10px] tracking-[0.5em] uppercase font-bold hover:bg-white transition-all duration-700 flex items-center justify-center gap-3 group"
          >
            Authorize Access
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-12 text-center text-[9px] tracking-[0.3em] uppercase text-gray-600">
          Internal Systems — Unauthorized Access Prohibited
        </p>
      </motion.div>

      {/* Aesthetic Footer Decor */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] tracking-[1em] uppercase opacity-20 font-bold pointer-events-none">
        Timeless Excellence
      </div>
    </div>
  );
};

export default AdminLogin;