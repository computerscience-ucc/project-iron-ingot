"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight } from "@geist-ui/icons";

const images = [
  "/samples/team2.png",
  "/samples/disk.png",
  "/samples/disk2.png",
  "/samples/team1.png",
  "/samples/team3.png",
  "/samples/team4.png",
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [direction, setDirection] = useState(0);

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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = Math.abs(offset.x) * Math.abs(velocity.x);

    if (offset.x < -50 || swipe > 3000) {
      if (offset.x < 0) nextSlide();
      else prevSlide();
    } else if (offset.x > 50 || swipe > 3000) {
      if (offset.x > 0) prevSlide();
      else nextSlide();
    }
  };

  return (
    <div className="relative w-[calc(100%+1.5rem)] md:w-[calc(100%+3rem)] lg:w-full -mx-3 md:-mx-6 lg:mx-0 aspect-square bg-[#1D1D1D] rounded-[11.67px] flex flex-col items-center justify-end overflow-hidden group touch-none">
      {/* Image Carousel */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0 lg:z-10"
        >
          <Image
            src={images[currentIndex]}
            alt={`Hero Carousel Image ${currentIndex + 1}`}
            fill
            className="object-cover object-top"
            priority={currentIndex === 0}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-2 md:left-3 flex items-center z-30">
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="w-9 h-9 md:w-12 md:h-12 rounded-[6px] md:rounded-[8px] bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all hover:bg-black/60"
          aria-label="Previous slide"
        >
          <ArrowLeft size={isMobile ? 18 : 24} strokeWidth={2.5} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-2 md:right-3 flex items-center z-30">
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="w-9 h-9 md:w-12 md:h-12 rounded-[6px] md:rounded-[8px] bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all hover:bg-black/60"
          aria-label="Next slide"
        >
          <ArrowRight size={isMobile ? 18 : 24} strokeWidth={2.5} />
        </button>
      </div>

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
                backgroundColor: isActive
                  ? "rgba(255, 255, 255, 0.95)"
                  : "rgba(100, 100, 100, 0.35)",
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
