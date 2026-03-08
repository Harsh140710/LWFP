"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Trash2, Star, X, CheckCircle2, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { toast } from "sonner"; // Switched to sonner to match previous pages

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
        headers: { Authorization: `Bearer ${token}` },
      });

      const ordersData = res.data.data || [];
      const tokenHeader = { headers: { Authorization: `Bearer ${token}` } };

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
      setError("Failed to load your collection history.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `${BASE_URL}/api/v1/orders/${orderId}/status`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
      toast.success("Order has been cancelled.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancellation failed.");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!rating) return toast.error("Please select a rating");
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${BASE_URL}/api/v1/reviews/${feedbackModal.product._id}`,
        { productId: feedbackModal.product._id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Feedback recorded in our registry.");
      setFeedbackModal({ open: false, product: null });
      setRating(0);
      setComment("");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to submit review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${BASE_URL}/api/v1/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review removed.");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  // THE LUXURY LOADER
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505]">
        <div className="w-12 h-12 border-t-2 border-[#A37E2C] rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] tracking-[0.5em] uppercase text-[#A37E2C] animate-pulse">
          Accessing Registry
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pt-32 pb-20">
        <div className="mb-12">
          <h2 className="text-[10px] tracking-[0.6em] uppercase font-bold text-[#A37E2C] mb-2">History</h2>
          <h1 className="text-4xl md:text-5xl font-serif italic">Your Collection</h1>
        </div>

        {error && (
          <div className="p-4 border border-red-900/50 bg-red-950/10 text-red-500 text-[11px] tracking-widest uppercase text-center mb-8">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20 border border-white/5 bg-white/[0.02]">
            <Package className="mx-auto mb-4 text-gray-700" size={40} strokeWidth={1} />
            <p className="text-gray-500 tracking-[0.2em] text-[11px] uppercase">No orders found in your archive.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((order) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={order._id}
                className="group border border-white/10 bg-transparent overflow-hidden"
              >
                {/* Order Meta Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-white/5 bg-white/[0.02] gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-bold">Reference Number</p>
                    <p className="text-xs font-mono tracking-tighter text-white">{order._id}</p>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-right">
                      <p className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-bold">Status</p>
                      <p className={`text-[10px] uppercase tracking-widest font-black ${
                        order.status === 'cancelled' ? 'text-red-500' : 'text-[#A37E2C]'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-bold">Value</p>
                      <p className="text-sm font-medium">₹{order.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 space-y-6">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="flex flex-col sm:flex-row gap-6">
                      <img
                        src={item.product.image || item.product.images?.[0]?.url || "/placeholder.png"}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                      <div className="flex-1 space-y-2">
                        <h4 className="font-serif italic text-lg leading-tight">{item.product.name || item.product.title}</h4>
                        <p className="text-[10px] tracking-widest text-gray-500 uppercase font-bold">
                          Qty: {item.quantity}  •  Unit: ₹{item.price.toLocaleString()}
                        </p>
                        
                        {/* Review Display */}
                        {item.userReview && (
                          <div className="mt-4 p-4 bg-white/[0.03] border-l border-[#A37E2C]">
                            <div className="flex items-center gap-2 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} className={i < item.userReview.rating ? "fill-[#A37E2C] text-[#A37E2C]" : "text-gray-800"} />
                              ))}
                            </div>
                            <p className="text-[11px] italic text-gray-400">"{item.userReview.comment}"</p>
                            <button 
                              onClick={() => handleDeleteReview(item.userReview._id)}
                              className="text-[8px] tracking-[0.2em] uppercase text-red-900 hover:text-red-500 mt-2 transition-colors flex items-center gap-1"
                            >
                              <Trash2 size={10} /> Remove Review
                            </button>
                          </div>
                        )}
                        
                        {order.status === "delivered" && !item.userReview && (
                          <button
                            onClick={() => setFeedbackModal({ open: true, product: item.product, orderId: order._id })}
                            className="text-[9px] tracking-[0.3em] uppercase border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all"
                          >
                            Provide Feedback
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer / Actions */}
                <div className="p-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-[9px] tracking-widest uppercase text-gray-500">
                      <Clock size={12} className="text-[#A37E2C]" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    {order.isPaid && (
                      <div className="flex items-center gap-2 text-[9px] tracking-widest uppercase text-green-700">
                        <CheckCircle2 size={12} /> Transaction Complete
                      </div>
                    )}
                  </div>
                  
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="text-[9px] tracking-[0.4em] uppercase text-red-800 hover:text-red-500 transition-colors font-bold"
                    >
                      Cancel Acquisition
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* LUXURY FEEDBACK MODAL */}
      <AnimatePresence>
        {feedbackModal.open && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setFeedbackModal({ open: false, product: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 p-8"
            >
              <h3 className="text-xl font-serif italic mb-2 text-center">Appraisal</h3>
              <p className="text-[9px] tracking-[0.3em] uppercase text-gray-500 text-center mb-8">
                For {feedbackModal.product.name}
              </p>

              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    size={28}
                    className={`cursor-pointer transition-all ${star <= rating ? "fill-[#A37E2C] text-[#A37E2C] scale-110" : "text-gray-800 hover:text-gray-600"}`}
                  />
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your experience with this piece..."
                className="w-full bg-transparent border border-white/10 p-4 text-xs tracking-wide focus:border-[#A37E2C] outline-none transition-colors min-h-[120px]"
              />

              <div className="flex flex-col gap-3 mt-8">
                <button 
                  onClick={handleSubmitFeedback}
                  className="w-full bg-[#A37E2C] text-black text-[10px] tracking-[0.4em] font-black uppercase py-4 hover:bg-[#F3E5AB] transition-colors"
                >
                  Submit Review
                </button>
                <button 
                  onClick={() => setFeedbackModal({ open: false, product: null })}
                  className="w-full text-[9px] tracking-[0.3em] uppercase text-gray-500 py-2"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}