import { motion, useScroll, useSpring } from "framer-motion";

const ScrollLine = () => {
  // detect scroll position
  const { scrollYProgress } = useScroll();

  // spring effect for smooth animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="h-[2px] bottom-1 fixed bg-[#B48E57] origin-left"
      style={{ scaleX }}
    />
  );
};

export default ScrollLine;
