import { useState, useRef } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import dynamic from "next/dynamic";
import Stripe from "./Stripe";

const Scene3D = dynamic(() => import("../components/Scene3D"), { ssr: false });

export default function FeaturesList() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const features = [
    {
      num: "O1",
      title: "Online Public Information Board",
      desc: "Stay informed about the latest announcements, academic updates, and important events happening in the BSCS program.",
    },
    {
      num: "O2",
      title: "Senior Project Discovery Showcase",
      desc: "See what the seniors are doing in the BSCS Program and learn from them too while building their own Thesis project.",
    },
    {
      num: "O3",
      title: "Student Collaborative Network",
      desc: "Connect with other students in the BSCS Program and get to know them better.",
    },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const handleFeatureClick = (index) => {
    setActiveIndex(index);
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // latest goes from 0 to 1
    // Map latest (0-1) to indices (0, 1, 2)
    const index = Math.min(
      Math.floor(latest * features.length),
      features.length - 1,
    );
    // Clamp to at least 0
    setActiveIndex(Math.max(0, index));
  });

  return (
    <div className="w-full font-sans mb-[2rem]">
      <Stripe className="mb-4 lg:mb-0" />

      <section className="relative section-container">
        <div className="relative z-10 flex flex-col lg:flex-row lg:block pointer-events-none">
          {/* Left Column: 3D Scene */}
          <div className="relative lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-[4rem] lg:right-[54rem] h-[300px] md:h-[400px] lg:h-[80vh] w-full lg:w-auto flex items-center justify-center overflow-visible pointer-events-auto z-20 mb-2 lg:mb-0">
            <Scene3D
              activeIndex={activeIndex}
              scrollYProgress={scrollYProgress}
            />
          </div>

          {/* Right Column: Features List */}
          <div
            ref={containerRef}
            className="shrink-0 lg:ml-auto flex flex-col border-x border-dashed border-[#2A2A2A] w-full lg:w-[42rem] lg:mr-[10rem] pointer-events-auto relative z-10 px-0"
          >
            {/* Stripe background block at the top */}
            <div className="hidden lg:block relative min-h-[200px] border-b border-dashed border-[#2A2A2A] overflow-hidden">
              <div className="stripe-banner absolute inset-0 z-0"></div>
            </div>
            {features.map((feature, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleFeatureClick(idx)}
                  className={`feature-item flex flex-col p-6 md:p-8 lg:p-[2rem] border-b border-dashed border-[#2A2A2A] last:border-b-0 transition-colors duration-500 cursor-pointer ${isActive ? "bg-[#242424]" : "bg-[#1C1C1C]"
                    }`}
                >
                  <div className="flex justify-between items-start mb-3 gap-4">
                    <span
                      className={`font-minecraft text-5xl md:text-5xl lg:text-[3.6rem] leading-none transition-colors duration-500 ${isActive ? "text-[#EFEFEF]" : "text-[#434343]"
                        }`}
                    >
                      {feature.num}
                    </span>
                    <h3
                      className={`text-xl md:text-2xl lg:text-[1.6rem] font-semibold text-right leading-none transition-colors duration-500 ${isActive ? "text-[#EFEFEF]" : "text-[#434343]"
                        }`}
                    >
                      {feature.title}
                    </h3>
                  </div>
                  <p
                    className={`text-sm md:text-base lg:text-[1.1rem] leading-tight font-normal transition-colors duration-500 ${isActive ? "text-[#8C8C8C]" : "text-[#2A2A2A]"
                      }`}
                  >
                    {feature.desc}
                  </p>
                </div>
              );
            })}
            {/* Stripe background block at the bottom */}
            <div className="hidden lg:block relative min-h-[200px] border-t border-dashed border-[#2A2A2A] overflow-hidden">
              <div className="stripe-banner absolute inset-0 z-0"></div>
            </div>
          </div>
        </div>
      </section>

      <Stripe className="m-0" />
    </div>
  );
}
