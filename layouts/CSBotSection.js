import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export default function CSBotSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative section-container px-6 md:px-12 lg:px-[6rem] mt-6 lg:mt-[2.5rem] mb-10 lg:mb-[4rem] font-sans">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center justify-center text-center gap-2 lg:gap-[0.6rem]"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="relative w-[160px] h-[160px] md:w-[180px] md:h-[180px]"
        >
          <Image
            src="/mascot/cs-bot.png"
            alt="CS Bot"
            fill
            className="object-contain"
          />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="text-2xl md:text-3xl lg:text-[2.2rem] font-bold text-[var(--color-text)] leading-[1.1] tracking-[0.34%] max-w-[20ch] md:max-w-[16ch] lg:max-w-[20ch]"
        >
          See what{" "}
          <span className="font-minecraft text-[#FF5154] font-normal">
            Ingo
          </span>{" "}
          has to offer
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
          className="text-[#EFEFEF] text-sm md:text-[1rem] lg:text-[1.1rem] max-w-[25ch] md:max-w-[35ch] lg:max-w-[50ch] leading-relaxed font-normal"
        >
          Explore projects, people, and the bscs community
        </motion.p>
      </motion.div>
    </section>
  );
}
