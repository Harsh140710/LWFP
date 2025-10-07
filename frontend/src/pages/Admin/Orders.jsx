import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL || ""}/api/v1/admin/orders`,
        { withCredentials: true }
      );
      setOrders(res.data.data);
    } catch (err) {
      console.error("Fetch orders error", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    console.log("Updating order:", orderId, "to status:", status);

    try {
      const res = await axios.patch(
        `${
          import.meta.env.VITE_BASE_URL || ""
        }/api/v1/admin/orders/${orderId}/status`,
        { status },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Status update response:", res.data);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: res.data.data.status }
            : order
        )
      );
    } catch (err) {
      console.error("Update status error", err.response?.data || err);
      setError("Failed to update status.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gray-50 dark:bg-black"
    >
      <h2 className="text-3xl font-semibold text-black dark:text-white mb-6">
        Admin Orders
      </h2>

      {error && (
        <div className="p-4 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-lg shadow-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-black dark:text-white mt-10">
          Loading orders...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-black rounded-lg shadow-md dark:shadow-none">
            <thead>
              <tr className="bg-gray-200 dark:bg-black text-black border-b-1 dark:border-gray-800 dark:text-white">
                <th className="p-4">Order ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Total Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-300 dark:border-gray-700"
                >
                  <td className="p-4 text-black dark:text-white">
                    {order._id}
                  </td>
                  <td className="p-4 text-black dark:text-white">
                    {order.user
                      ? `${order.user.name || "User"} (${order.user.email})`
                      : "User Not Exist"}
                  </td>
                  <td className="p-4 text-black dark:text-white">
                    ₹{Number(order.totalPrice).toFixed(2)}
                  </td>
                  <td className="p-4 text-black dark:text-white">
                    {order.status || "pending"}
                  </td>
                  <td className="p-4 text-black dark:text-white">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <select
                      className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white"
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
