import React from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollAnimationWrapper } from "@/animation/ScrollAnimationWrapper";
import { containerVariant, itemVariant } from "@/animation/ScrollVarient";

const Watch = () => (
  <ScrollAnimationWrapper>
    <model-viewer
      src="/golden_watch.glb"
      alt="Golden Watch"
      auto-rotate
      camera-controls
      shadow-intensity="1"
      style={{ width: "100%", height: "300px", display: "block" }}
      camera-orbit="80deg 30deg auto"
      field-of-view="auto"
      disable-zoom
    ></model-viewer>
  </ScrollAnimationWrapper>
);

const Home = () => {
  return (
    <div>
      <Header />

      <div className="min-h-screen w-full lg:p-20 bg-[#F9FAFB] dark:bg-[#0B0B0D] flex flex-col lg:flex-row items-center justify-center gap-10">
        {/* ---- MOBILE/TABLET: Watch on TOP (no text under it) ---- */}
        <motion.div
          className="w-full lg:hidden flex justify-center order-1"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="w-full max-w-md px-4">
            <Watch />
          </div>
        </motion.div>

        {/* ---- TEXT SECTION ---- */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl order-2 lg:order-1"
        >
          <motion.h1
            variants={itemVariant}
            className="font-bold sm:text-2xl md:text-3xl lg:text-4xl text-2xl mb-5 text-[#111827] dark:text-[#F9FAFB]"
          >
            Redefining{" "}
            <span
              style={{ fontFamily: "'Great Vibes', cursive" }}
              className="text-[#B48E57]"
            >
              Luxury
            </span>
            &nbsp;, One Timeless Moment at a Time
          </motion.h1>

          <motion.p
            variants={itemVariant}
            className="text-[#111827] dark:text-[#FEFEFE] mb-5"
          >
            Discover our curated collection of premium watches crafted for
            elegance and precision.
          </motion.p>

          <motion.div
            variants={itemVariant}
            className="mt-3 flex flex-row gap-3 w-full justify-center lg:justify-start"
          >
            <Link
              to="/product"
              className="bg-[#B48E57] text-white uppercase px-4 py-2 rounded-xl font-bold min-w-[140px] text-center"
            >
              Shop Now
            </Link>

            <button
              type="button"
              className="relative border-2 border-[#B48E57] px-4 py-2 rounded-xl min-w-[140px] flex items-center justify-center hover:cursor-pointer"
            >
              <span className="pr-2 text-[#B48E57] font-bold">
                Explore Collection
              </span>
              <MoveRight className="size-[1.2rem] text-[#B48E57]" />
            </button>
          </motion.div>
        </motion.div>

        {/* ---- DESKTOP: Watch on the RIGHT (no text under it) ---- */}
        <motion.div
          className="hidden lg:flex w-1/2 justify-center order-2"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="w-full max-w-md">
            <Watch />
          </div>
        </motion.div>
      </div>

      {/* Featured Collection */}
      <div className="py-12 bg-[#F9FAFB] dark:bg-[#0B0B0D]">
        <h2 className="text-center font-bold lg:text-3xl md:text-2xl text-xl py-6 -mt-20 mb-20 underline">
          Featured Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-16">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative group flex flex-col border-2 border-[#B48E57] rounded-xl overflow-hidden"
            >
              {/* Watch Box */}
              <div className="bg-[#FEFEFE] dark:bg-[#0B0B0D] w-full aspect-square flex items-center justify-center">
                <model-viewer
                  src="/golden_watch.glb"
                  alt="Golden Watch"
                  auto-rotate
                  camera-controls
                  shadow-intensity="1"
                  style={{ width: "100%", height: "100%", maxHeight: "14rem" }}
                  camera-orbit="80deg 30deg auto"
                  field-of-view="auto"
                  disable-zoom
                ></model-viewer>
              </div>

              {/* Hover Overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center
          backdrop-blur-sm bg-black/30
          opacity-0 group-hover:opacity-80
          transition-all duration-500 ease-in-out"
              >
                <Link
                  to={"/products"}
                  className="text-[#FEFEFE] underline uppercase text-lg sm:text-xl font-bold"
                >
                  Collection
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 📌 Brand Values */}
      <section className="py-16 px-6 bg-[#F9FAFB] dark:bg-[#111827] text-center">
        <h2 className="text-3xl font-bold mb-8 text-[#111827] dark:text-white">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            "Swiss Movement",
            "Premium Materials",
            "Handcrafted",
            "2-Year Warranty",
          ].map((value, i) => (
            <div
              key={i}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md
              transition-all duration-300 ease-in-out
              hover:bg-[#B48E57] hover:text-[#FEFEFE] hover:cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-[#111827] dark:text-white group-hover:text-white">
                {value}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* 📌 Lifestyle Section */}
      <section
        className="py-16 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/lifestyle-bg.jpg')" }}
      >
        <div className="bg-black/50 absolute inset-0"></div>
        <div className="relative text-center text-white max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">More than a Timepiece</h2>
          <p className="text-lg">
            A legacy of style, precision, and timeless elegance.
          </p>
        </div>
      </section>

      {/* 📌 Testimonials */}
      <section className="py-16 px-6 bg-white dark:bg-[#0B0B0D] text-center">
        <h2 className="text-3xl font-bold mb-10 text-[#111827] dark:text-white">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            "This watch is the perfect balance of elegance and durability.",
            "Absolutely stunning design — I get compliments every day!",
            "Worth every penny. A true statement piece.",
          ].map((review, i) => (
            <div
              key={i}
              className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow"
            >
              <p className="italic text-gray-700 dark:text-gray-300">
                “{review}”
              </p>
              <h4 className="mt-4 font-bold text-[#B48E57]">
                - Customer {i + 1}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* 📌 Call to Action */}
      <section className="py-16 px-6 text-center bg-[#B48E57] text-white">
        <h2 className="text-3xl font-bold mb-4">Own Your Timeless Luxury</h2>
        <p className="mb-6">Discover exclusive watches crafted for elegance.</p>
        <Link
          to="/product"
          className="bg-white text-[#B48E57] px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          Shop Now
        </Link>
      </section>

      {/* 📌 Footer */}
      <footer className="py-8 px-6 bg-[#111827] text-gray-400 text-center">
        <p>
          &copy; {new Date().getFullYear()} Timeless Luxury. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
