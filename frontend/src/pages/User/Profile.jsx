import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "@/context/UserContext";
import { toast } from "sonner";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(res.data.data);
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, [setUser]);

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-black">
        <p className="text-lg text-gray-700 dark:text-gray-200">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-15 bg-gray-100 dark:bg-black px-4 py-6 lg:flex lg:mx-auto lg:gap-6">
      {/* User Info */}
      <div className="bg-white dark:bg-black dark:border-2 rounded-2xl p-6 shadow-md flex flex-col items-center mb-6 lg:mb-0 lg:w-1/3">
        <img
          src={userData.avatar || "/default_Avatar.jpg"}
          alt="Avatar"
          className="rounded-full h-28 w-28 object-cover border-4 border-green-500 mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          {userData.fullname.firstname} {userData.fullname.lastname}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">@{userData.username}</p>

        <div className="mt-4 w-full space-y-2 text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-semibold">Email:</span> {userData.email}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {userData.phoneNumber || "Not Provided"}
          </div>
          <div>
            <span className="font-semibold">Address:</span> {userData.address || "Not Provided"}
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="bg-white dark:bg-black dark:border-2 rounded-2xl p-6 shadow-md lg:w-2/3 flex flex-col gap-4">
        {/* <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Links</h2> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/orders/history")}
            className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition flex flex-col items-center justify-center gap-2"
          >
            📦 Order History
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition flex flex-col items-center justify-center gap-2"
          >
            🛒 My Cart
          </button>
          <button
            onClick={() => navigate("/help")}
            className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md transition flex flex-col items-center justify-center gap-2"
          >
            ❓ Help Center
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              setUser(null);
              navigate("/user/login");
              toast.success("Logged out successfully");
            }}
            className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition flex flex-col items-center justify-center gap-2"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
