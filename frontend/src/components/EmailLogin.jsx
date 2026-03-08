"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import { toast } from "sonner";

const EmailLogin = () => {
  const [localEmail, setLocalEmail] = useState("");
  const setEmail = useAuthStore((state) => state.setEmail);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/users/otp/email/send`, {
        email: localEmail
      });

      if (res.data.data.exists) {
        // User exists -> Go to Password Login
        toast.info("WELCOME BACK", { description: "Please enter your credentials." });
        navigate("/user/login", { state: { email: localEmail } });
      } else {
        // User is new -> Go to OTP Verification
        setEmail(localEmail);
        toast.success("VERIFICATION SENT", { description: "New account setup initiated." });
        navigate("/user/email-register/otp-send");
      }
    } catch (err) {
      toast.error("VAULT ERROR", { description: "Unable to verify identity." });
    }
  };

  const inputStyle = "bg-transparent border-white/10 text-white focus:border-[#A37E2C] transition-all rounded-none placeholder:text-gray-600 uppercase text-[10px] tracking-[0.2em] py-6";
  const labelStyle = "text-[10px] uppercase tracking-[0.4em] text-[#A37E2C] font-bold mb-2";

  return (
    <div className="min-h-screen pt-25 flex items-center justify-center bg-[#050505] px-6 selection:bg-[#A37E2C] selection:text-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] bg-[#0A0A0A] border border-white/5 p-12 shadow-2xl"
      >
        <div className="text-center mb-12">
          <h2 className="font-serif italic text-4xl text-white mb-4">
            Join the Registry
          </h2>
          <div className="h-[1px] w-12 bg-[#A37E2C] mx-auto opacity-50" />
        </div>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label className={labelStyle}>Email Identity</Label>
            <Input
              type="email"
              required
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              placeholder="ENTER YOUR REGISTERED EMAIL..."
              className={inputStyle}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#A37E2C] hover:bg-white text-black font-bold py-5 text-[10px] tracking-[0.5em] uppercase transition-all duration-700 shadow-lg shadow-[#A37E2C]/5"
          >
            Request Access Key
          </button>

          <div className="relative py-2">
            <Separator className="bg-white/5" />
          </div>

          <p className="text-center text-[9px] tracking-[0.3em] text-gray-500 uppercase">
            Already a member of the house?{" "}
            <Link
              to="/user/login"
              className="text-[#A37E2C] font-black hover:text-white transition-colors ml-2"
            >
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailLogin;