import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, MoveRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "./ui/separator";
import { MotionWrapper } from "@/animation/MotionWrapper";
import { UserDataContext } from "@/context/userContext";
import axios from "axios";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullname: {
      firstname: "",
      lastname: "",
    },
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstname" || name === "lastname") {
      setFormData((prev) => ({
        ...prev,
        fullname: {
          ...prev.fullname,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      firstname: formData.fullname.firstname,
      lastname: formData.fullname.lastname,
      username: formData.username,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/v1/users/register`,
      newUser
    );

    if (response.status === 200 || response.status === 201) {
      const data = response.data
      const { user, refreshToken } = response.data.data;
      setUserData(user)
      localStorage.setItem("token", refreshToken)

      navigate("/home")
    }
    // console.log(response.data);
    // console.log("Registration Successful");
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row bg-[#F9FAFB] dark:bg-[#0B0B0D]">
      {/* Left Section */}
      <MotionWrapper>
        <div className="hidden lg:flex w-3/4 items-center justify-center p-10 bg-transparent">
          <div className="text-center max-w-md">
            <img
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
      </MotionWrapper>

      {/* Right Section */}
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
        className="flex w-full lg:w-1/2 items-center justify-center overflow-y-auto"
      >
        <div className="w-[90%] sm:w-[350px] md:w-[450px] bg-transparent p-8">
          <h2 className="font-bold text-3xl mb-6 text-[#111827] dark:text-[#F9FAFB] text-center">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Firstname + Lastname */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="flex-1">
                <Label className="font-semibold text-lg">Firstname</Label>
                <Input
                  type="text"
                  name="firstname"
                  value={formData.fullname.firstname}
                  onChange={handleChange}
                  placeholder="Firstname"
                  required
                  className="mt-2 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1D]
                  text-gray-900 dark:text-gray-100 rounded-lg"
                />
              </div>
              <div className="flex-1">
                <Label className="font-semibold text-lg">Lastname</Label>
                <Input
                  type="text"
                  name="lastname"
                  value={formData.fullname.lastname}
                  onChange={handleChange}
                  placeholder="Lastname"
                  className="mt-2 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1D]
                  text-gray-900 dark:text-gray-100 rounded-lg"
                />
              </div>
            </div>

            {/* Username + Phone */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="flex-1">
                <Label className="font-semibold text-lg">Username</Label>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="mt-2 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1D]
                  text-gray-900 dark:text-gray-100 rounded-lg"
                />
              </div>
              <div className="flex-1">
                <Label className="font-semibold text-lg">Phone Number</Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="mt-2 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1D]
                  text-gray-900 dark:text-gray-100 rounded-lg"
                />
              </div>
            </div>

            {/* Email + Password */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="flex-1">
                <Label className="font-semibold text-lg">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="mt-2 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1D]
                  text-gray-900 dark:text-gray-100 rounded-lg"
                />
              </div>
              <div className="flex-1">
                <Label className="font-semibold text-lg">Password</Label>
                <div className="relative mt-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1D]
                    text-gray-900 dark:text-gray-100 rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#B48E57] hover:bg-[#A37E4D] text-white font-semibold py-2 rounded-lg transition-all"
            >
              Create Account
            </button>

            <Separator />

            <p className="font-semibold text-center">
              You have an account?{" "}
              <Link to="/user/login" className="text-blue-700 font-bold">
                Log In
              </Link>
            </p>

            {/* Continue with Email */}
            <div className="relative w-full flex items-center justify-center">
              <Link
                to={"/user/email-register"}
                className="w-full text-center bg-[#B48E57] hover:bg-[#A37E4D] text-white font-semibold py-2 rounded-lg transition-all"
              >
                Continue with Email?
              </Link>
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
              >
                <MoveRight size={20} />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
