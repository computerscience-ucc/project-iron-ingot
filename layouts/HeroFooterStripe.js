import { motion } from "motion/react";
import { useState, useEffect } from "react";

const LogoMask = ({ stack }) => (
  <motion.div
    variants={{
      initial: { backgroundColor: "#3A3A3A" },
      hover: { backgroundColor: "#EFEFEF" },
    }}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    style={{
      width: stack.w,
      height: stack.h,
      maskImage: `url(${stack.src})`,
      WebkitMaskImage: `url(${stack.src})`,
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskPosition: "center",
      WebkitMaskPosition: "center",
    }}
  />
);

export default function HeroFooterStripe() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stackLogos = [
    {
      src: "/stack/nextjs.svg",
      alt: "Next.js",
      w: "6rem",
      h: "2rem",
      href: "https://nextjs.org/",
    },
    {
      src: "/stack/vercel.svg",
      alt: "Vercel",
      w: "6rem",
      h: "1.2rem",
      href: "https://vercel.com/",
    },
    {
      src: "/stack/sanity.svg",
      alt: "Sanity",
      w: "6rem",
      h: "1.2rem",
      href: "https://www.sanity.io/",
    },
    {
      src: "/stack/shadcn.svg",
      alt: "Shadcn/UI",
      w: "7.6rem",
      h: "1.6rem",
      href: "https://ui.shadcn.com/",
    },
    {
      src: "/stack/motion.svg",
      alt: "Motion",
      w: "7.5rem",
      h: "0.8rem",
      href: "https://motion.dev/",
    },
    {
      src: "/stack/tailwindcss.svg",
      alt: "Tailwind",
      w: "8.4rem",
      h: "1.8rem",
      href: "https://tailwindcss.com/",
    },
    {
      src: "/stack/threejs.svg",
      alt: "Three.js",
      w: "6rem",
      h: "1.6rem",
      href: "https://threejs.org/",
    },
  ];

  return (
    <div className="w-full relative min-h-[2.8rem] md:min-h-[3.2rem] mt-[4rem] overflow-hidden">
      <div className="stripe-banner absolute inset-0 z-0"></div>
      <div className="absolute top-0 left-0 w-full border-dashed-long-h text-[#2A2A2A]"></div>
      <div className="absolute bottom-0 left-0 w-full border-dashed-long-h text-[#2A2A2A]"></div>

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="flex flex-wrap justify-center gap-y-2 items-center py-2 md:py-3 lg:py-0 lg:border-l border-dashed border-[#2A2A2A] lg:w-auto">
          {stackLogos.map((stack, i) => {
            const currentW = isMobile ? `${parseFloat(stack.w) * 0.75}rem` : stack.w;
            const currentH = isMobile ? `${parseFloat(stack.h) * 0.75}rem` : stack.h;

            return (
              <motion.a
                key={i}
                href={stack.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center px-2 md:px-4 lg:px-6 h-[1.8rem] md:h-[2.4rem] lg:h-[3.2rem] border-none lg:border-r lg:border-dashed lg:border-[#2A2A2A] overflow-hidden cursor-pointer"
                initial="initial"
                whileHover="hover"
              >
                {/* Invisible spacer to maintain layout width exactly */}
                <div style={{ width: currentW, height: currentH, opacity: 0 }} />

                {/* Animating container moving from 0 to -50% to show the cloned logo below */}
                <motion.div
                  className="absolute top-0 left-0 w-full flex flex-col"
                  variants={{
                    initial: { y: 0 },
                    hover: { y: "-50%" },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 18,
                    mass: 0.8,
                  }}
                >
                  {/* Original Logo taking exactly the visual bounds of the stripe */}
                  <div className="flex items-center justify-center w-full h-[1.8rem] md:h-[2.4rem] lg:h-[3.2rem]">
                    <LogoMask stack={{ ...stack, w: currentW, h: currentH }} />
                  </div>
                  {/* Clone Logo sitting just underneath it */}
                  <div className="flex items-center justify-center w-full h-[1.8rem] md:h-[2.4rem] lg:h-[3.2rem]">
                    <LogoMask stack={{ ...stack, w: currentW, h: currentH }} />
                  </div>
                </motion.div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
