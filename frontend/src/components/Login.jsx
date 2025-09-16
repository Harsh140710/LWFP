import React, { useState, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "./ui/separator";
import { MotionRightWrapper } from "@/animation/MotionRightWrapper";
import { UserDataContext } from "@/context/UserContext";
import axios from "axios";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation error states
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Real-time validation
  const validate = () => {
    const newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password; // ✅ valid if no errors
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // stop submit if invalid

    try {
      const logInUser = { email, password };
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/login`,
        logInUser
      );

      if (response.status === 200 || response.status === 201) {
        const { user, accessToken, refreshToken } = response.data.data;
        setUser(user);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        toast.success(`Welcome back, ${user?.fullname.firstname || "User"}!`);

        const redirectTo = location.state?.from || "/products";
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="flex flex-col lg:flex-row items-center justify-center
             min-h-screen pt-[68px] md:pt-[74px]
             bg-[#F9FAFB] dark:bg-[#0B0B0D] px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 22,
          duration: 0.5,
        }}
        className="w-[90%] sm:w-[350px] md:w-[350px] lg:w-[400px] lg:ml-20 bg-[#F9FAFB] dark:bg-[#0B0B0D]"
      >
        <h2 className="font-bold sm:text-3xl md:text-4xl text-2xl mb-8 text-[#111827] dark:text-[#F9FAFB] text-center">
          Login
        </h2>

        <form onSubmit={handelSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <Label className="font-semibold text-lg text-black dark:text-white">
            Enter your Email
          </Label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) validate(); // re-validate on change
            }}
            className="w-full border font-semibold border-[#D1D5DB] dark:border-gray-600 bg-[#FFFFFF] dark:bg-[#1A1A1D]
                       text-[#111827] dark:text-gray-100 px-3 py-2 rounded-lg
                       placeholder:text-sm placeholder:text-[#6B7280] focus:outline-none focus:ring-1
                       focus:ring-[#B48E57] dark:focus:ring-[#374151]"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          {/* Password */}
          <Label className="font-semibold text-lg mt-2 text-black dark:text-white">
            Enter your Password
          </Label>
          <div className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) validate();
              }}
              className="w-full border font-semibold border-[#D1D5DB] dark:border-gray-600 bg-[#FFFFFF] dark:bg-[#1A1A1D]
                         text-[#111827] dark:text-gray-100 px-3 py-2 rounded-lg
                         placeholder:text-sm placeholder:text-[#6B7280] focus:outline-none focus:ring-1
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
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center space-x-2 text-sm dark:text-gray-300 accent-green-600 focus:ring-2 focus:ring-green-500">
              <input
                type="checkbox"
                className="h-4 w-4 text-green-600 border-gray-300 rounded bg-white"
                onChange={(e) => {
                  if (e.target.checked) {
                    localStorage.setItem("rememberMe", email);
                  } else {
                    localStorage.removeItem("rememberMe");
                  }
                }}
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => navigate("/user/forgot-password")}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-500 mt-4 hover:bg-green-700
                       font-semibold py-2 rounded-lg transition-all dark:bg-green-500 dark:hover:bg-green-700 text-white "
          >
            Submit
          </button>

          <Separator />

          <h3 className="font-semibold text-black dark:text-white">
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
              initial={{ opacity: 0, y: -40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
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
