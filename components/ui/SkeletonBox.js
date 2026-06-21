import { motion } from "motion/react";

export default function SkeletonBox({
  width = "100%",
  height = "1em",
  borderRadius = "4px",
  className = "",
  style = {},
  ...props
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#242424] ${className}`}
      style={{ width, height, borderRadius, ...style }}
      {...props}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.15) 60%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
