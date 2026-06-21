import { motion } from "framer-motion";

export default function AwardRay({ isRayVisible, isInView, cardWidth, rayHeight, rayTopWidth }) {
  return (
    <motion.div
      className="relative z-10"
      style={{ width: cardWidth, height: rayHeight }}
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{
        clipPath:
          isRayVisible && isInView
            ? "inset(0% 0% 0% 0%)"
            : "inset(0% 0% 100% 0%)",
      }}
      transition={{
        duration: 0.3,
        ease: [0.33, 1, 0.68, 1], // Faster easeOutQuart
        delay: isRayVisible && isInView ? 0.05 : 0, // Very quick hide, near-instant show
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${cardWidth} ${rayHeight}`}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="stripePattern"
            patternUnits="userSpaceOnUse"
            width="7"
            height="6"
          >
            <image
              href="/horizontal-stripe.svg"
              x="0"
              y="0"
              width="7"
              height="6"
            />
          </pattern>
        </defs>

        <path
          d={`M${(cardWidth - rayTopWidth) / 2},0 L${(cardWidth + rayTopWidth) / 2},0 L${cardWidth},${rayHeight} L0,${rayHeight} Z`}
          fill="url(#stripePattern)"
          stroke="none"
          opacity="1"
        />

        <line
          x1={(cardWidth - rayTopWidth) / 2}
          y1="0"
          x2="0"
          y2={rayHeight}
          stroke="#3A3A3A"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <line
          x1={(cardWidth + rayTopWidth) / 2}
          y1="0"
          x2={cardWidth}
          y2={rayHeight}
          stroke="#3A3A3A"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
      </svg>
    </motion.div>
  );
}
