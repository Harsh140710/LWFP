import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const EmailRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [form, setForm] = useState({
    username: "",
    password: "",
    phoneNumber: "",
    fullname: { firstname: "", lastname: "" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("fullname")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        fullname: { ...prev.fullname, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) {
      toast.error("Phone number must be 10 digits (Indian format)");
      return;
    }

    if (!form.username || !form.fullname.firstname) {
      toast.error("Username and First Name are required");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/register`,
        {
          username: form.username.trim(),
          password: form.password,
          phoneNumber: form.phoneNumber.trim(),
          email: email.trim(),
          firstname: form.fullname.firstname.trim(), // <-- top-level
          lastname: form.fullname.lastname?.trim() || "", // <-- top-level
        }
      );

      toast.success("User created successfully");
      navigate("/user/login");
    } catch (err) {
    //   console.error(err.response?.data);
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen pb-10 flex items-center justify-center bg-[#F9FAFB] dark:bg-black">
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
        className="w-[90%] sm:w-[350px] md:w-[400px] lg:w-[450px] mt-25 bg-[#F9FAFB] dark:bg-[#111] rounded-2xl p-8 shadow-lg dark:shadow-none"
      >
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center mb-8 text-[#111827] dark:text-[#F9FAFB]">
          Complete Registration
        </h2>

        <p className="text-center font-semibold mb-6">
          Register your account with <b>{email}</b>
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <Label>Username</Label>
          <Input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <Label>Phone Number</Label>
          <Input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <Label>First Name</Label>
          <Input
            type="text"
            name="fullname.firstname"
            placeholder="First Name"
            onChange={handleChange}
            required
          />

          <Label>Last Name</Label>
          <Input
            type="text"
            name="fullname.lastname"
            placeholder="Last Name"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all"
          >
            Register
          </button>

          <Separator />

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/user/login")}
              className="text-blue-600 font-semibold cursor-pointer"
            >
              Log In
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailRegister;
