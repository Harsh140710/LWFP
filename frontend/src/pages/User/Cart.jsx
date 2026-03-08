"use client";

import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = (item) => {
    navigate("/payment", {
      state: { products: [{ ...item, quantity: item.quantity || 1 }] },
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-6 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-[10px] tracking-[0.6em] uppercase font-bold text-[#A37E2C] mb-2">
              Your Selection
            </h2>
            <h1 className="text-4xl md:text-6xl font-serif italic">The Shopping Bag</h1>
          </div>
          
          {cart.length > 0 && (
            <button 
              onClick={clearCart}
              className="text-[9px] tracking-[0.3em] uppercase text-gray-500 hover:text-red-800 transition-colors border-b border-transparent hover:border-red-800 pb-1 w-fit"
            >
              Clear Entire Collection
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-40 border border-white/5 bg-white/[0.02]"
          >
            <ShoppingBag className="mx-auto mb-6 text-gray-800" size={48} strokeWidth={1} />
            <p className="text-gray-500 tracking-[0.2em] text-[11px] uppercase mb-8">Your bag is currently empty.</p>
            <Link 
              to="/products" 
              className="inline-block text-[10px] tracking-[0.4em] uppercase border border-[#A37E2C] text-[#A37E2C] px-10 py-4 hover:bg-[#A37E2C] hover:text-black transition-all"
            >
              Browse Collection
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* LEFT: ITEM LIST */}
            <div className="flex-1 space-y-8">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={item._id}
                    className="group flex flex-col md:flex-row gap-8 pb-8 border-b border-white/5"
                  >
                    {/* Product Image */}
                    <div className="relative w-full md:w-48 aspect-square overflow-hidden border border-white/10 bg-white/[0.02]">
                      <img
                        src={item.images?.[0]?.url || "/placeholder.jpg"}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-[9px] tracking-[0.3em] uppercase text-[#A37E2C] font-bold mb-1">
                              {item.brand || "Exclusive"}
                            </p>
                            <h3 className="text-xl md:text-2xl font-serif italic text-white group-hover:text-[#A37E2C] transition-colors">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-lg font-light tracking-tight">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6 mt-8">
                        {/* Elegant Quantity Switcher */}
                        <div className="flex items-center border border-white/10 h-10">
                          <button 
                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                            className="px-3 hover:text-[#A37E2C] transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-[11px] font-bold border-x border-white/10">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-3 hover:text-[#A37E2C] transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-6">
                          <button 
                            onClick={() => handleBuyNow(item)}
                            className="text-[9px] tracking-[0.3em] uppercase font-bold text-white hover:text-[#A37E2C] flex items-center gap-2 transition-colors"
                          >
                            Immediate Checkout <ArrowRight size={12} />
                          </button>
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-500 hover:text-red-800 transition-colors"
                          >
                            <Trash2 size={16} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* RIGHT: SUMMARY */}
            <aside className="lg:w-[380px]">
              <div className="sticky top-32 p-8 border border-white/10 bg-white/[0.02]">
                <h2 className="text-[10px] tracking-[0.4em] uppercase font-bold text-white mb-8 border-b border-white/10 pb-4">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[11px] tracking-widest text-gray-400 uppercase">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] tracking-widest text-gray-400 uppercase">
                    <span>Logistics</span>
                    <span>₹40.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-10">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-gray-500">Total Investment</span>
                  <span className="text-2xl font-light">₹{(totalPrice + 40).toLocaleString()}</span>
                </div>

                <button
                  onClick={() => navigate("/payment", { state: { cart } })}
                  className="w-full bg-white text-black py-5 text-[10px] tracking-[0.4em] uppercase font-black hover:bg-[#A37E2C] transition-all duration-500 shadow-2xl"
                >
                  Secure Checkout
                </button>
                
                <p className="text-[8px] text-center text-gray-600 uppercase tracking-[0.2em] mt-6">
                  Complimentary Insured Shipping on all orders
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}