"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

export default function ProfileInfo({ userData, setUser }) {
  const [uploading, setUploading] = useState(false);

  if (!userData)
    return <p className="text-black dark:text-white">Loading profile...</p>;

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
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      if (res.data.success) {
        const newAvatar = res.data.data.avatar;
        setUser((prev) => ({ ...prev, avatar: newAvatar }));
        toast.success("Avatar updated successfully");
      }
    } catch (err) {
      toast.error("Failed to update avatar");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center gap-4">
        <label className="relative cursor-pointer group">
          <img
            src={userData.avatar || "/default_Avatar.jpg"}
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

        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {userData.fullname.firstname} {userData.fullname.lastname}
        </h1>
        <p className="text-gray-400">@{userData.username}</p>

        <div className="mt-4 w-full space-y-2 text-black dark:text-white">
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Phone:</strong> {userData.phoneNumber || "Not Provided"}
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full">
          <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
            Edit Profile
          </Button>
        </div>
      </div>
    </Card>
  );
}
