import { useState, useEffect, useRef } from "react";
import { useMotionValue, useSpring, useInView } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { client } from "../lib/sanity";
import AwardCard from "../components/Home/Awards/AwardCard";
import AwardCursor from "../components/Home/Awards/AwardCursor";
import AwardRay from "../components/Home/Awards/AwardRay";

const AWARDS_QUERY = `
  *[_type == 'award' && defined(headerImage)] | order(academicYear desc, dateAwarded desc) [0...10] {
    _id,
    "title": awardTitle,
    "slug": slug.current,
    "headerImage": headerImage.asset->url,
    "images": awardImages[].asset->url,
    "category": awardCategory,
    "badges": awardBadges,
    "description": awardDescription,
    academicYear,
    dateAwarded,
    tags
  }
`;

export default function AwardGallery() {
  const [awards, setAwards] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredSide, setHoveredSide] = useState(null);
  const [isCursorHidden, setIsCursorHidden] = useState(false);
  const [isRayVisible, setIsRayVisible] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Track viewport for responsive card sizing
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Fetch awards from Sanity
  useEffect(() => {
    client.fetch(AWARDS_QUERY).then((data) => {
      if (data && data.length > 0) {
        setAwards(data);
        // Find Hack4Gov award and set as initial middle card
        const hackIndex = data.findIndex((a) =>
          a.title?.toLowerCase().includes("hack4gov"),
        );
        if (hackIndex !== -1) {
          setActiveIndex(hackIndex);
        }
      }
    });
  }, []);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

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

  useEffect(() => {
    let timer;
    if (hoveredSide) {
      // Wait 150ms before hiding the default cursor
      timer = setTimeout(() => setIsCursorHidden(true), 150);
    } else {
      setIsCursorHidden(false);
    }
    return () => clearTimeout(timer);
  }, [hoveredSide]);

  const cardWidth = isMobile ? 340 : 1000;
  const rayHeight = isMobile ? 120 : 220;
  const rayTopWidth = isMobile ? 30 : 50;

  const getPosition = (itemIndex) => {
    const len = awards.length;
    if (itemIndex === activeIndex) return "center";
    if (itemIndex === (activeIndex - 1 + len) % len) return "left";
    if (itemIndex === (activeIndex + 1) % len) return "right";
    return null;
  };

  const handleClick = (itemIndex) => {
    if (itemIndex === activeIndex) {
      router.push("/awards");
      return;
    }

    // Enable switching mode for faster text reveals
    setIsSwitching(true);

    // Hide ray immediately
    setIsRayVisible(false);

    // Switch card
    setActiveIndex(itemIndex);
    setHoveredSide(null);

    // Show ray again after cards settle
    setTimeout(() => {
      setIsRayVisible(true);
    }, 350); // 0.35s wait for card movement to settle

    // Reset switching mode after animation completes
    setTimeout(() => {
      setIsSwitching(false);
    }, 1500);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col items-center pt-4 pb-2 overflow-hidden"
    >
      {/* Custom Cursor Circle - hidden on mobile */}
      {!isMobile && (
        <AwardCursor
          hoveredSide={hoveredSide}
          springX={springX}
          springY={springY}
        />
      )}

      {/* Robot Head */}
      <div className="relative z-30 mb-[-2rem] md:mb-[-3.5rem]">
        <div className="relative w-[10rem] h-[10rem] md:w-[14rem] md:h-[14rem]">
          <Image
            src="/mascot/awards-bot.png"
            alt="Award Bot"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Ray and Content */}
      <div className="relative w-full flex flex-col items-center mt-[-1rem]">
        {/* The Ray */}
        <AwardRay
          isRayVisible={isRayVisible}
          isInView={isInView}
          cardWidth={cardWidth}
          rayHeight={rayHeight}
          rayTopWidth={rayTopWidth}
        />

        {/* Carousel */}
        <div
          className="relative w-full flex justify-center items-center mt-[-1px] z-20"
          style={{ height: `${(cardWidth * 9) / 16}px` }}
        >
          {awards.map((award, i) => {
            const position = getPosition(i);
            if (!position) return null;
            return (
              <AwardCard
                key={award._id}
                award={award}
                position={position}
                onClick={() => handleClick(i)}
                onHover={setHoveredSide}
                isCursorHidden={isCursorHidden}
                isInView={isInView}
                isSwitching={isSwitching}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
