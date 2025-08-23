import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

const EmailLogin = () => {
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);

    setEmail = ""
    setOTP = ""
  };

  return (
    <div className="h-[calc(100vh-85px)] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-[90%] sm:w-[350px] md:w-[450px] lg:w-[550px] bg-white dark:bg-gray-800 rounded-2xl p-8 dark:shadow-2xl shadow-2xl">
        <h2 className="font-bold sm:text-3xl md:text-4xl lg:text-4xl text-2xl text-center mb-16 text-gray-900 dark:text-gray-100">
          Register with Email
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Label className="font-semibold text-lg">Enter your Email</Label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border font-semibold border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700
                       text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg
                       placeholder:text-sm focus:outline-none focus:ring-1
                       focus:ring-gray-500"
          />

          {/* Submit Button */}
          <Link
            to={"/user/email-register/otp-send"}
            type="submit"
            className="w-full flex items-center justify-center mt-4 bg-black hover:bg-gray-900 text-white
                       font-semibold py-2 rounded-lg transition-all dark:bg-blue-800"
          >
            Submit
          </Link>

          
          {/* Login Link */}
          <h3 className="font-semibold">
            You already have an account?{" "}
            <Link to="/user/login" className="text-blue-800 font-bold">
              Log In
            </Link>
          </h3>
        </form>
      </div>
    </div>
  );
};

export default EmailLogin;
