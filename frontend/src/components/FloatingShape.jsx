import { motion } from "framer-motion";
import '../components/FloatingShape.css';

const FloatingShape = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      className={`floating-shape ${color} ${size}`}
      style={{ top, left }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
      aria-hidden='true'
    />
  );
};

export default FloatingShape;