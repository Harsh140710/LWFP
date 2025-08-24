import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {motion} from "framer-motion"
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Separator } from "./ui/separator";
import {useNavigate} from 'react-router-dom'
import useAuthStore from "@/store/useAuthStore";

const EmailLogin = () => {
  const [localEmail, setLocalEmail] = useState("");
  const setEmail = useAuthStore((state) => state.setEmail);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setEmail(localEmail); // store in zustand
    navigate("/user/email-register/otp-send"); // go to OTP page
  };

  return (
    <div className="h-[calc(100vh-68px)] lg:h-[calc(100vh-74px)] flex items-center justify-center bg-[#F9FAFB] dark:bg-[#0B0B0D]">
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
      className="w-[90%] sm:w-[350px] md:w-[350px] lg:w-[450px] bg-[#F9FAFB] dark:bg-[#0B0B0D] rounded-2xl p-8 shadow-lg dark:shadow-none">
        <h2 className="font-bold sm:text-3xl md:text-4xl lg:text-4xl text-2xl text-center mb-16 text-[#111827] dark:text-[#F9FAFB]">
          Register with Email
        </h2>

        <form
        className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            to={"/user/email-register/otp-send"}
            type="submit"
            className="w-full bg-[#B48E57] mt-4 hover:bg-[#A37E4D] text-[#FFFFFF]
                       font-semibold py-2 rounded-lg transition-all dark:bg-[#B48E57] dark:hover:bg-[#A37E4D]"
          >
            Submit
          </button>

          <Separator />
          
          {/* Login Link */}
          <h3 className="font-semibold font-lg lg:font-xl">
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
