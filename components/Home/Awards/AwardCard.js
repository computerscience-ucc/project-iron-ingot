import { motion } from "framer-motion";
import Image from "next/image";

const positionConfig = {
  center: { scale: 1, x: "0%", zIndex: 20 },
  left: { scale: 0.82, x: "20%", zIndex: 10 },
  right: { scale: 0.82, x: "-20%", zIndex: 10 },
};

const springTransition = { type: "spring", damping: 30, stiffness: 180 };

const formatDescription = (text) => {
  if (!text) return null;
  const boldRegex =
    /([\uD835\uDC00-\uD835\uDC19\uD835\uDC1A-\uD835\uDC33\uD835\uDFCE-\uD835\uDFD7]+)/gu;

  const diffUpper = 0x1d400 - 0x41;
  const diffLower = 0x1d41a - 0x61;
  const diffDigit = 0x1d7ce - 0x30;

  const normalize = (str) => {
    let result = "";
    for (const char of str) {
      const code = char.codePointAt(0);
      if (code >= 0x1d400 && code <= 0x1d419)
        result += String.fromCharCode(code - diffUpper);
      else if (code >= 0x1d41a && code <= 0x1d433)
        result += String.fromCharCode(code - diffLower);
      else if (code >= 0x1d7ce && code <= 0x1d7d7)
        result += String.fromCharCode(code - diffDigit);
      else result += char;
    }
    return result;
  };

  const parts = text.split(boldRegex);
  return parts.map((part, i) => {
    if (part.match(boldRegex)) {
      return (
        <strong key={i} className="font-bold text-white">
          {normalize(part)}
        </strong>
      );
    }
    return part;
  });
};

export default function AwardCard({
  award,
  position,
  onClick,
  onHover,
  isCursorHidden,
  isInView,
  isSwitching,
  cardWidth,
  cardHeight,
}) {
  const isCenter = position === "center";
  const config = positionConfig[position];

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => onHover(isCenter ? "center" : position)}
      onMouseLeave={() => onHover(null)}
      className={`absolute top-0 ${isCursorHidden ? "cursor-none" : "cursor-pointer"
      }`}
      animate={{ scale: config.scale, x: config.x }}
      transition={springTransition}
      style={{ width: cardWidth, height: cardHeight, zIndex: config.zIndex }}
    >
      {/* Main Card Wrapper */}
      <motion.div
        className="relative w-full overflow-hidden"
        initial={{ height: 2, opacity: 0 }}
        animate={{ height: isInView ? cardHeight : 2, opacity: isInView ? 1 : 0 }}
        transition={{
          duration: 0.55,
          ease: [0.33, 1, 0.68, 1],
          delay: isInView ? 0.4 : 0,
          opacity: { duration: 0.05, delay: isInView ? 0.4 : 0 },
        }}
      >
        {/* The Actual Card Container */}
        <div className="w-full h-full bg-[#242424] flex relative overflow-hidden">
          {/* Absolute border overlay to prevent clipping and stay above the image */}
          <div className="absolute inset-0 border border-[#5B5B5B] pointer-events-none z-30" />
          {/* Background Image from Sanity */}
          {award.headerImage && (
            <Image
              src={award.headerImage}
              alt={award.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 340px, (max-width: 1024px) 640px, 1000px"
              priority={isCenter}
            />
          )}

          {/* Text Overlay Gradient (Only covering the bottom) */}
          <div className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent z-10" />

          {/* Content Area */}
          <div className="flex-1 px-5 py-3 lg:p-6 flex flex-col justify-end relative z-20">
            {isCenter && (
              <motion.div
                key={award._id}
                initial="initial"
                animate={isInView ? "animate" : "initial"}
                variants={{
                  animate: {
                    transition: {
                      staggerChildren: 0.15,
                      delayChildren: isSwitching ? 0.3 : 0.9, // Fast reveal on switch, wait for hologram on scroll (0.4s delay + 0.55s * 0.9 duration)
                    },
                  },
                }}
              >
                <div className="overflow-hidden mb-2 md:mb-2 lg:mb-3">
                  <motion.h3
                    variants={{
                      initial: { y: "110%" },
                      animate: { y: 0 },
                    }}
                    transition={{
                      duration: 0.95,
                      ease: [0.22, 1, 0.36, 1], // Smooth easeOutQuart
                    }}
                    className="text-base md:text-xl lg:text-[1.35rem] font-semibold text-white tracking-tight leading-tight line-clamp-2"
                  >
                    {award.title}
                  </motion.h3>
                </div>

                <div className="hidden lg:block overflow-hidden mb-2 md:mb-3 lg:mb-4">
                  <motion.p
                    variants={{
                      initial: { y: "110%" },
                      animate: { y: 0 },
                    }}
                    transition={{
                      duration: 0.95,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-[#EFEFEF] text-[0.7rem] md:text-xs lg:text-[0.9rem] leading-relaxed font-normal [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden"
                  >
                    {formatDescription(award.description)}
                  </motion.p>
                </div>

                <div className="overflow-hidden">
                  <motion.div
                    variants={{
                      initial: { y: "110%" },
                      animate: { y: 0 },
                    }}
                    transition={{
                      duration: 0.95,
                      ease: [0.22, 1, 0.36, 1], // Smooth easeOutQuart
                    }}
                    className="flex flex-wrap items-center gap-2 overflow-hidden h-6 md:h-7 lg:h-8"
                  >
                    {award.category && (
                      <div className="shrink-0 px-1.5 py-0.5 md:px-2 bg-[#333333] text-[#EFEFEF] text-[0.6rem] md:text-[0.65rem] lg:text-[0.75rem] font-sans font-medium uppercase tracking-wide whitespace-nowrap">
                        {award.category}
                      </div>
                    )}
                    {award.badges &&
                      award.badges.map((badge) => (
                        <div
                          key={badge}
                          className="shrink-0 px-1.5 py-0.5 md:px-2 bg-[#333333] text-[#EFEFEF] text-[0.6rem] md:text-[0.65rem] lg:text-[0.75rem] font-sans font-medium uppercase tracking-wide whitespace-nowrap"
                        >
                          {badge}
                        </div>
                      ))}
                    {award.academicYear && (
                      <div className="shrink-0 px-1.5 py-0.5 md:px-2 bg-[#F02E31] text-[#EFEFEF] text-[0.6rem] md:text-[0.65rem] lg:text-[0.75rem] font-sans font-medium tracking-wide whitespace-nowrap">
                        {award.academicYear}
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Corner Markers */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-[#FF5154] z-30" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-[#FF5154] z-30 transform translate-x-[1px] -translate-y-[1px]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#FF5154] z-30 transform -translate-x-[1px] translate-y-[1px]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#FF5154] z-30 transform translate-x-[1px] translate-y-[1px]" />
      </motion.div>
    </motion.div>
  );
}
