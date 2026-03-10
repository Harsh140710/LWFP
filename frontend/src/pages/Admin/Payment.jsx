"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { CheckCircle, Clock, CreditCard, Banknote, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL || ""}/api/v1/admin/payments`,
        { withCredentials: true }
      );
      setPayments(res.data.data);
    } catch (err) {
      toast.error("Failed to load the financial ledger.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    const socket = io(import.meta.env.VITE_BASE_URL || "http://localhost:8000");
    socket.on("orderUpdated", () => fetchPayments());
    return () => { socket.disconnect(); };
  }, []);

  const markAsPaid = async (orderId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/orders/${orderId}/mark-paid`,
        {},
        { withCredentials: true }
      );
      toast.success("Transaction verified and updated.");
      fetchPayments();
    } catch (err) {
      toast.error("Verification protocol failed.");
    }
  };

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      {/* HEADER - Consistent with Order Management */}
      <div className="mb-10 border-b border-white/10 pb-6">
        <p className="text-[10px] tracking-[0.5em] text-[#A37E2C] font-bold uppercase">Executive Suite</p>
        <h1 className="text-3xl font-serif italic mt-2">Financial Ledger</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A37E2C]"></div>
        </div>
      ) : (
        <div className="bg-[#080808] border border-white/5 rounded-sm overflow-hidden shadow-2xl">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-white/[0.02] border-b border-white/5 text-[#A37E2C] uppercase text-[9px] tracking-[0.2em]">
              <tr>
                <th className="p-5">Transaction ID</th>
                <th className="p-5">Client</th>
                <th className="p-5">Method</th>
                <th className="p-5">Valuation</th>
                <th className="p-5">Status</th>
                <th className="p-5">Processed Date</th>
                <th className="p-5 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((payment) => (
                <motion.tr 
                  key={payment._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/[0.01] transition-colors"
                >
                  <td className="p-5 font-mono text-gray-500 text-[10px]">
                    #{payment._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="p-5">
                    <p className="text-sm text-gray-500">{payment.user?.email}</p>
                  </td>
                  <td className="p-5 text-gray-400 capitalize">
                    <div className="flex items-center gap-2">
                      {payment.paymentMethod === "card" ? <CreditCard size={14} /> : <Banknote size={14} />}
                      {payment.paymentMethod === "cod" ? "Cash" : payment.paymentMethod}
                    </div>
                  </td>
                  <td className="p-5 text-[#A37E2C] font-semibold">
                    ₹{Number(payment.totalPrice).toLocaleString()}
                  </td>
                  <td className="p-5">
                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit text-[10px] uppercase tracking-tighter ${
                      payment.isPaid ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }`}>
                      {payment.isPaid ? <CheckCircle size={12}/> : <Clock size={12}/>}
                      {payment.isPaid ? "Settled" : "Awaiting"}
                    </span>
                  </td>
                  <td className="p-5 text-gray-500">
                    {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "---"}
                  </td>
                  <td className="p-5 text-right">
                    {!payment.isPaid && payment.paymentMethod === "cod" && (
                      <button
                        onClick={() => markAsPaid(payment._id)}
                        className="px-4 py-2 border border-[#A37E2C] text-[#A37E2C] text-[10px] uppercase tracking-widest hover:bg-[#A37E2C] hover:text-black transition-all duration-300 rounded-sm"
                      >
                        Verify Payment
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}