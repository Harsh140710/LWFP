import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    console.log("Entered OTP:", otp);
  };

  return (
    <div className="flex h-[calc(100vh-85px)] flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className=" p-10 rounded-2xl flex items-center justify-center flex-col shadow-2xl dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center mb-10 text-gray-800 dark:text-gray-100">
          Enter OTP
        </h1>

        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp} // this updates the state
        >
          <InputOTPGroup className="gap-3 shadow-2xl">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <button
          onClick={handleVerify}
          className="mt-10 px-6 py-2 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-700 transition dark:bg-blue-800 dark:hover:bg-blue-700"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
