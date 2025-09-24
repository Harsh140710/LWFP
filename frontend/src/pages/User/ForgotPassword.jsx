import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/otp/email/send`,
        { email, purpose: "forgot" }
      );
      toast.success(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/otp/email/verify`,
        { email, code:otp, purpose: "forgot" } // add purpose
      );
      toast.success(res.data.message || "OTP verified");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  const resetPassword = async () => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/reset-password`,
        { email, code:otp, purpose:"forgot", newPassword }
      );
      toast.success(res.data.message || "Password reset successfully");
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
      <div className="w-[90%] sm:w-[350px] bg-white dark:bg-black border p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 dark:text-white">
          Forgot Password
        </h2>

        {step === 1 && (
          <>
            <Label className="font-semibold text-lg dark:text-white mt-10">
              Enter your Email
            </Label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-5 mb-4"
            />
            <button
              onClick={sendOtp}
              className="w-full bg-green-500 hover:bg-green-700 text-white py-2 mt-3 rounded-lg"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <Label className="font-semibold text-lg dark:text-white">
              Enter OTP
            </Label>
            <Input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-2 mb-4"
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-lg"
            >
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <Label className="font-semibold text-lg dark:text-white">
              New Password
            </Label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2 mb-4"
            />
            <button
              onClick={resetPassword}
              className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-lg"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
