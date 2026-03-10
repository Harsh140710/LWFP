"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trash2, MessageSquare, User, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Feedback() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/reviews`,
        { withCredentials: true }
      );
      setReviews(res.data?.data || []);
    } catch (err) {
      console.error("Fetch reviews error", err);
      toast.error("Failed to load client testimonials.");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Permanent removal of this testimonial?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/reviews/${id}`,
        { withCredentials: true }
      );
      setReviews((prev) => prev.filter((review) => review._id !== id));
      toast.success("Testimonial removed from record.");
    } catch (err) {
      toast.error("Protocol failed: review persists.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      {/* HEADER */}
      <div className="mb-10 border-b border-white/10 pb-6">
        <p className="text-[10px] tracking-[0.5em] text-[#A37E2C] font-bold uppercase">Executive Suite</p>
        <h1 className="text-3xl font-serif italic mt-2">Client Testimonials</h1>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A37E2C]"></div>
          <p className="text-[10px] tracking-widest text-gray-500 uppercase">Retrieving feedback...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-white/5 bg-[#080808]">
          <MessageSquare className="text-gray-700 mb-2" size={24} />
          <p className="text-gray-500 text-xs uppercase tracking-widest">No testimonials on record</p>
        </div>
      ) : (
        <div className="bg-[#080808] border border-white/5 rounded-sm overflow-hidden shadow-2xl">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-white/[0.02] border-b border-white/5 text-[#A37E2C] uppercase text-[9px] tracking-[0.2em]">
              <tr>
                <th className="p-5">Product Info</th>
                <th className="p-5">Client</th>
                <th className="p-5">Rating</th>
                <th className="p-5">Testimonial</th>
                <th className="p-5">Date</th>
                <th className="p-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {reviews.map((review) => (
                  <motion.tr
                    key={review._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`hover:bg-white/[0.01] transition-colors ${
                      review.rating <= 2 ? "bg-red-500/[0.03]" : ""
                    }`}
                  >
                    <td className="p-5">
                      <p className="text-sm text-gray-500 font-mono italic">
                        #{review._id?.slice(-6).toUpperCase()}
                      </p>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">{review.user?.email}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-1">
                        <span className={`font-semibold ${review.rating >= 4 ? "text-green-500" : review.rating <= 2 ? "text-red-500" : "text-[#A37E2C]"}`}>
                          {review.rating}
                        </span>
                        <Star size={10} className="fill-current" />
                      </div>
                    </td>
                    <td className="p-5 max-w-xs">
                      <p className="text-gray-400 italic line-clamp-2 leading-relaxed">
                        "{review.comment}"
                      </p>
                    </td>
                    <td className="p-5 text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => deleteReview(review._id)}
                        className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-300"
                        title="Remove Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}