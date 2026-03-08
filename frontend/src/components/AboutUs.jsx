"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import "@google/model-viewer";
import Footer from "./Footer";
import { Quote, History, Award, Users, Globe, Leaf, Heart, ChevronRight } from "lucide-react";

const AboutUs = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <div className="bg-[#050505] text-white selection:bg-[#A37E2C] selection:text-black min-h-screen">
      <Header />

      {/* Hero Section: The Grand Reveal */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A37E2C] rounded-full blur-[160px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="z-10 mb-10 relative"
        >
          {/* @ts-ignore */}
          <model-viewer
            src="/golden_watch.glb"
            alt="The Signature Chronograph"
            auto-rotate
            rotation-per-second="30deg"
            camera-orbit="30deg 75deg auto"
            disable-zoom
            loading="eager"
            ar-modes="webxr scene-viewer quick-look"
            style={{ width: "380px", height: "380px" }}
            className="drop-shadow-[0_0_50px_rgba(163,126,44,0.3)] pointer-events-none"
          />
        </motion.div>

        <div className="z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-6xl md:text-9xl font-serif italic tracking-tighter mb-8 leading-tight"
          >
            The Art of Seconds
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ delay: 1, duration: 0.8 }}
            className="h-[1px] bg-[#A37E2C] mx-auto mb-8 shadow-[0_0_10px_#A37E2C]"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-[10px] md:text-xs uppercase tracking-[1em] text-[#A37E2C] font-bold"
          >
            Est. 2021 — Defined by Precision
          </motion.p>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-40 px-6 max-w-6xl mx-auto border-y border-white/5 bg-gradient-to-b from-transparent via-[#080808] to-transparent">
        <motion.div {...fadeInUp} className="text-center space-y-16">
          <Quote className="mx-auto text-[#A37E2C] opacity-40" size={48} />
          <h2 className="text-3xl md:text-6xl font-serif leading-[1.1] italic text-white/90">
            "A watch does not merely tell the time; it narrates the legacy of the wearer and the soul of the craftsman."
          </h2>
          <div className="grid md:grid-cols-2 gap-16 text-left pt-20 border-t border-white/5">
            <p className="text-gray-400 leading-relaxed text-lg font-light tracking-wide">
              In an era of fleeting digital trends, the House of Rajubhai stands as a sanctuary for 
              mechanical permanence. Our journey began in a modest workshop fueled by a single obsession: 
              the perfect calibration of weight, light, and movement.
            </p>
            <p className="text-gray-400 leading-relaxed text-lg font-light tracking-wide">
              We believe luxury is found in the invisible details—the hand-polished bevels, 
              the silent sweep of a second hand, and the surgical-grade steel that rests against your skin. 
              Each timepiece is a masterpiece of micro-engineering.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Vision & Mission */}
      <section className="py-32 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            { 
              title: "Our Vision", 
              desc: "To redefine the global horological landscape by proving that modern innovation and ancestral craftsmanship can coexist in a single case.",
              color: "text-[#A37E2C]"
            },
            { 
              title: "Our Mission", 
              desc: "To curate a collection that transcends seasons, providing our patrons with instruments of time that remain as relevant in fifty years as they are today.",
              color: "text-white"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10, borderColor: "rgba(163,126,44,0.3)" }}
              className="p-16 border border-white/5 bg-[#0A0A0A] rounded-none transition-all duration-700 ease-out"
            >
              <h3 className={`text-[10px] uppercase tracking-[0.6em] font-black mb-8 ${item.color}`}>
                {item.title}
              </h3>
              <p className="text-3xl font-serif text-gray-300 leading-relaxed italic">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <h2 className="text-[11px] tracking-[0.8em] uppercase text-center text-gray-500 mb-24 font-bold">The Pillars of Our House</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-16">
          {[
            { icon: <History size={24} />, title: "Heritage", text: "Honoring the centuries-old traditions of Swiss and Japanese horology." },
            { icon: <Award size={24} />, title: "Excellence", text: "Zero-tolerance for imperfection. Every watch undergoes 400 hours of testing." },
            { icon: <Leaf size={24} />, title: "Sustainability", text: "Sourcing ethically mined metals and recycled premium packaging." },
            { icon: <Globe size={24} />, title: "Global Reach", text: "A worldwide concierge service serving collectors across six continents." },
            { icon: <Users size={24} />, title: "Patronage", text: "Building a lifelong community through exclusive owner events." },
            { icon: <Heart size={24} />, title: "Passion", text: "Driven by the heartbeat of mechanical movement, not batteries." },
          ].map((val, i) => (
            <motion.div key={i} {...fadeInUp} className="group space-y-6">
              <div className="text-[#A37E2C] transition-transform duration-500 group-hover:scale-110">{val.icon}</div>
              <h3 className="text-2xl font-serif italic group-hover:text-[#A37E2C] transition-colors">{val.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light uppercase tracking-widest">{val.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-40 px-6 bg-[#080808]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-serif text-center mb-32 italic">The Evolution</h2>
          <div className="space-y-32 relative before:absolute before:left-[19px] md:before:left-1/2 before:top-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-[#A37E2C]/30 before:to-transparent">
            {[
              { year: "2021", event: "The Genesis", desc: "Rajubhai establishes the first atelier in Ahmedabad, focusing on bespoke custom builds." },
              { year: "2022", event: "The Heritage Collection", desc: "Launch of our signature gold-series movements, gaining traction in the luxury market." },
              { year: "2023", event: "Continental Expansion", desc: "Opening of flagship showrooms in Dubai and London, servicing a global clientele." },
              { year: "2026", event: "The Future of Horology", desc: "Integration of sustainable titanium alloys and the first in-house calibre movement." }
            ].map((step, i) => (
              <motion.div key={i} {...fadeInUp} className={`flex flex-col md:flex-row gap-8 relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-10 h-10 bg-[#050505] border border-[#A37E2C] rounded-full z-10 flex items-center justify-center text-[10px] font-bold text-[#A37E2C] shadow-[0_0_15px_rgba(163,126,44,0.2)]">
                  {step.year.slice(2)}
                </div>
                <div className={`pl-12 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                  <h4 className="text-[#A37E2C] text-[10px] uppercase tracking-[0.4em] font-black mb-3">{step.year}</h4>
                  <h3 className="text-3xl font-serif italic mb-4">{step.event}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-48 px-6 text-center relative overflow-hidden bg-black">
        <div className="z-10 relative space-y-12">
          <h2 className="text-6xl md:text-8xl font-serif italic leading-none">Begin Your Legacy</h2>
          <p className="text-gray-500 max-w-xl mx-auto font-light tracking-widest text-sm uppercase">
            Discover the instrument that reflects your journey and defines your time.
          </p>
          <motion.a
            whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
            whileTap={{ scale: 0.95 }}
            href="/products"
            className="inline-flex items-center gap-4 border border-[#A37E2C] text-[#A37E2C] text-[10px] tracking-[0.5em] uppercase font-bold py-6 px-14 transition-all duration-700"
          >
            Enter The Gallery <ChevronRight size={14} />
          </motion.a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;