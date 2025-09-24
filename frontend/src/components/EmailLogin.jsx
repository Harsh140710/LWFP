import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import {toast} from "sonner";

const EmailLogin = () => {
  const [localEmail, setLocalEmail] = useState("");
  const setEmail = useAuthStore((state) => state.setEmail);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/otp/email/send`,
        {
          email: localEmail,
          purpose: "register", // or "forgot"
        }
      );

      if (res.data.success) {
        setEmail(localEmail); // save email in zustand
        toast.success("OTP sent successfully");
        navigate("/user/email-register/otp-send");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (err) {
      // console.error(err);
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:bg-black">
      <motion.div
        key="register-form"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 22,
          duration: 0.5,
        }}
        className="w-[90%] sm:w-[350px] md:w-[350px] lg:w-[450px] bg-[#F9FAFB] dark:bg-black rounded-2xl p-8 shadow-lg dark:shadow-none border"
      >
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-4xl text-center mb-16 text-[#111827] dark:text-[#F9FAFB]">
          Register with Email
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Label className="font-semibold text-lg">Enter your Email</Label>
          <Input
            type="email"
            required
            value={localEmail}
            onChange={(e) => setLocalEmail(e.target.value)}
            placeholder="Email"
            className="w-full border font-semibold border-[#D1D5DB] dark:border-gray-600 bg-[#FFFFFF] dark:bg-[#1A1A1D]
                       text-[#111827] dark:text-gray-100 px-3 py-2 rounded-lg
                       placeholder:text-sm  placeholder:text-[#6B7280] focus:outline-none focus:ring-1
                       focus:[#B48E57] pr-10"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 mt-4 hover:bg-green-600 text-[#FFFFFF]
                       font-semibold py-2 rounded-lg transition-all"
          >
            Submit
          </button>

          <Separator />

          {/* Login Link */}
          <h3 className="font-semibold text-lg">
            You already have an account?{" "}
            <Link to="/user/login" className="text-blue-800 font-bold">
              Log In
            </Link>
          </h3>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailLogin;
