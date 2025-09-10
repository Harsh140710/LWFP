"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import "@google/model-viewer";
import { useEffect, useState } from "react";

export default function FloatingWatch() {
  // const { scrollYProgress } = useScroll();

  // const x = useTransform(
  //   scrollYProgress,
  //   [0, 0.35, 0.40, 1],
  //   ["60vw", "33vw", "40vw", "40vw"]
  // );

  // const y = useTransform(
  //   scrollYProgress,
  //   [0, 0.2, 12, 1],
  //   ["40vh", "35vh", "70vh", "100vh"] // lifted higher at start
  // );

  // const scale = useTransform(
  //   scrollYProgress,
  //   [0, 0.35, 0.65, 1],
  //   [1, 1.3, 0.9, 0.6]
  // );

  // const opacity = useTransform(
  //   scrollYProgress,
  //   [0, 0.85, 1],
  //   [1, 1, 0]
  // );

  const { scrollYProgress } = useScroll();
  const [screen, setScreen] = useState("desktop");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setScreen("mobile");
      else if (window.innerWidth < 1024) setScreen("tablet");
      else setScreen("desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop (keep your original transforms)
  const desktopX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.40, 1],
    ["60vw", "33vw", "39.5vw", "40vw"]
  );

  const desktopY = useTransform(
    scrollYProgress,
    [0, 0.2, 12, 1],
    ["40vh", "35vh", "40vh", "100vh"] // lifted higher at start
  );

  const desktopScale = useTransform(
    scrollYProgress,
    [0, 0.9, 0.65, 0.5],
    [1, 1.3, 0.9, 0.6]
  );

  // Mobile (<640px)
  const mobileX = useTransform(
    scrollYProgress,
    [0.2, 0.35, 0.4, 1],
    ["25vw", "35vw", "3vw", "50vw"]
  );
  const mobileY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6, 1],
    ["18vh", "40vh", "28vh", "100vh"]
  );
  const mobileScale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.4, 1],
    [1.2, 1.5, 0.7, 1]
  );

  // Tablet (640px–1024px)
  const tabletX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.4, 1],
    ["35vw", "58vw", "36vw", "25vw"]
  );
  const tabletY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 1],
    ["20vh", "0vh", "40vh", "25vh"]
  );
  const tabletScale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.35, 1],
    [1, 1, 0.85, 0.8]
  );

  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0]);

  // 👇 Apply based on breakpoint
  const x =
    screen === "mobile" ? mobileX : screen === "tablet" ? tabletX : desktopX;
  const y =
    screen === "mobile" ? mobileY : screen === "tablet" ? tabletY : desktopY;
  const scale =
    screen === "mobile"
      ? mobileScale
      : screen === "tablet"
      ? tabletScale
      : desktopScale;

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
        zIndex: 100,
        pointerEvents: "none", // doesn’t block clicks
      }}
      transition={{ type: "spring", stiffness: 100, damping: 25 }}
    >
      <model-viewer
        src="/golden_watch.glb"
        alt="Floating Watch"
        auto-rotate
        // camera-controls
        camera-orbit="50deg 30deg auto"
        disable-zoom
        style={{ width: "280px", height: "280px" }}
      />
    </motion.div>
  );
}
