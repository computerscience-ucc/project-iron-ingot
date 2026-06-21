import { motion } from "motion/react";
import Image from "next/image";
import { ArrowRight } from "@geist-ui/icons";

export default function LatestOnCursor({ hoveredCard, springX, springY }) {
  return (
    <motion.div
      className="hidden lg:block"
      style={{
        position: "fixed",
        left: springX,
        top: springY,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
      initial={{ scale: 0, x: "-50%", y: "-50%" }}
      animate={{
        scale: hoveredCard ? 1 : 0,
        x: "-50%",
        y: "-50%",
        width: hoveredCard === "blog" ? "8.4rem" : "7.2rem",
        height: hoveredCard === "blog" ? "8.4rem" : "7.2rem",
        borderRadius: "9999px",
      }}
      transition={{
        scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        width: { duration: 0.3, ease: "easeOut" },
        height: { duration: 0.3, ease: "easeOut" },
        x: { duration: 0 },
        y: { duration: 0 },
      }}
    >
      <div className="w-full h-full bg-gradient-to-r from-[#FF3538] to-[#DE2528] flex items-center justify-center text-white shadow-xl overflow-hidden relative">
        {/* Blog Cursor Content */}
        <motion.div
          className="absolute inset-0 p-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: hoveredCard === "blog" ? 1 : 0,
            scale: hoveredCard === "blog" ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: "none" }}
        >
          <motion.div
            className="relative w-full h-full translate-x-[-0.34rem] translate-y-[-0.4rem]"
            animate={
              hoveredCard === "blog"
                ? { rotate: [0, -5, 8, -5, 8, 0] }
                : { rotate: 0 }
            }
            transition={{
              delay: 0.35,
              duration: 0.7,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 1.5,
            }}
          >
            <Image
              src="/mascot/curious-bot.png"
              alt="Curious Bot"
              fill
              className="object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Article Cursor Content */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: hoveredCard === "article" ? 1 : 0,
            scale: hoveredCard === "article" ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: "none" }}
        >
          <ArrowRight size={44} strokeWidth={2.2} />
        </motion.div>
      </div>
    </motion.div>
  );
}
