import { motion, useScroll, useSpring } from "framer-motion";

const ScrollLine = () => {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed bottom-0 left-0 h-[3px] bg-[#B48E57] origin-left z-50"
      style={{ scaleX }}
    />
  );
};

export default ScrollLine;
