import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // install lucide-react if not already
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handelSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <div className="h-[calc(100vh-85px)] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-[90%] sm:w-[350px] md:w-[450px] lg:w-[550px] bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 dark:shadow-2xl">
        <h2 className="font-bold sm:text-3xl md:text-4xl lg:text-4xl text-2xl mb-8 text-gray-900 dark:text-gray-100 text-center">
          Login
        </h2>

        <form className="flex flex-col gap-4">
          <Label className="font-semibold text-lg">Enter your Email</Label>
          <Input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border font-semibold border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700
                       text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg
                       placeholder:text-sm focus:outline-none focus:ring-1
                       focus:ring-gray-500"
          />

          {/* Password with Eye toggle */}
          <Label className="font-semibold text-lg mt-2">Enter your Password</Label>
          <div className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border font-semibold border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700
                         text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg
                         placeholder:text-sm focus:outline-none focus:ring-1
                         focus:ring-gray-500 pr-10"
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
            className="w-full bg-black mt-4 hover:bg-gray-900 text-white
                       font-semibold py-2 rounded-lg transition-all dark:bg-blue-800"
          >
            Submit
          </button>

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
