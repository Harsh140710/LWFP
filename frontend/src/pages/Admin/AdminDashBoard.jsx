import React, { useEffect, useState } from "react";
import axios from "axios";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Package, ShoppingBag, Banknote, Star, Trash2 } from "lucide-react";

const GOLD = "#A37E2C";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [sRes, pRes, rRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/stats`, config),
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/payments`, config),
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/reviews`, config)
      ]);

      setStats(sRes.data.data);
      setPayments(pRes.data.data || []);
      setReviews(rRes.data.data || []);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setTimeout(() => setLoading(false), 800); // Smooth transition
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <LuxuryLoader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-[#050505] min-h-screen text-white space-y-12 font-sans"
    >
      {/* Header */}
      <header className="flex justify-between items-end border-b border-white/10 pb-8">
        <div>
          <p className="text-[10px] tracking-[0.5em] text-[#A37E2C] font-bold uppercase">Executive Panel</p>
          <h1 className="text-4xl font-serif italic mt-2 tracking-tight">The Estate Ledger</h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">System Status</p>
          <p className="text-[11px] text-green-500 font-mono">● ENCRYPTED NODE 01</p>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={ShieldCheck} label="Client Registry" value={stats?.totalUsers} />
        <MetricCard icon={Package} label="Active Inventory" value={stats?.totalProducts} />
        <MetricCard icon={ShoppingBag} label="Total Acquisitions" value={stats?.totalOrders} />
        <MetricCard icon={Banknote} label="Net Asset Value" value={`₹${stats?.totalRevenue?.toLocaleString()}`} isGold />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Momentum */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm">
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-8 font-bold">Revenue Momentum</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlySales}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    stroke="#333"
                    fontSize={10}
                    tickFormatter={(m) => ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][m - 1]}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#000', border: `1px solid ${GOLD}`, fontSize: '10px' }} />
                  <Area type="monotone" dataKey="revenue" stroke={GOLD} fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <PaymentLedger transactions={payments} />
        </div>

        {/* Collection Mix & Feedback */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm">
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-8 text-center font-bold">Collection Mix</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.categoryDistribution}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="count"
                    nameKey="category"
                  >
                    {stats?.categoryDistribution?.map((_, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? GOLD : "#1A1A1A"} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-sm">
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-6 font-bold">Recent Feedback</h3>
            <div className="space-y-4">
              {reviews.slice(0, 3).map((rev) => (
                <div key={rev._id} className="border-l-2 border-[#A37E2C] pl-4 py-1">
                  <p className="text-[11px] text-gray-300 italic">"{rev.comment}"</p>
                  <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-tighter">— {rev.user?.name || "Anonymous"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Components
function MetricCard({ label, value, icon: Icon, isGold }) {
  return (
    <div className={`p-6 border ${isGold ? 'border-[#A37E2C]/30 bg-[#A37E2C]/5' : 'border-white/5 bg-[#0A0A0A]'} rounded-sm`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[9px] tracking-[0.2em] uppercase text-gray-500 font-bold">{label}</span>
        <Icon size={14} className={isGold ? 'text-[#A37E2C]' : 'text-gray-700'} />
      </div>
      <h2 className={`text-2xl font-serif ${isGold ? 'text-[#A37E2C]' : 'text-white'}`}>{value || 0}</h2>
    </div>
  );
}

function PaymentLedger({ transactions }) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-sm overflow-hidden">
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-6 font-bold">Transaction Ledger</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead className="border-b border-white/10 text-[#A37E2C] uppercase text-[8px] tracking-[0.2em]">
            <tr>
              <th className="pb-4">Client</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Method</th>
              <th className="pb-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 text-gray-300">
                  <div className="flex flex-col">
                    {/* <span>{tx.user?.username || "Guest"}</span> */}
                    {tx.user?.email && (
                      <span className="text-sm lowercase">{tx.user.email}</span>
                    )}
                  </div>
                </td>
                <td className="py-4 font-mono">₹{tx.totalPrice?.toLocaleString()}</td>
                <td className="py-4 text-gray-500 uppercase text-[9px]">{tx.paymentMethod}</td>
                <td className="py-4 text-right">
                  <span className={`px-2 py-1 rounded-full text-[8px] font-bold ${tx.isPaid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {tx.isPaid ? "PAID" : "UNPAID"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LuxuryLoader() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-t border-[#A37E2C] rounded-full"
      />
      <motion.p
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="mt-6 text-[10px] tracking-[0.5em] text-[#A37E2C] uppercase"
      >
        Initializing Ledger
      </motion.p>
    </div>
  );
}