import React from "react";
import Header from "../../components/Header";
import { motion, useScroll, useTransform } from "framer-motion";
import { MoveRight, Shield, Award, Droplets, Wind, Globe, History } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";

const Home = () => {
  const { scrollYProgress } = useScroll();
  
  // Parallax for a high-end feel
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  return (
    <div className="bg-[#050505] text-[#F9F6F0] selection:bg-[#A37E2C] selection:text-white font-sans overflow-x-hidden">
      <Header />
      
      {/* 1. CINEMATIC VIDEO HERO - THE ART OF PRECISION */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-70"
          >
            {/* Professional online watch B-roll reference */}
            <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-watch-mechanisms-and-details-close-up-34505-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />
        </motion.div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <span className="text-[#A37E2C] tracking-[0.8em] uppercase text-xs font-bold mb-6 block">
              ESTABLISHED 1994
            </span>
            <h1 className="text-[14vw] md:text-[9vw] font-serif leading-[0.85] tracking-tighter mb-12">
              Timeless<br/>
              <span className="italic bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA8B2E] bg-clip-text text-transparent">
                Excellence
              </span>
            </h1>
            <Link to="/products" className="group relative inline-block px-12 py-5 border border-[#A37E2C]/30 overflow-hidden transition-all duration-700">
              <span className="absolute inset-0 w-full h-full bg-[#A37E2C] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
              <span className="relative text-[10px] tracking-[0.5em] uppercase font-black group-hover:text-black">
                Enter the Boutique
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. THE PHILOSOPHY - CRISP IVORY SECTION */}
      <section className="py-64 px-6 md:px-24 bg-[#F9F6F0] text-[#1A1A1A]">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-12"
          >
            <h2 className="text-7xl md:text-8xl font-serif tracking-tighter leading-none text-black">
              The pursuit of <span className="italic">perfection</span> is infinite.
            </h2>
            <p className="text-2xl text-gray-700 font-light leading-relaxed max-w-xl">
              At the heart of every Timeless piece lies a commitment to the 500-hour mastery test. We operate at the intersection of Swiss micro-engineering and avant-garde aesthetic design.
            </p>
            <Link to="/about-us" className="inline-flex items-center gap-6 group text-[10px] font-black tracking-[0.4em] text-[#A37E2C]">
              OUR CRAFTSMANSHIP <MoveRight className="group-hover:translate-x-4 transition-transform duration-500" />
            </Link>
          </motion.div>
          
          <div className="relative group overflow-hidden shadow-[30px_30px_0px_0px_rgba(163,126,44,0.1)]">
            <img 
              src="https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80&w=1000" 
              alt="Craftsmanship" 
              className="w-full h-[700px] object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
            />
          </div>
        </div>
      </section>

      {/* 3. THE MOVEMENT - TECHNICAL MASTERY (Video Reveal) */}
      <section className="relative py-64 bg-black overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative h-[600px] w-full bg-[#111] overflow-hidden">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
               <source src="https://assets.mixkit.co/videos/preview/mixkit-mechanical-gears-of-a-clock-working-4318-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 border-[20px] border-black/80"></div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-10">
            <span className="text-[#A37E2C] tracking-[0.5em] font-bold text-xs uppercase">The Internal Caliber</span>
            <h3 className="text-5xl md:text-7xl font-serif tracking-tighter">Micro-Mechanical<br/><span className="italic">Symphony</span></h3>
            <p className="text-gray-400 font-light text-lg leading-relaxed">
              Our caliber 3235 movements utilize the Chronergy escapement, combining high energy efficiency with great dependability. It is resistant to strong magnetic fields and offers a power reserve of approximately 70 hours.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-10">
                <div className="border-l border-[#A37E2C]/30 pl-6">
                    <p className="text-3xl font-serif mb-1">±2 sec</p>
                    <p className="text-[9px] tracking-widest uppercase text-gray-500">Daily Accuracy</p>
                </div>
                <div className="border-l border-[#A37E2C]/30 pl-6">
                    <p className="text-3xl font-serif mb-1">28,800</p>
                    <p className="text-[9px] tracking-widest uppercase text-gray-500">Vibrations/Hour</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE COLLECTION - ROLLING GALLERY */}
      <section className="py-64 bg-[#050505]">
        <div className="px-6 md:px-24 mb-32 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-3xl">
            <span className="text-[#A37E2C] tracking-[0.6em] text-[10px] font-black uppercase mb-6 block">Our Curation</span>
            <h2 className="text-6xl md:text-8xl font-serif tracking-tighter">The 2026 Collection</h2>
          </div>
          <Link to="/products" className="text-[10px] font-black tracking-[0.3em] uppercase border-b border-[#A37E2C] pb-2 text-[#A37E2C]">View All Models</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-b border-white/5">
          {[
            { name: "Day-Date Eternal", ref: "DD-902", price: "$32,500", img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800" },
            { name: "Yacht-Master Gold", ref: "YM-110", price: "$28,900", img: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&q=80&w=800" },
            { name: "Sky-Dweller Stealth", ref: "SD-044", price: "$41,200", img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800" }
          ].map((watch, i) => (
            <motion.div 
              key={i}
              whileHover={{ backgroundColor: "rgba(163, 126, 44, 0.03)" }}
              className="group relative border-r border-white/5 p-16 flex flex-col items-center transition-colors duration-700"
            >
              <div className="overflow-hidden mb-12 relative aspect-[3/4] w-full">
                <img 
                  src={watch.img} 
                  alt={watch.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-in-out" 
                />
              </div>
              <div className="text-center">
                <p className="text-[#A37E2C] text-[10px] tracking-[0.3em] font-bold uppercase mb-3">Ref. {watch.ref}</p>
                <h3 className="text-3xl font-serif text-white group-hover:text-[#F3E5AB] transition-colors">{watch.name}</h3>
                <p className="mt-4 text-gray-500 font-light text-sm italic">{watch.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. HERITAGE TIMELINE - ADDING DEPTH */}
      <section className="py-64 bg-[#F9F6F0] text-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-center gap-4 mb-20">
                <History className="text-[#A37E2C]" size={32} />
                <span className="text-xs font-black tracking-[0.5em] uppercase">The Legacy Timeline</span>
            </div>
            
            <div className="space-y-40 relative">
                <div className="absolute left-[50%] top-0 w-[1px] h-full bg-[#A37E2C]/20 hidden md:block"></div>
                
                {[
                    { year: "1994", title: "The Foundation", desc: "Our first workshop opens in Geneva, dedicated to ultra-thin complications." },
                    { year: "2008", title: "The Deepsea Patent", desc: "Introduction of the Ringlock system, allowing watches to withstand 3,900 meters." },
                    { year: "2026", title: "Timeless Excellence", desc: "The launch of the perpetual caliber with AI-assisted chronometry." }
                ].map((item, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10`}
                    >
                        <div className="flex-1 text-center md:text-right">
                            <span className="text-8xl font-serif text-[#A37E2C]/10 block mb-4">{item.year}</span>
                            <h4 className="text-3xl font-serif mb-4">{item.title}</h4>
                            <p className="text-gray-500 font-light max-w-sm ml-auto">{item.desc}</p>
                        </div>
                        <div className="w-4 h-4 rounded-full bg-[#A37E2C] z-10 hidden md:block"></div>
                        <div className="flex-1"></div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* 6. LIFESTYLE ADVERTISING - THE AMBASSADOR */}
      <section className="relative h-[90vh] bg-black">
        <div className="absolute inset-0 grayscale opacity-50">
           <img 
             src="https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&q=80&w=1600" 
             className="w-full h-full object-cover"
             alt="Ambassador"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-6xl md:text-[6vw] font-serif italic mb-10 tracking-tight text-white/90">Define Your <span className="not-italic text-[#D4AF37]">Era</span>.</h2>
            <p className="max-w-xl text-gray-300 font-light text-lg mb-12">Worn by explorers who view time not as a limit, but as a canvas for legacy.</p>
            <Link to="/products" className="px-16 py-7 border border-white hover:bg-white hover:text-black transition-all duration-500 text-[10px] tracking-[0.5em] font-black">
                SHOP ALL MODELS
            </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;