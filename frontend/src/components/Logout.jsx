import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner";
import { useEffect } from "react";
import { UserContext, UserDataContext } from "@/context/UserContext";
import { useContext } from "react";

const Logout = () => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const {user, setUser} = useContext(UserDataContext)
  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/users/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 200 || response.status === 201) {
          localStorage.removeItem("accessToken");
          
          setUser(null)
          toast.success("Logged out successfully");

          navigate("/home")
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Logout failed. Try again."
        );
      }
    };

    logoutUser();
  }, [navigate, token]);

  return <div>User Logged Out successfully...</div>;
};

export default Logout;
