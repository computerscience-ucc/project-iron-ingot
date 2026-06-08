import {
  useAnimationFrame,
  useTransform,
  useMotionValue,
  motion,
  useScroll,
  useVelocity,
  useSpring,
} from "motion/react";
import { useRef } from "react";

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function CouncilParallaxText() {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 40,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 1.2], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * -1.2 * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  const TickerGroup = () => (
    <div className="flex items-center gap-4 md:gap-6 lg:gap-10">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 md:gap-6 lg:gap-10 font-minecraft tracking-[0.34%] uppercase"
        >
          <div className="flex items-center gap-4 text-3xl md:text-5xl lg:text-[3.2rem] leading-none whitespace-nowrap">
            <span className="text-white">MEET THE</span>
            <span className="text-[#FF5154]">COUNCIL</span>
          </div>
          <span className="text-white text-xl md:text-3xl lg:text-[2.4rem]">*</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-transparent h-[4rem] md:h-[6rem] lg:h-[8rem] flex items-center overflow-hidden relative mt-8 md:mt-12 lg:mt-[2.4rem]">
      <motion.div className="flex whitespace-nowrap gap-10" style={{ x }}>
        <TickerGroup />
        <TickerGroup />
      </motion.div>
    </div>
  );
}
