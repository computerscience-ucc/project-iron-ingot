import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";

const MASCOTS = [
  "awards-bot.png", "bulletin-bot.png", "chat-bot.png", "chitchat-bot.png",
  "cs-bot.png", "curious-bot.png", "grad-bot.png", "hero-bot.png",
  "study-bot.png", "thesis-bot.png", "vibe-bot.png", "welcome-bot.png"
];

export default function HappyCodingSection() {
  const [trail, setTrail] = useState([]);
  const lastSpawnRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const dist = Math.hypot(clientX - lastSpawnRef.current.x, clientY - lastSpawnRef.current.y);

    // Spawn a bot every ~90px moved to prevent excessive clustering
    if (dist > 90) {
      lastSpawnRef.current = { x: clientX, y: clientY };
      const size = Math.floor(Math.random() * 50) + 170; // 170px to 220px
      const newBot = {
        id: Date.now() + Math.random(),
        x: clientX,
        y: clientY,
        size,
        img: MASCOTS[Math.floor(Math.random() * MASCOTS.length)]
      };

      setTrail((prev) => [...prev, newBot]);

      // Destroy the spawn after 600ms
      setTimeout(() => {
        setTrail((prev) => prev.filter(b => b.id !== newBot.id));
      }, 600);
    }
  };

  return (
    <motion.section
      className="relative w-full bg-[#1B1B1B] py-16 md:py-[8rem] overflow-hidden"
      onMouseMove={handleMouseMove}
      onHoverEnd={() => setTrail([])}
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      style={{ touchAction: "none" }} // improves swiping on touch devices
    >
      {/* Centered Content Container */}
      <div className="section-container px-6 md:px-12 lg:px-[6rem] relative z-[10] pointer-events-none">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-[4rem]">
          {/* Graduation Bot Image */}
          <motion.div
            className="relative w-[180px] h-[180px] md:w-[280px] md:h-[280px]"
            variants={{
              rest: { scale: 1, rotate: 0, opacity: 1 },
              hover: { scale: 0.5, rotate: 20, opacity: 0 }
            }}
            transition={{
              type: "spring", stiffness: 600, damping: 12, mass: 0.8,
              opacity: { duration: 0.15, ease: "easeOut" }
            }}
          >
            <Image
              src="/mascot/grad-bot.png"
              alt="Graduation Bot"
              fill
              className="object-contain drop-shadow-lg"
            />
          </motion.div>

          {/* Typography */}
          <motion.h2
            className="font-minecraft text-center md:text-left text-white text-4xl md:text-[3.5rem] tracking-wider uppercase leading-none mt-4"
            variants={{
              rest: { opacity: 1, y: 0 },
              hover: { opacity: 0, y: 10 }
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            HAPPY CODING!
          </motion.h2>
        </div>
      </div>

      {/* Floating Trail Playground */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <AnimatePresence>
          {trail.map((bot) => (
            <motion.div
              key={bot.id}
              className="absolute"
              style={{
                width: bot.size,
                height: bot.size,
                left: bot.x,
                top: bot.y,
                x: "-50%",
                y: "-50%"
              }}
              initial={{ scale: 0, rotate: -25, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, rotate: 30, opacity: 0 }}
              transition={{
                type: "spring", stiffness: 500, damping: 15,
                opacity: { duration: 0.15, ease: "easeOut" }
              }}
            >
              <Image
                src={`/mascot/${bot.img}`}
                alt="Trail Bot"
                fill
                className="object-contain drop-shadow-xl"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
