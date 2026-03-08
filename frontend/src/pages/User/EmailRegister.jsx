"use client";

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const EmailRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [form, setForm] = useState({
    username: "",
    password: "",
    phoneNumber: "",
    firstname: "",
    lastname: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (form.password.length < 6) {
      return toast.error("SECURITY PROTOCOL", {
        description: "Password must be at least 6 characters.",
      });
    }

    if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) {
      return toast.error("INVALID CONTACT", {
        description: "Please enter a valid 10-digit Indian phone number.",
      });
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/register`,
        {
          ...form,
          username: form.username.trim(),
          email: email.trim(),
        }
      );

      toast.success("ACCESS GRANTED", {
        description: "Your luxury profile has been created successfully.",
      });
      navigate("/user/login");
    } catch (err) {
      toast.error("REGISTRATION FAILED", {
        description: err.response?.data?.message || "An error occurred with the vault.",
      });
    }
  };

  const inputStyle = "bg-transparent border-white/10 text-white focus:border-[#A37E2C] transition-all rounded-none placeholder:text-gray-600 uppercase text-[10px] tracking-widest py-6";
  const labelStyle = "text-[10px] uppercase tracking-[0.3em] text-[#A37E2C] font-bold mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6 py-20 selection:bg-[#A37E2C] selection:text-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0A0A0A] border border-white/5 p-10 shadow-2xl"
      >
        <div className="text-center mb-10 space-y-2">
          <h2 className="font-serif italic text-4xl text-white">The Final Step</h2>
          <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-medium">
            Completing Profile for <span className="text-white">{email}</span>
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <Label className={labelStyle}>Username</Label>
              <Input
                name="username"
                placeholder="UNIQUE IDENTIFIER"
                className={inputStyle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={labelStyle}>First Name</Label>
                <Input
                  name="firstname"
                  placeholder="GIVEN NAME"
                  className={inputStyle}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label className={labelStyle}>Last Name</Label>
                <Input
                  name="lastname"
                  placeholder="SURNAME"
                  className={inputStyle}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label className={labelStyle}>Phone Number</Label>
              <Input
                name="phoneNumber"
                placeholder="+91 XXXXX XXXXX"
                className={inputStyle}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label className={labelStyle}>Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                className={inputStyle}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#A37E2C] hover:bg-white text-black font-bold py-4 text-[10px] tracking-[0.5em] uppercase transition-all duration-700"
          >
            Create Legacy
          </button>

          <div className="relative py-4">
            <Separator className="bg-white/5" />
          </div>

          <p className="text-center text-[10px] tracking-widest text-gray-500 uppercase">
            Part of the elite?{" "}
            <span
              onClick={() => navigate("/user/login")}
              className="text-[#A37E2C] font-black cursor-pointer hover:text-white transition-colors"
            >
              Log In
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailRegister;