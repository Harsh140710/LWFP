"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/orders/my-orders`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/user/login");
        toast.error("Session expired. Please login again.");
      } else {
        setError("Failed to load orders.");
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-500";
      case "processing":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "cancelled":
      case "returned":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gray-50 dark:bg-black"
    >
      <h2 className="text-3xl font-semibold mb-6 text-black dark:text-white">
        My Orders
      </h2>

      {loading && (
        <div className="text-center text-black dark:text-white">Loading...</div>
      )}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {!loading && orders.length === 0 && (
        <div className="text-center text-black dark:text-white">
          You have no orders yet.
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-900 rounded-lg shadow p-4"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-black dark:text-white">
                Order ID: {order._id}
              </span>
              <span className={`font-semibold ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Ordered At: {new Date(order.createdAt).toLocaleString()}
            </div>

            {/* Order items */}
            <div className="space-y-2">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex items-center border-b pb-2">
                  <img
                    src={
                      item.product.image ||
                      item.product.images?.[0]?.url ||
                      "/placeholder.png"
                    }
                    alt={item.product.name || item.product.title}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-black dark:text-white">
                      {item.product.name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Quantity: {item.quantity} | ₹{item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment info */}
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Payment Method:{" "}
              {order.paymentMethod === "online"
                ? "Card/Online"
                : "Cash on Delivery"}
            </div>
            <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              Total: ₹{order.totalPrice.toFixed(2)}
            </div>

            {/* Timeline / status */}
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <div
                  className={`font-semibold ${getStatusStyle(order.status)}`}
                >
                  Status: {order.status}
                </div>
                {order.isPaid && (
                  <div className="ml-4 text-green-500">
                    Paid At: {new Date(order.paidAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
