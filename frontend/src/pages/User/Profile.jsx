import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserDataContext } from "@/context/UserContext";
import Logout from "@/components/Logout";
import { toast } from "sonner";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data.data;

          // ✅ Avatar is already full Cloudinary URL, no need to prepend base URL
          const updatedUser = {
            ...data,
            avatar: data.avatar || "/default_Avatar.jpg",
          };

          setUserData(updatedUser);
          setUser(updatedUser);
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/user/login", { state: { from: "/user/profile" } });
        }
      }
    };

    fetchProfile();
  }, [navigate, setUser]);

  // ✅ Avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);

      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/changeAvatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const newAvatar = res.data.data.avatar; // ✅ already Cloudinary URL

        setUserData((prev) => ({ ...prev, avatar: newAvatar }));
        setUser((prev) => ({ ...prev, avatar: newAvatar }));
      }
    } catch (err) {
      alert("Failed to upload avatar");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-[#0B0B0D]">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:mt-10 flex items-center justify-center bg-gray-100 dark:bg-[#0B0B0D] px-4 py-8">
      <Card className="w-full max-w-lg p-6 shadow-lg rounded-2xl bg-white dark:bg-[#1A1A1D]">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <label className="relative cursor-pointer group">
            <img
              src={userData.avatar}
              alt="profile"
              className="rounded-full h-28 w-28 object-cover border-4 border-green-500 transition group-hover:opacity-70"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs bg-black/60 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
              {uploading ? "Uploading..." : "Change"}
            </span>
          </label>

          <h1 className="text-2xl md:text-3xl font-bold text-[#B48E57]">
            {userData?.fullname?.firstname} {userData?.fullname?.lastname}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            @{userData?.username}
          </p>
        </div>

        {/* Info Section */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold">Email:</span>
            <span className="text-gray-600 dark:text-gray-400 break-all">
              {userData?.email}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold">Phone:</span>
            <span className="text-gray-600 dark:text-gray-400">
              {userData?.phoneNumber || "Not Provided"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            className="flex-1 bg-[#B48E57] hover:bg-[#9F7A46] text-white"
            onClick={() => navigate("/user/edit")}
          >
            Edit Profile
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null)
              navigate("/user/login");
              toast.success("Logged Out Successfully")
            }}
          >
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
