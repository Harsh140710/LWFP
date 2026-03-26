"use client";

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";

const PageNotFound = () => {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6 selection:bg-[#A37E2C] selection:text-black">
      <div className="max-w-xl w-full text-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <Compass size={80} className="text-[#A37E2C]/20 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-serif italic text-[#A37E2C]">404</span>
            </div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-[10px] tracking-[0.8em] uppercase font-bold text-[#A37E2C] mb-4">
            Lost in Time
          </h2>
          <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-6">
            The Piece You Seek <br /> Does Not Exist
          </h1>
          <p className="text-gray-500 text-sm tracking-widest leading-relaxed mb-10 max-w-md mx-auto uppercase">
            The record has been moved or the sequence has been broken. 
            Return to the vault to continue your journey.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/home"
            className="inline-flex items-center gap-3 px-8 py-4 border border-[#A37E2C] text-[#A37E2C] text-[10px] uppercase tracking-[0.4em] hover:bg-[#A37E2C] hover:text-black transition-all duration-500 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Return to Gallery
          </Link>
        </motion.div>

        {/* Decorative Background Element */}
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A37E2C]/30 to-transparent" />
      </div>
    </div>
  );
};

export default PageNotFound;