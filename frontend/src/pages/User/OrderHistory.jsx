"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { toast } from "react-hot-toast";

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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Failed to load orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusSteps = ["pending", "processing", "delivered"];

  // Cancel order via backend
  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token");

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/orders/${orderId}/status`,
        { status: "cancelled" },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
      toast.success("Order cancelled successfully!");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to cancel order. Try again."
      );
    }
  };

  const getStepClass = (order, step) => {
    if (order.status === "cancelled") {
      return step === "pending" ? "step-primary" : "step-error";
    }

    return statusSteps.indexOf(step) <= statusSteps.indexOf(order.status)
      ? "step-primary"
      : "";
  };

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-6 min-h-screen bg-gray-50 dark:bg-black"
      >
        <h2 className="text-3xl font-semibold mb-6 text-black dark:text-white">
          My Orders
        </h2>

        {loading && (
          <div className="text-center text-black dark:text-white">
            Loading...
          </div>
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
              {/* Order Header */}
              <div className="flex justify-between mb-2 flex-wrap">
                <span className="font-semibold text-black dark:text-white">
                  Order ID: {order._id}
                </span>
                <span
                  className={`font-semibold text-sm px-2 py-1 rounded text-white ${
                    order.status === "pending"
                      ? "bg-yellow-500"
                      : order.status === "processing"
                      ? "bg-blue-500"
                      : order.status === "delivered"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Ordered At: {new Date(order.createdAt).toLocaleString()}
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center border-b pb-2"
                  >
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
                        {item.product.name || item.product.title}
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

              {/* DaisyUI Steps */}
              {order.status !== "cancelled" ? (
                <div className="mt-4 steps steps-vertical md:steps-horizontal">
                  {statusSteps.map((step) => (
                    <div
                      key={step}
                      className={`step ${getStepClass(order, step)}`}
                    >
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4">
                  <span className="text-red-500 font-semibold text-lg">
                    Cancelled
                  </span>
                </div>
              )}

              {/* Cancel Button */}
              {order.status === "pending" && (
                <div className="mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </Button>
                </div>
              )}

              {/* Paid info */}
              {order.isPaid && (
                <div className="mt-2 text-sm text-green-500">
                  Paid At: {new Date(order.paidAt).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
