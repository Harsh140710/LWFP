import React from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import { MotionRightWrapper } from "@/animation/MotionRightWrapper";
import { MoveRight } from "lucide-react";
const Home = () => {
  return (
    <div>
      <Header />

      <div className="h-screen w-full lg:p-20 bg-[#F9FAFB] dark:bg-[#0B0B0D] flex items-center">
        <div className="flex flex-col m-15">
          <h1 className="font-bold sm:text-2xl md:text-3xl md:w-full lg:text-4xl w-full text-2xl md:text-center lg:text-center xl:text-left text-center mb-5 justify-center text-[#111827] dark:text-[#F9FAFB]">
            Redefining{" "}
            <span
              style={{ fontFamily: "'Great Vibes', cursive" }}
              className="text-[#B48E57]"
            >
              Luxury
            </span>
            &nbsp;, One Timeless Moment at a Time
          </h1>

          <p className="text-[#111827] dark:text-[#FEFEFE]">
            Discover our curated collection of premium watches crafted for
            elegance and precision
          </p>

          <div className="mt-5 flex gap-3">
            <button className="bg-[#B48E57] text-white uppercase hover:cursor-pointer px-3 py-2 rounded-xl font-bold">
              Shop Now
            </button>

            <button type="button" className="border-2 relative border-[#B48E57] px-5 py-3 rounded-xl hover:cursor-pointer">
              <span className="pr-9 text-[#B48E57] font-bold">Explore Collection</span>
              <MoveRight className="absolute size-[1.2rem] right-6 top-1/2 -translate-y-1/2 text-[#B48E57]"/>
            </button>
          </div>
        </div>

        <MotionRightWrapper>
          <div className="hidden lg:flex w-3/4 items-center justify-center bg-transparent">
            <div className="text-center max-w-md">
              <motion.img
                key="register-form"
                initial={{ opacity: 0, y: -40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 22,
                  duration: 0.5,
                }}
                src="/logo-2-removebg-preview.png"
                alt="Product"
                className="w-96 mx-auto mb-6 dark:invert"
              />
              <h2 className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">
                Explore Our Collection
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Timeless elegance crafted just for you. Discover the best
                watches and accessories.
              </p>
            </div>
          </div>
        </MotionRightWrapper>
      </div>
    </div>
  );
};

export default Home;
