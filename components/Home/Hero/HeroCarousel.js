"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { ArrowLeft, ArrowRight } from "@geist-ui/icons";

const images = [
  "/samples/disk2.png",
  "/samples/disk.png",
  "/samples/finals.png",
  "/samples/midterms.png",
  "/samples/stress.png",
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [direction, setDirection] = useState(0);
  const [hoveredSide, setHoveredSide] = useState(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  const slideVariants = {
    initial: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
    }),
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full aspect-square bg-[#1D1D1D] rounded-[12px] flex flex-col items-center justify-end overflow-hidden group">
      {/* Image Carousel */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[currentIndex]}
            alt={`Hero Carousel Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Left, Center, and Right Hit Zones for Custom Cursor */}
      <div className="absolute inset-0 z-10 flex cursor-none">
        <div
          className="w-[30%] h-full pointer-events-auto"
          onMouseEnter={() => setHoveredSide("left")}
          onMouseLeave={() => setHoveredSide(null)}
          onClick={prevSlide}
        />
        <div
          className="w-[40%] h-full pointer-events-auto"
          onMouseEnter={() => setHoveredSide("center")}
          onMouseLeave={() => setHoveredSide(null)}
        />
        <div
          className="w-[30%] h-full pointer-events-auto"
          onMouseEnter={() => setHoveredSide("right")}
          onMouseLeave={() => setHoveredSide(null)}
          onClick={nextSlide}
        />
      </div>

      {/* Mobile/Tablet Arrow Navigation - Visible only on small screens */}
      <div className="md:hidden absolute inset-y-0 left-3 flex items-center z-30">
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="w-9 h-9 rounded-[6px] bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all"
          aria-label="Previous slide"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>
      </div>
      <div className="md:hidden absolute inset-y-0 right-3 flex items-center z-30">
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="w-9 h-9 rounded-[6px] bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all"
          aria-label="Next slide"
        >
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Custom Cursor Overlay */}
      <motion.div
        className="hidden md:block"
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
          width: hoveredSide === "center" ? "8.4rem" : "7.2rem",
          height: hoveredSide === "center" ? "8.4rem" : "7.2rem",
          borderRadius: "9999px",
        }}
        transition={{
          scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-[#FF3538] to-[#DE2528] flex items-center justify-center text-white shadow-xl overflow-hidden p-3 pointer-events-none">
          {hoveredSide === "left" && <ArrowLeft size={44} strokeWidth={2.2} />}
          {hoveredSide === "right" && <ArrowRight size={44} strokeWidth={2.2} />}
          {hoveredSide === "center" && (
            <motion.div
              className="relative w-full h-full translate-x-[-0.34rem] translate-y-[-0.4rem]"
              animate={{ rotate: [0, -5, 8, -5, 8, 0] }}
              transition={{
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
          )}
        </div>
      </motion.div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-6 flex items-center justify-center gap-[0.4rem] z-20 pointer-events-auto">
        {images.map((_, index) => {
          const dist = Math.abs(index - currentIndex);
          const isActive = dist === 0;

          return (
            <motion.button
              key={index}
              layout
              initial={false}
              animate={{
                width: isActive ? 64 : dist === 1 ? 32 : dist === 2 ? 24 : 16,
                backgroundColor: isActive ? "rgba(255, 255, 255, 0.95)" : "rgba(100, 100, 100, 0.35)",
              }}
              transition={{
                width: { type: "spring", stiffness: 300, damping: 20 },
                backgroundColor: { duration: 0.2 },
              }}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className="h-1.5 rounded-full backdrop-blur-md focus:outline-none"
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
