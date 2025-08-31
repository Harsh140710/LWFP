import React, { useMemo } from "react";
import { motion } from "framer-motion";

const ServicesRing = () => {
  const services = [
    "Fast Delivery",
    "Secure Payment",
    "24/7 Support",
    "Premium Packaging",
    "Easy Returns",
    "Global Warranty",
    "Exclusive Offers",
    "Luxury Gift Wrap",
  ];

  // ✅ Different radius based on Tailwind breakpoints
  const config = useMemo(() => {
    if (window.innerWidth < 640) return { size: 320, radius: 120, bubble: 80 };
    if (window.innerWidth < 1024) return { size: 400, radius: 160, bubble: 90 };
    return { size: 500, radius: 210, bubble: 100 };
  }, []);

  return (
    <section className="py-20 bg-[#F9FAFB] dark:bg-[#0B0B0D] text-center overflow-hidden">
      <h2 className="text-3xl font-bold mb-16 text-[#111827] dark:text-white">
        Our Services
      </h2>

      <motion.div
        className="relative mx-auto"
        style={{ width: config.size, height: config.size }}
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* ✅ Infinite rotation wrapper */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        >
          {services.map((service, i, arr) => {
            const angle = (i / arr.length) * (2 * Math.PI);
            const center = config.size / 2.5;

            const x = Math.cos(angle) * config.radius + center;
            const y = Math.sin(angle) * config.radius + center;

            return (
              <motion.div
                key={i}
                className="absolute flex items-center justify-center
                           rounded-full bg-white dark:bg-[#111] dark:hover:bg-[#B48E57] shadow-md
                           hover:bg-[#B48E57] hover:text-white
                           transition-all duration-300"
                style={{
                  width: config.bubble,
                  height: config.bubble,
                  top: y,
                  left: x,
                  transform: "translate(-50%, -50%)", // ✅ perfect centering
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* ✅ Counter-rotate text so it stays upright */}
                <motion.span
                  className="text-xs sm:text-sm lg:text-base font-semibold text-center"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                >
                  {service}
                </motion.span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ServicesRing;
