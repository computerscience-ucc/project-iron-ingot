import { motion } from "motion/react";

export default function LoadingOverlay({ className = "" }) {
  return (
    <div
      className={`absolute inset-0 z-10 flex items-center justify-center bg-[#181818]/80 ${className}`}
    >
      <motion.div
        className="w-8 h-8 rounded-full border-2 border-[#EFEFEF]/30 border-t-[#EFEFEF]/80"
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
