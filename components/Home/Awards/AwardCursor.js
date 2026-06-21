import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@geist-ui/icons";

export default function AwardCursor({ hoveredSide, springX, springY }) {
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
        scale: hoveredSide ? 1 : 0,
        x: "-50%",
        y: "-50%",
        width: hoveredSide === "center" ? "11.2rem" : "7.2rem",
        height: hoveredSide === "center" ? "2.6rem" : "7.2rem",
        borderRadius: hoveredSide === "center" ? "6px" : "9999px",
      }}
      transition={{
        scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        width: { duration: 0.3, ease: "easeOut" },
        height: { duration: 0.3, ease: "easeOut" },
        borderRadius: { duration: 0.3, ease: "easeOut" },
        x: { duration: 0 },
        y: { duration: 0 },
      }}
    >
      <div className="w-full h-full bg-gradient-to-r from-[#FF3538] to-[#DE2528] flex items-center justify-center text-white shadow-xl overflow-hidden px-2 py-1 gap-1">
        {/* left is physically on the right, right is physically on the left */}
        {hoveredSide === "left" && <ArrowRight size={44} strokeWidth={2.2} />}
        {hoveredSide === "right" && <ArrowLeft size={44} strokeWidth={2.2} />}
        {hoveredSide === "center" && (
          <>
            <span className="font-semibold text-[1.05rem] whitespace-nowrap">
              See all awards
            </span>
            <ArrowRight size={20} strokeWidth={2.4} />
          </>
        )}
      </div>
    </motion.div>
  );
}
