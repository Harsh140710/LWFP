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
            <span style={{ fontFamily: "'Great Vibes', cursive" }} className="text-[#B48E57]">
              Luxury
            </span>
            , One Timeless Moment at a Time
          </motion.h1>

          <motion.p variants={itemVariant} className="text-[#111827] dark:text-[#FEFEFE] mb-5">
            Discover our curated collection of premium watches crafted for elegance and precision.
          </motion.p>

          <motion.div variants={itemVariant} className="mt-3 flex flex-row gap-3 w-full justify-center lg:justify-start">
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
              <span className="pr-2 text-[#B48E57] font-bold">Explore Collection</span>
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
      <div className="h-screen -mt-20">
        <h2 className="text-center font-bold lg:text-3xl md:text-2xl text-xl">Featured Collection</h2>
      </div>
    </div>
  );
};

export default Home;
