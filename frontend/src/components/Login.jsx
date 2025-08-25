import React, { useState,useContext } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Link,useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "./ui/separator";
import { MotionRightWrapper } from "@/animation/MotionRightWrapper";
import {UserDataContext} from "@/context/UserContext";
import axios from "axios";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [userData, setUserData] = useState({});

  const {userData, setUserData} = useContext(UserDataContext)
  const navigate = useNavigate()

  const handelSubmit = async (e) => {
    e.preventDefault();

    const logInUser = {
      email:email,
      password:password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/users/login`, logInUser)

    if(response.status === 200 || response.status === 201) {
      const data = response.data
      const { user, refreshToken } = response.data.data;
      setUserData(user)
      localStorage.setItem("token", refreshToken)
      navigate("/product")
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-[calc(100vh-68px)] md:h-[calc(100vh-74px)] flex items-center justify-center bg-[#F9FAFB] dark:bg-[#0B0B0D] px-6">
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
        className="w-[90%] sm:w-[350px] md:w-[350px] lg:w-[400px] lg:ml-20 bg-[#F9FAFB] dark:bg-[#0B0B0D]"
      >
        <h2 className="font-bold sm:text-3xl md:text-4xl lg:text-4xl text-2xl mb-8 text-[#111827] dark:text-[#F9FAFB] text-center">
          Login
        </h2>

        <form onSubmit={(e) => handelSubmit(e)} className="flex flex-col gap-4">
          <Label className="font-semibold text-lg">Enter your Email</Label>
          <Input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border font-semibold border-[#D1D5DB] dark:border-gray-600 bg-[#FFFFFF] dark:bg-[#1A1A1D]
                       text-[#111827] dark:text-gray-100 px-3 py-2 rounded-lg
                       placeholder:text-sm placeholder:text-[#6B7280] focus:outline-none focus:ring-1
                       focus:ring-[#B48E57] dark:focus:ring-[#374151]"
          />

          {/* Password with Eye toggle */}
          <Label className="font-semibold text-lg mt-2">
            Enter your Password
          </Label>
          <div className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
      </motion.div>

      <MotionRightWrapper>
        <div className="hidden lg:flex w-3/4 items-center justify-center p-10 bg-transparent">
          <div className="text-center max-w-md">
            <motion.img
              key="register-form"
              initial={{ opacity: 0, y: -40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 22,
                duration: 0.5,
              }}
              src="/logo-2-removebg-preview.png"
              alt="Product"
              className="w-40 mx-auto mb-6 dark:invert"
            />
            <h2 className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">
              Explore Our Collection
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Timeless elegance crafted just for you. Discover the best watches
              and accessories.
            </p>
          </div>
        </div>
      </MotionRightWrapper>
    </div>
  );
};

export default Login;
