// src/pages/EditProfile.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "@/context/UserContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EditProfile = () => {
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: user?.fullname?.firstname || "",
    lastname: user?.fullname?.lastname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/updateAccount`,
        {
          fullname: { firstname: form.firstname, lastname: form.lastname },
          email: form.email,
          phoneNumber: form.phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        //   withCredentials: true,
        }
      );

      if (res.data.success) {
        setUser(res.data.data);
        alert("Profile updated successfully!");
        navigate("/user/profile");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0B0B0D] px-4 py-10">
      <Card className="w-full max-w-2xl p-8 shadow-xl rounded-2xl bg-white dark:bg-[#1A1A1D]">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-[#B48E57] mb-8">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First & Last Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-[#B48E57] focus:outline-none"
                placeholder="Enter first name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-[#B48E57] focus:outline-none"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-[#B48E57] focus:outline-none"
              placeholder="Enter email"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-[#B48E57] focus:outline-none"
              placeholder="Enter phone number"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#B48E57] hover:bg-[#9F7A46] text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/user/profile")}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProfile;
