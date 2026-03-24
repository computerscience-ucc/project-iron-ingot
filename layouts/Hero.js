import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@geist-ui/icons";
import { motion, AnimatePresence } from "motion/react";
import HeroCarousel from "@/components/Home/Hero/HeroCarousel";
import { useState, useEffect } from "react";

export default function Hero() {
  const mascots = [
    { src: "welcome-bot.png", size: "w-[140px] h-[140px] md:w-[180px] md:h-[180px]" },
    { src: "awards-bot.png", size: "w-[140px] h-[140px] md:w-[180px] md:h-[180px]" },
    { src: "bulletin-bot.png", size: "w-[115px] h-[140px] md:w-[180px] md:h-[180px]" },
    { src: "chat-bot.png", size: "w-[140px] h-[140px] md:w-[180px] md:h-[180px]" },
    { src: "chitchat-bot.png", size: "w-[140px] h-[140px] md:w-[180px] md:h-[180px]" },
    { src: "cs-bot.png", size: "w-[140px] h-[140px] md:w-[180px] md:h-[180px]" },
    { src: "curious-bot.png", size: "w-[140px] h-[140px] md:w-[180px] md:h-[180px]" },
    { src: "grad-bot.png", size: "w-[120px] h-[140px] md:w-[180px] md:h-[180px]" },
    { src: "study-bot.png", size: "w-[140px] h-[140px] md:w-[180px] md:h-[180px]" },
    { src: "thesis-bot.png", size: "w-[140px] h-[140px] md:w-[180px] md:h-[180px]" },
    { src: "vibe-bot.png", size: "w-[140px] h-[140px] md:w-[180px] md:h-[180px]" },
  ];

  const [currentMascot, setCurrentMascot] = useState(mascots[0]);
  const [welcomeText, setWelcomeText] = useState("WELCOME!");

  useEffect(() => {
    const interval = setInterval(() => {
      setWelcomeText((prev) => prev === "WELCOME!" ? "CLICK ME<3" : "WELCOME!");
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const changeMascot = () => {
    const available = mascots.filter((m) => m.src !== currentMascot.src);
    const randomMascot = available[Math.floor(Math.random() * available.length)];
    setCurrentMascot(randomMascot);
  };

  return (
    <section className="relative section-container px-6 md:px-12 lg:px-[6rem] mt-8 lg:mt-[2.6rem] mb-[2rem] font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute opacity-[0.14] top-[-50%] md:top-[-6%] -left-[190px] md:-left-[480px] w-[400px] md:w-[600px] h-[600px] md:h-[800px] rounded-full bg-gradient-to-br from-[#B9171A] to-[#FF3538] blur-[100px] md:blur-[134px] pointer-events-none z-[20]" />

      <div className="relative z-[30] grid grid-cols-1 lg:grid-cols-[1.1fr_1.05fr] gap-[3rem] lg:gap-[2rem] items-center">
        {/* Left Column: Hero Content */}
        <div className="flex flex-col items-center lg:items-start gap-2 lg:pr-[2rem] lg:-mt-16">
          {/* Welcome Tag */}
          <div className="flex flex-col lg:flex-row lg:-ml-10 items-center justify-center lg:justify-start gap-0 lg:gap-4 w-full lg:w-auto">
            <div className="flex flex-col lg:flex-row items-center mb-[-0.8rem] md:mb-[-1.2rem] lg:mb-0 lg:-mt-16 gap-0 lg:gap-[1rem] text-[var(--color-text)] order-1 lg:order-2">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={welcomeText}
                  className="font-minecraft text-base md:text-[1.2rem] lg:text-[1.4rem] tracking-widest mt-1 order-1 lg:order-2 inline-block"
                  initial={{ scale: 0, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  {welcomeText}
                </motion.span>
              </AnimatePresence>
              <svg
                width="5.5"
                height="9.5"
                viewBox="0 0 7 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-[-90deg] lg:rotate-0 order-2 lg:order-1"
              >
                <path
                  d="M6.66602 10.8317C6.66602 11.5417 5.84435 11.9125 5.31352 11.4842L5.24352 11.4208L0.243515 6.42083C0.100035 6.27734 0.0138431 6.08642 0.00110865 5.8839C-0.0116258 5.68138 0.0499721 5.48117 0.174348 5.32083L0.243515 5.2425L5.24352 0.2425L5.32185 0.173333L5.38602 0.128334L5.46602 0.0833337L5.49602 0.0691668L5.55185 0.0466669L5.64185 0.0200001L5.68602 0.0116666L5.73602 0.00333349L5.78352 0L5.88185 0L5.93018 0.00416676L5.98018 0.0116666L6.02352 0.0200001L6.11352 0.0466669L6.16935 0.0691668L6.27935 0.1275L6.35435 0.181667L6.42185 0.2425L6.49102 0.320834L6.53602 0.385L6.58102 0.465L6.59518 0.495L6.61768 0.550834L6.64435 0.640833L6.65268 0.685L6.66102 0.735L6.66435 0.7825L6.66602 10.8317Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <motion.div
              layout
              className={`relative flex-shrink-0 order-2 lg:order-1 cursor-pointer ${currentMascot.size}`}
              onClick={changeMascot}
              whileHover={{ scale: 1.12, rotate: -6, y: -6 }}
              whileTap={{ scale: 0.85, rotate: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 12, mass: 0.8 }}
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentMascot.src}
                  initial={{ scale: 0, opacity: 0, rotate: -20, y: 20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 20, y: -20 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={`/mascot/${currentMascot.src}`}
                    alt="Ingo Bot"
                    fill
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Headline */}
          <h1 className="text-[1.7rem] md:text-[2.4rem] lg:text-[2.9rem] text-center lg:text-left font-bold text-[var(--color-text)] leading-[1.1] tracking-[0.34%] mb-2 mt-[-0.5rem] lg:mt-0">
            Your CS{" "}
            <span className="font-minecraft text-[#FF5154] font-normal">
              In
            </span>
            formation <br className="lg:hidden" /> on the{" "}
            <span className="font-minecraft text-[#FF5154] font-normal">
              Go
            </span>
            !
          </h1>

          {/* Description */}
          <p className="text-[#EFEFEF] text-sm md:text-[1rem] max-w-[40ch] leading-normal mb-6 font-normal text-center lg:text-left mx-auto lg:mx-0">
            Stay informed about the latest announcements, academic updates, and
            important events happening in the BSCS program.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-3 lg:gap-4 w-full lg:w-auto">
            <Link href="/#latest">
              <Button className="bg-[#333333] hover:bg-[#444444] text-[var(--color-text)] border-none h-[40px] px-4 rounded-[4px] font-sans font-medium text-sm md:text-[0.9375rem] transition-colors">
                See whats new on the board
              </Button>
            </Link>
            <motion.div className="relative" initial="rest" whileHover="hover">
              <Link href="/thesis?year=2025-2026" scroll={false}>
                <Button className="bg-gradient-to-r from-[#FF3538] to-[#DE2528] hover:brightness-110 text-white border-none h-[40px] px-4 rounded-[4px] font-sans font-medium text-sm md:text-[0.9375rem] transition-all flex items-center gap-[0.6rem]">
                  2026 Thesis <ArrowRight size={18} />
                </Button>
              </Link>
              <motion.div
                className="absolute -top-[0.8rem] -right-[1.4rem] lg:-top-[1.2rem] lg:-right-[2.4rem] bg-white/60 rounded-[1.5px] px-[0.4rem] pt-[0.14rem] pb-[0.04rem] lg:px-[0.6rem] lg:py-[0.1rem] whitespace-nowrap pointer-events-none z-10 outline-[1px] lg:outline-[2px] outline-dashed outline-white flex items-center justify-center"
                variants={{
                  rest: { y: 0, rotate: 12 },
                  hover: {
                    y: [0, -6, 0],
                    rotate: [12, 4, 20, 6, 18, 4, 20, 6, 18, 12],
                    transition: {
                      duration: 0.8,
                      ease: "easeInOut",
                    },
                  },
                }}
              >
                <span className="text-[#121212] font-sans font-medium text-[0.8rem] lg:text-[0.9rem] tracking-tighter lg:tracking-normal">
                  Coming Soon!
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Hero Carousel */}
        <HeroCarousel />
      </div>
    </section>
  );
}
