import { ArrowRight } from "@geist-ui/icons";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CouncilAbout() {
  const [isHovered, setIsHovered] = useState(false);
  const [isCursorHidden, setIsCursorHidden] = useState(false);
  const sectionRef = useRef(null);

  // Smooth mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Delay cursor hiding to make it feel more natural
  useEffect(() => {
    let timer;
    if (isHovered) {
      // Wait 150ms before hiding the default cursor
      timer = setTimeout(() => setIsCursorHidden(true), 150);
    } else {
      setIsCursorHidden(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered]);

  return (
    <section
      ref={sectionRef}
      className="relative section-container px-6 md:px-12 lg:px-[6rem] mb-[2rem] font-sans py-[1.5rem] overflow-visible"
    >
      {/* Custom Cursor Circle */}
      <motion.div
        className="hidden lg:block"
        style={{
          position: "fixed",
          left: springX,
          top: springY,
          pointerEvents: "none",
          zIndex: 9999,
          width: "8.4rem",
          height: "8.4rem",
        }}
        initial={{ scale: 0, x: "-50%", y: "-50%" }}
        animate={{
          scale: isHovered ? 1 : 0,
          x: "-50%",
          y: "-50%",
        }}
        transition={{
          scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
          // Ensure position centering doesn't animate, just stays static
          x: { duration: 0 },
          y: { duration: 0 },
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-[#FF3538] to-[#DE2528] flex items-center justify-center text-white shadow-xl overflow-hidden p-3">
          <motion.div
            className="relative w-full h-full translate-x-[-0.34rem] translate-y-[-0.4rem]"
            animate={
              isHovered ? { rotate: [0, -5, 8, -5, 8, 0] } : { rotate: 0 }
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
        </div>
      </motion.div>

      <Link href="/about" className="block no-underline">
        <div
          onMouseEnter={() => window.innerWidth >= 1024 && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex flex-col items-center justify-center text-center gap-[0.8rem] relative z-[1] w-fit mx-auto cursor-pointer ${isCursorHidden ? "lg:cursor-none" : ""
            }`}
        >
          {/* Robot Image */}
          <div className="relative w-[220px] h-[220px] -mb-16 md:-mb-24 -mt-14 md:-mt-16 md:w-[340px] md:h-[340px]">
            <Image
              src="/mascot/hero-bot.png"
              alt="Hero Bot"
              fill
              className="object-contain"
            />
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-[2.2rem] text-nowrap font-bold text-[var(--color-text)] leading-[1.1] tracking-[0.34%] flex items-center justify-center text-center gap-[0.5rem] lg:gap-[0.8rem] max-w-[14ch] md:max-w-[18ch] lg:max-w-none">
            See more on{" "}
            <span className="font-minecraft text-[#FF5154] font-normal inline-block translate-y-[0.2rem] lg:translate-y-[0.38rem]">
              About
            </span>
            <ArrowRight size={24} className="lg:size-[32px] -ml-1 text-[var(--color-text)] flex-shrink-0" />
          </h2>
        </div>
      </Link>
    </section>
  );
}
