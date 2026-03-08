import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "../../components/Header"; // Ensure path is correct
import { UserDataContext } from "@/context/UserContext";
import axios from "axios";
import { toast } from "sonner";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: { firstname: "", lastname: "" },
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullname.firstname.trim()) newErrors.firstname = "First name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Minimum 6 characters";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Enter 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstname" || name === "lastname") {
      setFormData((prev) => ({
        ...prev,
        fullname: { ...prev.fullname, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const newUser = {
        firstname: formData.fullname.firstname,
        lastname: formData.fullname.lastname,
        username: formData.username,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/register`,
        newUser
      );

      if (response.status === 200 || response.status === 201) {
        const { user, accessToken, refreshToken } = response.data.data;
        setUser(user);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        toast.success(`Welcome to the House, ${user?.fullname?.firstname}!`);
        navigate("/user/profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* 1. FIXED HEADER NAVIGATION */}
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 relative overflow-hidden">
        {/* Decorative Background Ambient Light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#A37E2C]/5 via-transparent to-transparent opacity-50 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full max-w-[550px] z-10"
        >
          {/* Header Title */}
          <div className="text-center mb-12">
            <h2 className="text-[10px] tracking-[0.6em] uppercase font-bold text-[#A37E2C] mb-4">
              Membership Request
            </h2>
            <h1 className="text-4xl md:text-5xl font-serif italic text-white">
              Create Account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAME ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] tracking-[0.3em] uppercase font-black text-gray-500">First Name</Label>
                <Input
                  name="firstname"
                  value={formData.fullname.firstname}
                  onChange={handleChange}
                  placeholder="John"
                  className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-3 text-white focus-visible:ring-0 focus-visible:border-[#A37E2C] transition-colors placeholder:text-gray-800"
                />
                {errors.firstname && <p className="text-[#A37E2C] text-[9px] uppercase tracking-widest">{errors.firstname}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] tracking-[0.3em] uppercase font-black text-gray-500">Last Name</Label>
                <Input
                  name="lastname"
                  value={formData.fullname.lastname}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-3 text-white focus-visible:ring-0 focus-visible:border-[#A37E2C] transition-colors placeholder:text-gray-800"
                />
              </div>
            </div>

            {/* IDENTIFIERS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] tracking-[0.3em] uppercase font-black text-gray-500">Username</Label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="jdoe_luxury"
                  className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-3 text-white focus-visible:ring-0 focus-visible:border-[#A37E2C] transition-colors placeholder:text-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] tracking-[0.3em] uppercase font-black text-gray-500">Phone</Label>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData((prev) => ({ ...prev, phoneNumber: value }));
                  }}
                  maxLength={10}
                  placeholder="0123456789"
                  className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-3 text-white focus-visible:ring-0 focus-visible:border-[#A37E2C] transition-colors placeholder:text-gray-800"
                />
                {errors.phoneNumber && <p className="text-[#A37E2C] text-[9px] uppercase tracking-widest">{errors.phoneNumber}</p>}
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <Label className="text-[9px] tracking-[0.3em] uppercase font-black text-gray-500">Email Address</Label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-3 text-white focus-visible:ring-0 focus-visible:border-[#A37E2C] transition-colors placeholder:text-gray-800"
                placeholder="email@vault.com"
              />
              {errors.email && <p className="text-[#A37E2C] text-[9px] uppercase tracking-widest">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label className="text-[9px] tracking-[0.3em] uppercase font-black text-gray-500">Security Key</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 py-3 text-white focus-visible:ring-0 focus-visible:border-[#A37E2C] transition-colors placeholder:text-gray-800"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#A37E2C]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[#A37E2C] text-[9px] uppercase tracking-widest">{errors.password}</p>}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A37E2C] hover:bg-[#F3E5AB] text-black font-black uppercase tracking-[0.4em] text-[10px] py-5 mt-4 transition-all duration-500 flex items-center justify-center gap-4 group disabled:opacity-50"
            >
              {loading ? "Processing..." : "Create Account"} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          {/* EMAIL LOGIN REDIRECT */}
          <div className="mt-6">
            <Link
              to="/user/email-register"
              className="w-full border border-white/10 hover:border-white/30 text-white font-bold uppercase tracking-[0.3em] text-[9px] py-4 transition-all flex items-center justify-center gap-3"
            >
              <Mail size={14} /> Continue with Email Link
            </Link>
          </div>

          {/* LOGIN REDIRECT */}
          <div className="mt-12 text-center pt-8 border-t border-white/5">
            <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase mb-4">Already a member?</p>
            <Link
              to="/user/login"
              className="text-white font-black tracking-[0.4em] text-[11px] uppercase border-b border-[#A37E2C] pb-1 hover:text-[#A37E2C] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="py-10 text-center opacity-20">
        <p className="text-[8px] tracking-[1em] uppercase font-bold text-gray-400">Timeless Excellence • Geneva</p>
      </footer>
    </div>
  );
};

export default Register;