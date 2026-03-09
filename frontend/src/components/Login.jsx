import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserDataContext } from "@/context/UserContext";
import Header from "./Header";
import axios from "axios";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = { email: "", password: "" };
    if (!email.trim()) newErrors.email = "Identification required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid format";
    
    if (!password.trim()) newErrors.password = "Security key required";
    else if (password.length < 6) newErrors.password = "Minimum 6 characters";
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const logInUser = { email, password };
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/login`,
        logInUser
      );
      if (response.status === 200 || response.status === 201) {
        const { user, accessToken, refreshToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setUser(user);
        toast.success(`Welcome back to the Collection.`);
        navigate("/products", { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* 1. FIXED HEADER POSITIONING */}
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 relative overflow-hidden">
        {/* Decorative Ambient Light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#A37E2C]/5 via-transparent to-transparent opacity-50 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full max-w-[450px] z-10"
        >
          {/* Header Section inside Login */}
          <div className="text-center mb-12">
            <h2 className="text-[10px] tracking-[0.6em] uppercase font-bold text-[#A37E2C] mb-4">
              Private Access
            </h2>
            <h1 className="text-4xl md:text-5xl font-serif italic text-white">
              Welcome Back
            </h1>
          </div>

          <form onSubmit={handelSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] tracking-[0.3em] uppercase font-black text-gray-500">Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) validate(); }}
                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-4 text-white text-lg focus-visible:ring-0 focus-visible:border-[#A37E2C] transition-colors placeholder:text-gray-800"
                placeholder="name@example.com"
              />
              {errors.email && <p className="text-[#A37E2C] text-[10px] tracking-widest uppercase">{errors.email}</p>}
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) validate(); }}
                  className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-4 text-white text-lg focus-visible:ring-0 focus-visible:border-[#A37E2C] transition-colors"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#A37E2C]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[#A37E2C] text-[10px] tracking-widest uppercase">{errors.password}</p>}
            </div>

            {/* Authenticate Button */}
            <button type="submit" className="w-full bg-[#A37E2C] hover:bg-[#F3E5AB] text-black font-black uppercase tracking-[0.4em] text-[10px] py-6 transition-all duration-500 flex items-center justify-center gap-4 group">
              Authenticate <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          {/* NEW: REGISTER BUTTON IF USER IS NEW */}
          <div className="mt-16 text-center border-t border-white/5 pt-10">
            <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase mb-6">
              New to Timeless Elegance?
            </p>
            <Link
              to="/user/register"
              className="group inline-flex items-center gap-4 text-white font-black tracking-[0.4em] text-[11px] uppercase border border-white/20 px-10 py-4 hover:bg-white hover:text-black transition-all duration-700"
            >
              Request Membership <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="py-10 text-center opacity-30">
        <p className="text-[9px] tracking-[1em] uppercase font-bold text-gray-400">Timeless Excellence</p>
      </footer>
    </div>
  );
};

export default Login;