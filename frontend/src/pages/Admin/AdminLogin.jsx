"use client";
import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { UserDataContext } from "@/context/UserContext";
import Header from "@/components/Header";
import api from "@/utils/api";
import { useEffect } from "react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Login request
      const response = await api.post("/api/v1/users/login", {
        email,
        password,
      });

      const { user, accessToken, refreshToken } = response.data.data;

      if (user.role !== "admin") {
        toast.error("You are not authorized as admin");
        return;
      }

      // 2. Save tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 3. Save user in context
      setUser(user);

      toast.success("Welcome Admin!");

      const redirectTo = location.state?.from || "/admin/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await api.get("/api/v1/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setUser(data.data); // save in context
      } catch (err) {
        console.error(err);
      }
    };

    if (localStorage.getItem("accessToken")) {
      fetchCurrentUser();
    }
  }, []);

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-black p-8 rounded-xl shadow-lg w-full max-w-md border"
        >
          <h2 className="text-2xl font-bold mb-6 text-black text-center dark:text-white">
            Admin Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-black dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border mb-6 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-black dark:text-white"
            required
          />

          <button className="w-full bg-green-500 hover:bg-green-700 text-white py-3 rounded-lg transition">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminLogin;
