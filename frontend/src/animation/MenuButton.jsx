import { motion } from "framer-motion";

const MenuButton = ({ open }) => (
  <div className="relative w-8 h-8 flex flex-col justify-center items-center">
    <motion.div
      initial={false}
      animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
      className="w-6 h-0.5 bg-white dark:bg-[#FEFEFE] mb-1"
    />
    <motion.div
      initial={false}
      animate={open ? { opacity: 0 } : { opacity: 1 }}
      className="w-6 h-0.5 bg-white  dark:bg-[#FEFEFE] mb-1"
    />
    <motion.div
      initial={false}
      animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
      className="w-6 h-0.5 bg-white dark:bg-[#FEFEFE]"
    />
  </div>
);

export default MenuButton;
