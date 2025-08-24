// /animation/PageTransition.jsx
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.98 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 120,
        damping: 20,
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
