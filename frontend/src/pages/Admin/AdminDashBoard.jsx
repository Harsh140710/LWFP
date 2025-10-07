import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const SummaryCard = ({ title, value }) => (
  <div className="rounded-2xl p-6 shadow-md dark:shadow-none bg-white dark:bg-black border transition-all">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-black dark:text-white">
        {title}
      </span>
    </div>
    <div className="text-2xl font-bold text-black dark:text-white mt-2">
      {value}
    </div>
  </div>
);

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57"];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL || ""}/api/v1/admin/stats`,
          { withCredentials: true }
        );
        setStats(res.data.data);
      } catch (err) {
        console.error("Admin stats fetch error", err);
        setError("Failed to load stats. Showing demo data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const monthlyChartData = (stats?.monthlySales || []).map((m) => ({
    name: `${m.year}-${String(m.month).padStart(2, "0")}`,
    revenue: m.revenue,
  }));

  const pieData = (stats?.categoryDistribution || []).map((d) => ({
    name: d.category,
    value: d.count,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8 bg-gray-50 dark:bg-black min-h-screen"
    >

      {error && (
        <div className="p-4 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-lg shadow-md">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Users" value={stats?.totalUsers || "—"} />
        <SummaryCard title="Total Products" value={stats?.totalProducts || "—"} />
        <SummaryCard title="Total Orders" value={stats?.totalOrders || "—"} />
        <SummaryCard
          title="Total Revenue"
          value={
            stats?.totalRevenue
              ? `₹${Number(stats.totalRevenue).toLocaleString()}`
              : "—"
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white dark:bg-black border rounded-2xl p-6 shadow-md dark:shadow-none">
          <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
            Revenue (Monthly)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white dark:bg-black border rounded-2xl p-6 shadow-md dark:shadow-none">
          <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
            Products by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Timeless Elegance Admin Dashboard © {new Date().getFullYear()}
      </div>
    </motion.div>
  );
}
