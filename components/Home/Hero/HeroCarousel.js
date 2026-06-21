"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight } from "@geist-ui/icons";
import { preloadImage } from "@/lib/imageCache";

const images = [
  "/samples/team2.png",
  "/samples/team3.png",
  "/samples/team1.png",
  "/samples/disk.png",
  "/samples/disk2.png",
  "/samples/team4.png",
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const nextIdx = (currentIndex + 1) % images.length;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    preloadImage(images[nextIdx]).catch(() => {});
    preloadImage(images[prevIdx]).catch(() => {});
  }, [currentIndex]);

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

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

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
    <div
      className="relative w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-full -mx-6 md:-mx-12 lg:mx-0 aspect-square bg-[#1D1D1D] rounded-[11.67px] flex flex-col items-center justify-end overflow-hidden group touch-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={() => setIsPaused(true)}
      onPointerUp={() => setIsPaused(false)}
    >
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
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
          className="w-11 h-11 md:w-12 md:h-12 rounded-[6px] md:rounded-[8px] bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all hover:bg-black/60"
          aria-label="Previous slide"
        >
          <ArrowLeft size={isMobile ? 16 : 20} strokeWidth={2.5} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-2 md:right-3 flex items-center z-30">
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="w-11 h-11 md:w-12 md:h-12 rounded-[6px] md:rounded-[8px] bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all hover:bg-black/60"
          aria-label="Next slide"
        >
          <ArrowRight size={isMobile ? 16 : 20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-2.5 z-20 pointer-events-auto">
        {images.map((_, index) => {
          const isActive = index === currentIndex;

          return (
            <motion.button
              key={index}
              initial={false}
              animate={{
                width: isActive ? 28 : 8,
                opacity: isActive ? 1 : 0.4,
              }}
              transition={{
                width: { type: "spring", stiffness: 400, damping: 28 },
                opacity: { duration: 0.25 },
              }}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className="h-2 rounded-full focus:outline-none"
              style={{
                backgroundColor: isActive ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.5)",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
