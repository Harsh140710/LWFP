import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Payment () {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL || ""}/api/v1/admin/payments`,
        { withCredentials: true }
      );
      setPayments(res.data.data);
    } catch (err) {
      console.error("Fetch payments error", err);
      setError("Failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const markAsPaid = async (orderId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL || ""}/api/v1/admin/orders/${orderId}/mark-paid`,
        {
          id: orderId,
          status: "COMPLETED",
          update_time: new Date().toISOString(),
          email_address: "admin@timeless.com",
        },
        { withCredentials: true }
      );
      fetchPayments();
    } catch (err) {
      console.error("Mark as paid error", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gray-50 dark:bg-black"
    >
      <h2 className="text-3xl font-semibold text-black dark:text-white mb-6">
        Admin Payments
      </h2>

      {error && (
        <div className="p-4 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-lg shadow-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-black dark:text-white mt-10">
          Loading payments...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-black rounded-lg shadow-md dark:shadow-none">
            <thead>
              <tr className="bg-gray-200 dark:bg-black dark:border-b-2 text-black dark:text-white">
                <th className="p-4">Payment ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Total Price</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Paid At</th>
                <th className="p-4">Order Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b border-gray-300 dark:border-gray-700"
                >
                  <td className="p-4 text-black dark:text-white">{payment._id}</td>
                  <td className="p-4 text-black dark:text-white">
                    {payment.user
                      ? `${payment.user.name} (${payment.user.email})`
                      : "User Not Exist"}
                  </td>
                  <td className="p-4 text-black dark:text-white">
                    {payment.paymentMethod === "online" ? "Online" : "Cash on Delivery"}
                  </td>
                  <td className="p-4 text-black dark:text-white">
                    ₹{Number(payment.totalPrice).toFixed(2)}
                  </td>
                  <td
                    className={`p-4 font-semibold ${
                      payment.isPaid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {payment.isPaid ? "Paid" : "Pending"}
                  </td>
                  <td className="p-4 text-black dark:text-white">
                    {payment.paidAt
                      ? new Date(payment.paidAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-4 text-black dark:text-white">{payment.status}</td>
                  <td className="p-4">
                    {!payment.isPaid && payment.paymentMethod === "cod" && (
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={() => markAsPaid(payment._id)}
                      >
                        Mark as Paid
                      </button>
                    )}
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
