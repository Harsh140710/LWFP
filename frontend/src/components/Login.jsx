import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "./ui/separator";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handelSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);

    setEmail('')
    setPassword('')
  };

  return (
    <div className="h-[calc(100vh-74px)] flex items-center justify-center bg-[#F9FAFB] dark:bg-[#0B0B0D]">
      <div className="w-[90%] sm:w-[350px] md:w-[450px] lg:w-[550px] bg-[#FFFFFF] dark:bg-[#151517] shadow-2xl rounded-2xl p-8 dark:shadow-lg dark:hover:bg-[#161617]">
        <h2 className="font-bold sm:text-3xl md:text-4xl lg:text-4xl text-2xl mb-8 text-[#111827] dark:text-[#F9FAFB] text-center">
          Login
        </h2>

        <form className="flex flex-col gap-4">
          <Label className="font-semibold text-lg">Enter your Email</Label>
          <Input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border font-semibold border-[#D1D5DB] dark:border-gray-600 bg-[#FFFFFF] dark:bg-[#1A1A1D]
                       text-[#111827] dark:text-gray-100 px-3 py-2 rounded-lg
                       placeholder:text-sm placeholder:text-[#6B7280] focus:outline-none focus:ring-1
                       focus:ring-[#B48E57] dark:focus:ring-[#374151]"
          />

          {/* Password with Eye toggle */}
          <Label className="font-semibold text-lg mt-2">Enter your Password</Label>
          <div className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border font-semibold border-[#D1D5DB] dark:border-gray-600 bg-[#FFFFFF] dark:bg-[#1A1A1D]
                         text-[#111827] dark:text-gray-100 px-3 py-2 rounded-lg
                         placeholder:text-sm  placeholder:text-[#6B7280] focus:outline-none focus:ring-1
                         focus:[#B48E57] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#B48E57] mt-4 hover:bg-[#A37E4D] text-[#FFFFFF]
                       font-semibold py-2 rounded-lg transition-all dark:bg-[#B48E57] dark:hover:bg-[#A37E4D]"
          >
            Submit
          </button>

          <Separator />

          <h3 className="font-semibold">
            You don't have an account ?{" "}
            <Link to="/user/register" className="text-blue-800 font-bold">
              Register
            </Link>
          </h3>
        </form>
      </div>
    </div>
  );
};

export default Login;
