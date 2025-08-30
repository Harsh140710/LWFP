// src/animation/ScrollAnimationWrapper.js
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

export const ScrollAnimationWrapper = ({ children }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.2 1"], // animate when visible
  });

  // Only animate opacity & Y, no scale
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }} // ❌ removed scale
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};
