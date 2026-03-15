import { motion } from "framer-motion";

const IngoLogo = () => (
  <p className="text-2xl font-bold text-transparent cursor-pointer">
    <motion.span
      animate={{
        backgroundPosition: [
          "0% 0%",
          "100% 0%",
          "100% 100%",
          "0% 100%",
          "0% 0%",
        ],
      }}
      transition={{
        duration: 7,
        ease: "linear",
        repeat: Infinity,
      }}
      style={{
        backgroundSize: "1000px 1000px",
        backgroundColor: "rgb(255, 50, 6)",
        backgroundImage:
          "radial-gradient(at 0% 100%, rgb(244, 63, 94) 0, transparent 50%), radial-gradient(at 90% 0%, rgb(100, 50, 85) 0, transparent 50%), radial-gradient(at 100% 100%, rgb(217, 70, 239) 0, transparent 50%), radial-gradient(at 0% 0%, rgb(249, 115, 22) 0, transparent 58%)",
      }}
      className="bg-clip-text bg-transparent"
    >
      ingo
    </motion.span>
  </p>
);

export default IngoLogo;
