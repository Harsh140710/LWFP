// src/animation/FloatingWatch.jsx
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import "@google/model-viewer";

export default function FloatingWatch() {
  const { scrollYProgress } = useScroll();

  // ✅ Adjusted keyframes so Hero position sits more natural
  // Hero: top-right but lifted higher (so not tilty)
  // Featured: centered + bigger
  // Services: moves down + shrinks + fade out

  const x = useTransform(
    scrollYProgress,
    [0, 0.35, 0.40, 1],
    ["60vw", "27vw", "40vw", "40vw"]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.2, 12, 1],
    ["40vh", "50vh", "70vh", "100vh"] // ✅ lifted higher at start
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [1, 1.3, 0.9, 0.6]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.85, 1],
    [1, 1, 0]
  );

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x,
        y,
        scale,
        opacity,
        zIndex: 10,
        pointerEvents: "none", // ✅ doesn’t block clicks
      }}
      transition={{ type: "spring", stiffness: 100, damping: 25 }}
    >
      <model-viewer
        src="/golden_watch.glb"
        alt="Floating Watch"
        auto-rotate
        camera-controls
        disable-zoom
        style={{ width: "280px", height: "280px" }}
      />
    </motion.div>
  );
}
