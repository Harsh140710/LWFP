"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { formatPrice } from "@/utils/format";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2 } from "lucide-react";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// Stripe Initialization
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// --- Order Form Component ---
const OrderForm = ({
  products,
  userDetails,
  setUserDetails,
  paymentMethod,
  setPaymentMethod,
  setShowSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const subtotal = products.reduce((s, p) => s + (Number(p.price) || 0) * (p.quantity || 1), 0);

  const handleChange = (e) => setUserDetails({ ...userDetails, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userDetails.firstname || !userDetails.phone || !userDetails.address) {
      toast.error("Please provide essential delivery details.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const totalPrice = subtotal + 40;
      
      // Map items for the backend, ensuring image paths are preserved
      const orderItems = products.map((p) => ({
        product: p._id || p.productId,
        name: p.title || p.name || "Luxury Piece",
        quantity: Number(p.quantity) || 1,
        price: Number(p.price) || 0,
        image: p.images?.[0]?.url || p.image || "/placeholder.jpg",
      }));

      const payload = { customer: userDetails, orderItems, paymentMethod, shippingPrice: 40, taxPrice: 0, totalPrice };

      if (paymentMethod === "cod") {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/orders/addOrderItems`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShowSuccess(true);
      } else {
        const { data: clientSecretData } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/payment/create-payment-intent`,
          { amount: totalPrice * 100 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecretData.clientSecret, {
          payment_method: { card: cardElement },
        });

        if (error) throw new Error(error.message);

        if (paymentIntent.status === "succeeded") {
          await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/orders/addOrderItems`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setShowSuccess(true);
        }
      }
    } catch (err) {
      toast.error(err.message || "Transaction declined.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-2 bg-[#080808] border border-white/5 p-8 shadow-2xl">
      <h2 className="text-[10px] tracking-[0.5em] uppercase font-bold text-[#A37E2C] mb-8">Shipping & Registry</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required name="firstname" placeholder="First Name" value={userDetails.firstname} onChange={handleChange} className="bg-transparent border-b border-white/10 p-3 focus:border-[#A37E2C] outline-none transition-colors text-sm text-white" />
          <input required name="lastname" placeholder="Last Name" value={userDetails.lastname} onChange={handleChange} className="bg-transparent border-b border-white/10 p-3 focus:border-[#A37E2C] outline-none transition-colors text-sm text-white" />
          <input required name="phone" placeholder="Contact Number" value={userDetails.phone} onChange={handleChange} className="bg-transparent border-b border-white/10 p-3 focus:border-[#A37E2C] outline-none transition-colors text-sm text-white" />
          <input name="email" type="email" placeholder="Email Address" value={userDetails.email} onChange={handleChange} className="bg-transparent border-b border-white/10 p-3 focus:border-[#A37E2C] outline-none transition-colors text-sm text-white" />
        </div>
        <textarea required name="address" placeholder="Full Residence Address" value={userDetails.address} onChange={handleChange} className="w-full bg-transparent border-b border-white/10 p-3 focus:border-[#A37E2C] outline-none transition-colors text-sm h-24 resize-none text-white" />

        <div className="pt-6">
          <p className="text-[9px] tracking-widest text-gray-500 uppercase font-bold mb-4">Payment Selection</p>
          <div className="flex gap-8">
            {['card', 'cod'].map((method) => (
              <label key={method} className="flex items-center gap-3 cursor-pointer group">
                <input type="radio" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="accent-[#A37E2C]" />
                <span className={`text-[10px] uppercase tracking-widest ${paymentMethod === method ? 'text-white' : 'text-gray-500'} group-hover:text-[#A37E2C] transition-colors`}>
                  {method === 'card' ? 'Secure Card / Digital' : 'Cash on Delivery'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {paymentMethod === "card" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 border border-white/5 bg-white/[0.02] mt-4">
            <CardElement options={{ style: { base: { color: "#fff", fontSize: "14px", "::placeholder": { color: "#444" } } } }} />
          </motion.div>
        )}

        <button disabled={loading} className="w-full md:w-auto px-12 py-4 bg-[#A37E2C] text-black text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-white transition-all duration-700 disabled:opacity-50 mt-8">
          {loading ? "Processing Securely..." : "Complete Acquisition"}
        </button>
      </form>
    </div>
  );
};

// --- Main Page Component ---
const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [products] = useState(location.state?.products || []);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [userDetails, setUserDetails] = useState({ 
    firstname: "", lastname: "", email: "", phone: "", address: "", city: "", pincode: "" 
  });

  useEffect(() => {
    if (products.length === 0) {
      toast.error("Session expired or cart empty.");
      navigate("/products");
    }
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [navigate, products]);

  const subtotal = products.reduce((s, p) => s + (Number(p.price) || 0) * (p.quantity || 1), 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505] gap-6">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-white/5 rounded-full"></div>
          <div className="absolute inset-0 border-t-2 border-[#A37E2C] rounded-full animate-spin"></div>
        </div>
        <span className="text-[10px] tracking-[0.6em] uppercase text-[#A37E2C] font-bold animate-pulse">Authenticating Collection</span>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-gray-500 hover:text-[#A37E2C] mb-12 transition-colors">
          <ArrowLeft size={14} /> Adjust Selection
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          <Elements stripe={stripePromise}>
            <OrderForm 
              products={products} 
              userDetails={userDetails} 
              setUserDetails={setUserDetails} 
              paymentMethod={paymentMethod} 
              setPaymentMethod={setPaymentMethod} 
              setShowSuccess={setShowSuccess} 
            />
          </Elements>

          {/* Right Side: Order Summary */}
          <aside className="space-y-8">
            <div className="bg-[#080808] border border-white/5 p-6 shadow-2xl sticky top-32">
              <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#A37E2C] mb-6">Manifest Summary</h3>
              <div className="space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                {products.map((p, idx) => {
                  return (
                    <div key={idx} className="flex gap-4 group">

                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-widest font-bold text-white/90 line-clamp-1">{p.title || p.name}</p>
                        <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-tighter">Qty: {p.quantity || 1}</p>
                        <p className="text-sm font-serif italic text-[#A37E2C] mt-1">{formatPrice(p.price)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Table */}
              <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-[10px] tracking-widest uppercase text-gray-500">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[10px] tracking-widest uppercase text-gray-500">
                  <span>Concierge Delivery</span><span>{formatPrice(40)}</span>
                </div>
                <div className="flex justify-between text-xl font-serif italic pt-4 text-white border-t border-white/5 mt-2">
                  <span>Total</span><span>{formatPrice(subtotal + 40)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 px-2">
               <div className="flex items-center gap-4 text-gray-500">
                  <ShieldCheck size={18} className="text-[#A37E2C]" />
                  <span className="text-[9px] tracking-[0.4em] uppercase font-bold">Secure Encryption</span>
               </div>
               <div className="flex items-center gap-4 text-gray-500">
                  <Truck size={18} className="text-[#A37E2C]" />
                  <span className="text-[9px] tracking-[0.4em] uppercase font-bold">Insured Global Shipping</span>
               </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center z-[100] px-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              className="max-w-md w-full text-center space-y-8"
            >
              <div className="relative w-24 h-24 mx-auto">
                <CheckCircle2 size={96} className="text-[#A37E2C] absolute inset-0 animate-pulse" strokeWidth={1} />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-serif italic text-white">Acquisition Confirmed</h2>
                <p className="text-sm text-gray-400 tracking-wide leading-relaxed">
                  Your selection has been successfully registered in the House of Rajubhai. 
                  A concierge curator will reach out shortly via phone to finalize delivery.
                </p>
              </div>
              <button 
                onClick={() => navigate("/products")} 
                className="px-12 py-4 border border-[#A37E2C] text-[#A37E2C] text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-[#A37E2C] hover:text-black transition-all duration-700"
              >
                Return to Gallery
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #A37E2C; }
      `}</style>
    </div>
  );
};

export default Payment;