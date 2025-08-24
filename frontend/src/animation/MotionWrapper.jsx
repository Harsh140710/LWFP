// components/animations/MotionWrapper.jsx
import { motion } from "framer-motion";

export const slideVariants = {
  left: {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.4, ease: "easeIn" } },
  },
  right: {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.4, ease: "easeIn" } },
  },
};

export const MotionWrapper = ({ children, direction = "left" }) => {
  return (
    <motion.div
      variants={slideVariants[direction]}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-1/2 hidden lg:flex items-center justify-center p-10 bg-transparent"
    >
      {children}
    </motion.div>
  );
};
