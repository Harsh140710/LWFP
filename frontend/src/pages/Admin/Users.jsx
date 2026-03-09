import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Search, Shield, UserCheck } from "lucide-react";
import { toast } from "sonner";
import api from "@/utils/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/v1/users");
        // Ensure we find the array regardless of nesting (data.data or data.users)
        const userData = res.data?.data || res.data?.users || res.data || [];
        setUsers(Array.isArray(userData) ? userData : []);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Registry Access Denied");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    // 1. Confirm with the admin
    if (!id || !window.confirm(`Expunge ${name || 'this record'} from the registry?`)) return;

    try {
      // 2. Call the backend (Check if your route is /api/v1/users/:id)
      await api.delete(`/api/v1/users/${id}`);

      // 3. Update the UI locally without refreshing
      setUsers((prev) => prev.filter((u) => u._id !== id));

      toast.success("Identity purged from archive.");
    } catch (err) {
      console.error("Deletion failed:", err);
      toast.error(err.response?.data?.message || "Purge protocol failed.");
    }
  };

  // 1. SAFE FILTER: Prevents crash if a user object itself is null
  const filteredUsers = Array.isArray(users)
    ? users.filter((u) => {
      if (!u) return false;
      const query = search.toLowerCase();
      const name = String(u.fullname || u.username || "").toLowerCase();
      const email = String(u.email || "").toLowerCase();
      return name.includes(query) || email.includes(query);
    })
    : [];

  if (loading) return <LuxuryLoader />;

  return (
    <div className="p-8 bg-black min-h-screen text-white space-y-8 font-sans">
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <p className="text-[10px] tracking-[0.5em] text-[#A37E2C] font-bold uppercase">Security Protocol</p>
          <h1 className="text-3xl font-serif italic mt-2 tracking-tight">Client Registry</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            placeholder="Search Registry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#0A0A0A] border border-white/10 pl-10 pr-4 py-2 text-[12px] rounded-sm focus:border-[#A37E2C] outline-none transition-all w-64"
          />
        </div>
      </div>

      <div className="bg-[#080808] border border-white/5 rounded-sm overflow-hidden">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-white/[0.02] border-b border-white/5 text-[#A37E2C] uppercase text-[8px] tracking-[0.2em]">
            <tr>
              <th className="p-5 font-bold">Client Identity</th>
              <th className="p-5 font-bold">Contact Details</th>
              <th className="p-5 font-bold">Privileges</th>
              <th className="p-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user?._id || Math.random()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/[0.01] transition-colors group"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1A1A1A] border border-white/10 flex items-center justify-center rounded-full text-[#A37E2C]">
                        {/* 2. SAFE CHAR: Prevents crash if name is missing */}
                        {String(user?.fullname || user?.username || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p>{user.name?.firstname} {user.name?.lastname}</p>
                        {/* 3. SAFE SLICE: Prevents crash if _id is missing */}
                        <p className="text-[9px] text-gray-600 font-mono">ID: {user?._id ? String(user._id).slice(-6) : "------"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-gray-400">{user?.email || "No Email recorded"}</td>
                  <td className="p-5">
                    <span className={`flex items-center gap-1 uppercase text-[9px] font-bold ${user?.role === 'admin' ? 'text-[#A37E2C]' : 'text-gray-500'}`}>
                      {user?.role === 'admin' ? <Shield size={10} /> : <UserCheck size={10} />}
                      {user?.role || "user"}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => handleDelete(user?._id, user?.name?.firstname || user?.username)}
                      className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-all p-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LuxuryLoader() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-t-2 border-[#A37E2C] border-r-2 border-r-transparent rounded-full" />
      <p className="mt-6 text-[10px] tracking-[0.5em] text-[#A37E2C] uppercase animate-pulse">Accessing Archive</p>
    </div>
  );
}