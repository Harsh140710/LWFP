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
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    product: null,
    orderId: null,
  });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const res = await axios.get(`${BASE_URL}/api/v1/orders/my-orders`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      const ordersData = res.data.data || [];

      // Fetch each product's review by current user
      const tokenHeader = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };

      const updatedOrders = await Promise.all(
        ordersData.map(async (order) => {
          const orderWithReviews = { ...order };
          await Promise.all(
            orderWithReviews.orderItems.map(async (item) => {
              try {
                const r = await axios.get(
                  `${BASE_URL}/api/v1/reviews/${item.product._id}/my`,
                  tokenHeader
                );
                item.userReview = r.data.data || null;
              } catch {
                item.userReview = null;
              }
            })
          );
          return orderWithReviews;
        })
      );

      setOrders(updatedOrders);
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

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token");

      await axios.put(
        `${BASE_URL}/api/v1/orders/${orderId}/status`,
        { status: "cancelled" },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o
        )
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

  const handleSubmitFeedback = async () => {
    if (!rating) return toast.error("Please select a rating");

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${BASE_URL}/api/v1/reviews/${feedbackModal.product._id}`,
        {
          productId: feedbackModal.product._id,
          rating,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Thanks for your feedback!");
      setFeedbackModal({ open: false, product: null });
      setRating(0);
      setComment("");
      fetchOrders(); // refresh to show review
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${BASE_URL}/api/v1/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success("Review deleted successfully!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
    }
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
              className="bg-white dark:bg-black border-2 rounded-lg shadow p-4"
            >
              {/* Header */}
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

              {/* Items */}
              <div className="space-y-2">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row sm:items-center border-b pb-2"
                  >
                    <div className="flex items-center flex-1">
                      <img
                        src={
                          item.product.image ||
                          item.product.images?.[0]?.url ||
                          "/placeholder.png"
                        }
                        alt={item.product.name || item.product.title}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <div className="font-semibold text-black dark:text-white">
                          {item.product.name || item.product.title}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          Quantity: {item.quantity} | ₹{item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {order.status === "delivered" && !item.userReview && (
                      <Button
                        size="sm"
                        className="mt-2 sm:mt-0 sm:ml-2"
                        onClick={() =>
                          setFeedbackModal({
                            open: true,
                            product: item.product,
                            orderId: order._id,
                          })
                        }
                      >
                        Give Feedback
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Payment Info */}
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Payment Method:{" "}
                {order.paymentMethod === "online"
                  ? "Card/Online"
                  : "Cash on Delivery"}
              </div>
              <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                Total: ₹{order.totalPrice.toFixed(2)}
              </div>

              {order.isPaid && (
                <div className="mt-2 text-sm text-green-500">
                  Paid At: {new Date(order.paidAt).toLocaleString()}
                </div>
              )}

              {/* User Reviews (show below Paid At) */}
              {order.orderItems.map(
                (item) =>
                  item.userReview && (
                    <div
                      key={item.userReview._id}
                      className="mt-3 border-t pt-2 text-gray-800 dark:text-gray-200"
                    >
                      <h4 className="font-semibold mb-1">Your Review</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-lg">
                          {"★".repeat(item.userReview.rating)}
                        </span>
                        <p className="text-sm">{item.userReview.comment}</p>
                      </div>
                      <div className="flex justify-end mt-1">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDeleteReview(item.userReview._id)
                          }
                        >
                          Delete Review
                        </Button>
                      </div>
                    </div>
                  )
              )}

              {/* Steps */}
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

              {/* Cancel Order */}
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
            </div>
          ))}
        </div>
      </motion.div>

      {/* Feedback Modal (with blur background) */}
      {feedbackModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-black border-2 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Feedback for{" "}
              {feedbackModal.product.title || feedbackModal.product.name}
            </h3>

            {/* Rating */}
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-3xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-400"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your feedback..."
              className="w-full p-2 rounded dark:bg-black border-2 dark:text-white"
              rows="3"
            />

            <div className="flex justify-end mt-4 gap-2">
              <Button
                variant="ghost"
                className="border-2"
                onClick={() => setFeedbackModal({ open: false, product: null })}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitFeedback}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
