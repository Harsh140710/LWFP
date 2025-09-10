import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";

const products = [
  {
    id: 1,
    title: "Land-Dweller 40",
    desc: "Oyster, 40 mm, platinum",
    modelUrl: "/golden_watch.glb", // replace with your .glb file path
  },
  {
    id: 2,
    title: "Sea-Master 42",
    desc: "Steel, 42 mm, ceramic bezel",
    modelUrl: "/golden_watch.glb",
  },
];

const Showcase = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0B0B0D] dark:to-[#1A1A1D] flex items-center justify-center px-6">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        loop
        className="w-full max-w-6xl"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <p className="text-sm font-medium text-green-600">
                  New model
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  {product.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {product.desc}
                </p>
                <button className="flex items-center gap-2 text-green-600 font-semibold hover:underline">
                  Discover this model <MoveRight size={18} />
                </button>
              </motion.div>

              {/* Right Watch Viewer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="flex justify-center"
              >
                <model-viewer
                  src={product.modelUrl}
                  alt={product.title}
                  auto-rotate
                  camera-controls
                  style={{ width: "350px", height: "350px" }}
                />
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Showcase;
