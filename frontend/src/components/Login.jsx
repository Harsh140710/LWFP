import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // install lucide-react if not already
import {Link} from 'react-router-dom'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="w-[90%] sm:w-[350px] md:w-[450px] lg:w-[550px] bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <h2 className="font-bold text-3xl text-center mb-6 text-gray-900 dark:text-gray-100">
          Login
        </h2>

        <form className="flex flex-col gap-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border font-semibold border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700
                       text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg
                       placeholder:text-sm focus:outline-none focus:ring-1
                       focus:ring-gray-500"
          />

          {/* Password with Eye toggle */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
            className="w-full bg-gray-800 hover:bg-gray-700 text-white
                       font-semibold py-2 rounded-lg transition-all"
          >
            Submit
          </button>
        
        <h3 className="font-semibold">You don't have an account ? <Link to="/user/register" className="text-blue-800 font-bold">Register</Link></h3>
        </form>
      </div>
    </div>
  );
};

export default Login;
