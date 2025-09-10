import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, MoveRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserDataContext } from "@/context/userContext";
import axios from "axios";
import { toast } from "sonner";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { setUserData } = useContext(UserDataContext);

  // ✅ Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.fullname.firstname.trim()) {
      newErrors.firstname = "Firstname is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    if (errors[name]) validate();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
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
        const { user, refreshToken } = response.data.data;

        setUserData(user);
        localStorage.setItem("token", refreshToken);

        toast.success(`Welcome, ${user?.fullname?.firstname || "User"}!`);
        navigate("/products");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Username or email already exists. Please try another.");
      } else if (err.response?.status === 400) {
        toast.error(
          err.response.data?.message || "Please fill all required fields."
        );
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="flex lg:mt-10 items-center justify-center min-h-screen px-6 py-10 bg-[#F9FAFB] dark:bg-[#0B0B0D]">
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
        className="w-full max-w-lg bg-transparent p-8 rounded-xl"
      >
        <h2 className="font-bold text-3xl mb-6 text-[#111827] dark:text-[#F9FAFB] text-center">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Firstname + Lastname */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="flex-1">
              <Label className="font-semibold text-lg text-black dark:text-white">
                Firstname
              </Label>
              <Input
                type="text"
                name="firstname"
                value={formData.fullname.firstname}
                onChange={handleChange}
                placeholder="Firstname"
                className="text-black dark:text-white"
              />
              {errors.firstname && (
                <p className="text-red-500 text-sm">{errors.firstname}</p>
              )}
            </div>
            <div className="flex-1">
              <Label className="font-semibold text-lg text-black dark:text-white">
                Lastname
              </Label>
              <Input
                type="text"
                name="lastname"
                value={formData.fullname.lastname}
                onChange={handleChange}
                placeholder="Lastname"
                className="text-black dark:text-white"
              />
            </div>
          </div>

          {/* Username + Phone */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="flex-1">
              <Label className="font-semibold text-lg text-black dark:text-white">
                Username
              </Label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="text-black dark:text-white"
              />
            </div>
            <div className="flex-1">
              <Label className="font-semibold text-lg text-black dark:text-white">
                Phone Number
              </Label>
              <Input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({ ...prev, phoneNumber: value }));
                  if (errors.phoneNumber) validate();
                }}
                maxLength={10}
                placeholder="Phone number"
                className="text-black dark:text-white"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="font-semibold text-lg text-black dark:text-white">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="text-black dark:text-white"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label className="font-semibold text-lg text-black dark:text-white">
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="pr-10 text-black dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 mt-4 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <Separator />

          <p className="font-semibold text-center text-black dark:text-white">
            Already have an account?{" "}
            <Link to="/user/login" className="text-blue-700 font-bold">
              Log In
            </Link>
          </p>

          {/* Continue with Email */}
          <div className="relative w-full flex items-center justify-center">
            <Link
              to={"/user/email-register"}
              className="w-full text-center bg-green-500 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all"
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
      </motion.div>
    </div>
  );
};

export default Register;
