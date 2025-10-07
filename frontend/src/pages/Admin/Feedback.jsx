import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Feedback() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL || ""}/api/v1/admin/reviews`,
        { withCredentials: true }
      );
      setReviews(res.data.data);
    } catch (err) {
      console.error("Fetch reviews error", err);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL || ""}/api/v1/admin/reviews/${id}`,
        { withCredentials: true }
      );

      setReviews((prev) => prev.filter((review) => review._id !== id));
    } catch (err) {
      console.error("Delete review error", err);
      alert("Failed to delete review.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gray-50 dark:bg-black"
    >
      <h2 className="text-3xl font-semibold text-black dark:text-white mb-6">
        Feedbacks (Reviews)
      </h2>

      {error && (
        <div className="p-4 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-lg shadow-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-black dark:text-white mt-10">
          Loading reviews...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-black rounded-lg shadow-md dark:shadow-none">
            <thead>
              <tr className="bg-gray-200 dark:border-b-2 dark:bg-black text-black dark:text-white">
                <th className="p-4">Review ID</th>
                <th className="p-4">Product</th>
                <th className="p-4">User</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Comment</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className={`border-b border-gray-300 dark:border-gray-700 ${
                    review.rating <= 2
                      ? "bg-red-100 dark:bg-red-800" // Bad feedback highlight
                      : ""
                  }`}
                >
                  <td className="p-4 text-black dark:text-white">
                    {review._id}
                  </td>
                  <td className="p-4 text-black dark:text-white">
                    {review.product}
                  </td>
                  <td className="p-4 text-black dark:text-white">
                    {review.user
                      ? `${review.user.name} (${review.user.email})`
                      : "User Not Exist"}
                  </td>
                  <td className="p-4 text-black dark:text-white">
                    {review.rating}
                  </td>
                  <td className="p-4 text-black dark:text-white">
                    {review.comment}
                  </td>
                  <td className="p-4 text-black dark:text-white">
                    {new Date(review.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => deleteReview(review._id)}
                    >
                      Delete
                    </button>
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
