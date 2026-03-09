import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ShoppingCart, HelpCircle, LogOut, User, MapPin, Phone, Mail, Edit3, Check, X, Camera } from "lucide-react";
import { UserDataContext } from "@/context/UserContext";
import Header from "../../components/Header";
import { toast } from "sonner";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editForm, setEditForm] = useState({ email: "", phoneNumber: "", address: "" });
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(res.data.data);
        setUser(res.data.data);
        setEditForm({
          email: res.data.data.email,
          phoneNumber: res.data.data.phoneNumber || "",
          address: res.data.data.address || "",
        });
      } catch (err) {
        toast.error("Session expired. Please sign in.");
        navigate("/user/login");
      }
    };
    fetchProfile();
  }, [setUser, navigate]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    try {
      setUploading(true);
      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/changeAvatar`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      if (res.data.success) {
        const newAvatar = res.data.data.avatar;
        setUserData((prev) => ({ ...prev, avatar: newAvatar }));
        setUser((prev) => ({ ...prev, avatar: newAvatar }));
        toast.success("Identity visual updated.");
      }
    } catch (err) {
      toast.error("Failed to update avatar.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/update-account`,
        { 
          email: editForm.email,
          phoneNumber: editForm.phoneNumber,
          address: editForm.address 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(res.data.data);
      setUser(res.data.data);
      setIsEditing(false);
      toast.success("Registry updated successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/user/login");
    toast.success("Signed out of the collection.");
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050505]">
        <div className="w-12 h-12 border-t-2 border-[#A37E2C] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-20">
        <div className="mb-16 flex justify-between items-end">
          <div>
            <h2 className="text-[10px] tracking-[0.6em] uppercase font-bold text-[#A37E2C] mb-2">Member Dashboard</h2>
            <h1 className="text-4xl md:text-6xl font-serif italic">The House of {userData.fullname.firstname}</h1>
          </div>
          
          <button 
            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
            className="flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase font-bold text-gray-500 hover:text-[#A37E2C] transition-colors"
          >
            {isEditing ? <><X size={14}/> Cancel</> : <><Edit3 size={14}/> Edit Profile</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: IDENTITY CARD */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-8">
            <div className="relative group w-fit mx-auto lg:mx-0">
              <img
                src={userData.avatar || "/default_Avatar.jpg"}
                alt="Avatar"
                className={`rounded-full h-64 w-64 object-cover border border-white/10 grayscale hover:grayscale-0 transition-all duration-700 ${uploading ? 'opacity-30' : ''}`}
              />
              {/* Gold border frame */}
              <div className="absolute inset-0 border border-[#A37E2C] translate-x-3 translate-y-3 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500" />
              
              {/* Avatar Upload Overlay - ONLY visible when isEditing is true */}
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  <Camera className="text-[#A37E2C]" size={32} />
                </label>
              )}

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-[#A37E2C] bg-black/40 rounded-full">
                  Updating...
                </div>
              )}
            </div>

            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 border border-white/5 bg-white/5 text-[#A37E2C]"><User size={16} strokeWidth={1} /></div>
                <div>
                  <p className="text-[9px] tracking-widest text-gray-500 uppercase font-bold">Identity</p>
                  <p className="text-sm font-medium">{userData.fullname.firstname} {userData.fullname.lastname}</p>
                </div>
              </div>

              {[
                { label: "Email Registry", key: "email", icon: <Mail size={16} strokeWidth={1} />, val: userData.email },
                { label: "Secure Contact", key: "phoneNumber", icon: <Phone size={16} strokeWidth={1} />, val: userData.phoneNumber || "Not provided" },
                { label: "Primary Residence", key: "address", icon: <MapPin size={16} strokeWidth={1} />, val: userData.address || "Global Citizen" },
              ].map((field) => (
                <div key={field.key} className="flex items-center gap-4">
                  <div className="p-2 border border-white/5 bg-white/5 text-[#A37E2C]">{field.icon}</div>
                  <div className="flex-1">
                    <p className="text-[9px] tracking-widest text-gray-500 uppercase font-bold">{field.label}</p>
                    {isEditing ? (
                      <input 
                        className="bg-transparent border-b border-white/10 w-full py-1 text-sm focus:border-[#A37E2C] outline-none transition-colors"
                        value={editForm[field.key]}
                        onChange={(e) => setEditForm({...editForm, [field.key]: e.target.value})}
                      />
                    ) : (
                      <p className="text-sm font-medium italic text-gray-400">{field.val}</p>
                    )}
                  </div>
                </div>
              ))}

              <AnimatePresence>
                {isEditing && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    onClick={handleUpdate}
                    className="w-full mt-4 py-4 bg-[#A37E2C] text-black text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-white transition-all duration-500 flex items-center justify-center gap-2"
                  >
                    <Check size={14}/> Save Changes
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: QUICK ACTIONS */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Order History", icon: <Package size={24}/>, path: "/orders/history", desc: "Review your acquired pieces" },
                { label: "Boutique Cart", icon: <ShoppingCart size={24}/>, path: "/cart", desc: "Items currently in selection" },
                { label: "Concierge", icon: <HelpCircle size={24}/>, path: "/help", desc: "Get assistance from our specialists" },
              ].map((item, idx) => (
                <button key={idx} onClick={() => navigate(item.path)} className="group p-8 border border-white/10 bg-transparent hover:border-[#A37E2C] transition-all duration-500 text-left flex flex-col justify-between h-48">
                  <div className="text-gray-400 group-hover:text-[#A37E2C] transition-colors uppercase tracking-[0.3em] text-[10px] flex justify-between items-start w-full">
                    {item.label} {item.icon}
                  </div>
                  <div>
                    <p className="text-lg font-serif italic mb-1">{item.label}</p>
                    <p className="text-[11px] text-gray-600 group-hover:text-gray-400 transition-colors uppercase tracking-widest font-bold">{item.desc}</p>
                  </div>
                </button>
              ))}

              <button onClick={handleLogout} className="group p-8 border border-white/10 bg-transparent hover:bg-red-950/20 hover:border-red-900 transition-all duration-500 text-left flex flex-col justify-between h-48">
                <div className="text-gray-400 group-hover:text-red-500 uppercase tracking-[0.3em] text-[10px] flex justify-between items-start w-full">Account <LogOut size={24}/></div>
                <div>
                  <p className="text-lg font-serif italic mb-1">Sign Out</p>
                  <p className="text-[11px] text-gray-600 uppercase tracking-widest font-bold">End current session</p>
                </div>
              </button>
            </div>

            <div className="mt-8 p-10 border border-[#A37E2C]/20 bg-[#A37E2C]/5 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#A37E2C] mb-2">Member Privilege</h3>
                 <p className="font-serif text-xl italic">"True elegance is not being noticed, it is being remembered."</p>
               </div>
               <div className="absolute top-0 right-0 p-4 text-[40px] opacity-10 font-serif">2026</div>
            </div>
          </motion.div>
        </div>
      </main>
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-[9px] tracking-[1em] uppercase text-gray-700 font-bold">Timeless Excellence</p>
      </footer>
    </div>
  );
}