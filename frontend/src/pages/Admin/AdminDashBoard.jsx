"use client";

import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    categories: 0,
  });

  const [chartData] = useState([
    { name: "Jan", users: 50, sales: 400 },
    { name: "Feb", users: 80, sales: 300 },
    { name: "Mar", users: 65, sales: 200 },
    { name: "Apr", users: 90, sales: 278 },
    { name: "May", users: 75, sales: 189 },
    { name: "Jun", users: 100, sales: 239 },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found");

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all data concurrently
        const [resUsers, resProducts, resCategories, resOrders] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/users`, {
              headers,
            }),
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/products`),
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/category`), // endpoint corrected
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/orders/all`, {
              headers,
            }),
          ]);

        // Update state
        setStats({
          users: resUsers.data?.data?.length || 0,
          products: resProducts.data?.data?.length || 0,
          categories: resCategories.data?.data?.length || 0,
          orders: resOrders.data?.data?.length || 0,
          revenue: resOrders.data?.data?.reduce(
            (acc, order) => acc + parseFloat(order.totalPrice || 0),
            0
          ),
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        toast.error(
          err.response?.data?.message || "Failed to fetch dashboard data"
        );
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="flex-1 p-6 dark:bg-black dark:text-white">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <Card className="bg-green-100 dark:bg-green-700">
          <CardHeader>Users</CardHeader>
          <CardContent>{stats.users}</CardContent>
        </Card>
        <Card className="bg-blue-100 dark:bg-blue-700">
          <CardHeader>Products</CardHeader>
          <CardContent>{stats.products}</CardContent>
        </Card>
        <Card className="bg-purple-100 dark:bg-purple-700">
          <CardHeader>Orders</CardHeader>
          <CardContent>{stats.orders}</CardContent>
        </Card>
        <Card className="bg-yellow-100 dark:bg-yellow-700">
          <CardHeader>Revenue</CardHeader>
          <CardContent>${stats.revenue.toLocaleString()}</CardContent>
        </Card>
        <Card className="bg-pink-100 dark:bg-pink-700">
          <CardHeader>Categories</CardHeader>
          <CardContent>{stats.categories}</CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-white dark:bg-black">
        <CardHeader>Monthly Users & Sales</CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#4ade80"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#60a5fa"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Outlet />
    </main>
  );
}
