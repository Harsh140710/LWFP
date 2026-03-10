import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Clock, CheckCircle, Truck, XCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const statusConfig = {
  pending: { color: "text-yellow-500", icon: <Clock size={14} />, bg: "bg-yellow-500/10" },
  processing: { color: "text-blue-500", icon: <Package size={14} />, bg: "bg-blue-500/10" },
  shipped: { color: "text-purple-500", icon: <Truck size={14} />, bg: "bg-purple-500/10" },
  delivered: { color: "text-green-500", icon: <CheckCircle size={14} />, bg: "bg-green-500/10" },
  cancelled: { color: "text-red-500", icon: <XCircle size={14} />, bg: "bg-red-500/10" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/orders`, { withCredentials: true });
      setOrders(res.data.data);
    } catch (err) {
      toast.error("Failed to load the grand ledger.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/orders/${orderId}/status`,
        { status },
        { withCredentials: true }
      );

      // Ensure you access res.data.data.status based on your backend wrapper
      setOrders(prev => prev.map(o =>
        o._id === orderId ? { ...o, status: res.data.data.status } : o
      ));
      toast.success(`Order status moved to ${status}`);
    } catch (err) {
      toast.error("Status update protocol failed.");
    }
  };

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      {/* HEADER */}
      <div className="mb-10 border-b border-white/10 pb-6">
        <p className="text-[10px] tracking-[0.5em] text-[#A37E2C] font-bold uppercase">Executive Suite</p>
        <h1 className="text-3xl font-serif italic mt-2">Order Management</h1>
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
                <th className="p-5">Reference ID</th>
                <th className="p-5">Client Details</th>
                <th className="p-5">Valuation</th>
                <th className="p-5">Current Status</th>
                <th className="p-5">Placement Date</th>
                <th className="p-5 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => {
                const config = statusConfig[order.status?.toLowerCase()] || statusConfig.pending;
                return (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="p-5 font-mono text-gray-500 text-[10px]">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="p-5">
                      <p className="text-gray-200 font-medium">
                        {(() => {
                          if (order.customer?.firstname) {
                            return `${order.customer.firstname} ${order.customer.lastname || ""}`;
                          }

                          if (order.user?.fullname?.firstname) {
                            return `${order.user.fullname.firstname} ${order.user.fullname.lastname || ""}`;
                          }

                          if (order.user?.username) {
                            return order.user.username;
                          }

                          return "Guest Client";
                        })()}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {order.customer?.email || order.user?.email || "No Email Provided"}
                      </p>
                    </td>
                    <td className="p-5 text-[#A37E2C] font-semibold">₹{Number(order.totalPrice).toLocaleString()}</td>
                    <td className="p-5">
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit text-[10px] uppercase tracking-tighter ${config.bg} ${config.color}`}>
                        {config.icon} {order.status}
                      </span>
                    </td>
                    <td className="p-5 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-5 text-right">
                      <select
                        className="bg-black border border-white/10 text-[10px] uppercase p-2 focus:border-[#A37E2C] outline-none rounded-sm"
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
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}