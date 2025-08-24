import React, { useState } from "react";
import {motion} from "framer-motion"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import useAuthStore from "@/store/useAuthStore";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const email = useAuthStore((state) => state.email)
  const [userData, setuserData] = useState({})
  const handleVerify = (e) => {
    e.preventDefault()

    setuserData({
      email:email,
      otp:otp
    })
  };

  return (
    <div className="flex h-[calc(100vh-68px)] lg:h-[calc(100vh-74px)] flex-col items-center justify-center bg-[#F9FAFB] dark:bg-[#0B0B0D]">
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
      className=" p-10 rounded-2xl flex items-center justify-center flex-col shadow-lg dark:shadow-none bg-[#FFFFFF] dark:bg-[#0B0b0D]">
        <h1 className="text-2xl font-bold text-center mb-5 text-gray-800 dark:text-gray-100">
          OTP Verification
        </h1>
        <p className="m-10 font-semibold text-center">Enter the 6-digit OTP send on your Email <br /><b className="font-serif text-lg">{email}</b></p>

        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp} // this updates the state
        >
          <InputOTPGroup className="gap-3 shadow-2xl">
            <InputOTPSlot index={0} className="rounded-md border-[#D1D5DB] dark:border-gray-600 bg-[#FFFFFF] dark:bg-[#1A1A1D]
                         text-[#111827] dark:text-gray-100 text-xl font-semibold"/>
            <InputOTPSlot index={1} className="rounded-md border-[#D1D5DB] dark:border-gray-600 bg-[#FFFFFF] dark:bg-[#1A1A1D]
                         text-[#111827] dark:text-gray-100 text-xl font-semibold"/>
            <InputOTPSlot index={2} className="rounded-md border-[#D1D5DB] dark:border-gray-600 bg-[#FFFFFF] dark:bg-[#1A1A1D]
                         text-[#111827] dark:text-gray-100 text-xl font-semibold"/>
            <InputOTPSlot index={3} className="rounded-md border-[#D1D5DB] dark:border-gray-600 bg-[#FFFFFF] dark:bg-[#1A1A1D]
                         text-[#111827] dark:text-gray-100 text-xl font-semibold"/>
            <InputOTPSlot index={4} className="rounded-md border-[#D1D5DB] dark:border-gray-600 bg-[#FFFFFF] dark:bg-[#1A1A1D]
                         text-[#111827] dark:text-gray-100 text-xl font-semibold"/>
            <InputOTPSlot index={5} className="rounded-md border-[#D1D5DB] dark:border-gray-600 bg-[#FFFFFF] dark:bg-[#1A1A1D]
                         text-[#111827] dark:text-gray-100 text-xl font-semibold"/>
          </InputOTPGroup>
        </InputOTP>

        <button
          onClick={handleVerify}
          className="w-full bg-[#B48E57] mt-8 hover:bg-[#A37E4D] text-[#FFFFFF]
                       font-semibold py-2 rounded-lg transition-all dark:bg-[#B48E57] dark:hover:bg-[#A37E4D]"
        >
          Verify OTP
        </button>
      </motion.div>
    </div>
  );
};

export default OTPVerification;
