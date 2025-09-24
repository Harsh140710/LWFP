import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import {toast} from "sonner";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const email = useAuthStore((state) => state.email);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/otp/email/verify`,
        { email, code: otp, purpose: "register" } // ONLY these fields
      );

      if (res.data.success) {
        toast.success("OTP Verified");
        // Navigate to registration page
        navigate("/user/email-register", { state: { email } });
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      // console.error("Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] dark:bg-black">
      <motion.div
        key="register-form"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-10 rounded-2xl flex flex-col items-center justify-center shadow-lg bg-[#FFFFFF] dark:bg-black border"
      >
        <h1 className="text-2xl font-bold mb-5 text-black dark:text-gray-100">
          OTP Verification
        </h1>
        <p className="mb-8 font-semibold text-center">
          Enter the 6-digit OTP sent to your Email <br />
          <b>{email}</b>
        </p>

        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup className="gap-3">
            {[...Array(6)].map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="rounded-md border p-2 text-center text-xl"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <button
          onClick={handleVerify}
          className="w-full bg-green-500 mt-8 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
        >
          Verify OTP
        </button>
      </motion.div>
    </div>
  );
};

export default OTPVerification;
