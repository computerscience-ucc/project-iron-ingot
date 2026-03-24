import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
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
  const router = useRouter();

  const [windowWidth, setWindowWidth] = useState(1024);
  const [containerWidth, setContainerWidth] = useState(1000);
  const measureRef = useRef(null);

  // Track viewport for responsive card sizing
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (measureRef.current) {
        const style = window.getComputedStyle(measureRef.current);
        const pl = parseFloat(style.paddingLeft);
        const pr = parseFloat(style.paddingRight);
        setContainerWidth(measureRef.current.clientWidth - pl - pr);
      }
    };
    handleResize(); // set initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

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

  // The side cards stick out by ~9% on each side due to scaling and x-offset (0.18 + 0.82/2 = 0.59 vs 0.5 center).
  // We divide by 1.18 to ensure the entire visual carousel perfectly touches the grid lines.
  const maxAvailableWidth = isMobile || isTablet ? containerWidth : 1000;
  const layoutScaleFactor = (isMobile || isTablet) ? 1.18 : 1;
  const cardWidth = maxAvailableWidth / layoutScaleFactor;

  // Dynamically increase card height on smaller screens.
  // Mobile uses a 4:3 aspect ratio, tablet uses 16:10, and desktop uses the original 16:9.
  const cardHeight = isMobile ? cardWidth * (3 / 4) : isTablet ? cardWidth * (10 / 16) : cardWidth * (11 / 16);

  const dynamicRayHeight = isMobile ? cardWidth * 0.35 : isTablet ? cardWidth * 0.25 : 220;
  
  const rayHeight = isMobile ? dynamicRayHeight : isTablet ? dynamicRayHeight : 220;
  const rayTopWidth = isMobile ? 30 : isTablet ? 40 : 50;

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

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipePower = Math.abs(offset.x) * velocity.x;
    const len = awards.length;

    if (swipePower < -500 || offset.x < -100) {
      // Swiped Left -> Next Card (Right card comes center)
      const nextIndex = (activeIndex + 1) % len;
      handleClick(nextIndex);
    } else if (swipePower > 500 || offset.x > 100) {
      // Swiped Right -> Prev Card (Left card comes center)
      const prevIndex = (activeIndex - 1 + len) % len;
      handleClick(prevIndex);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col items-center pt-4 pb-2 overflow-hidden"
    >
      {/* Invisible measurement container to track the dashed borders */}
      <div 
        ref={measureRef} 
        className="absolute top-0 w-full section-container px-6 md:px-12 lg:px-[6rem] h-0 pointer-events-none invisible"
      />

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
        <motion.div
          className="relative w-full flex justify-center items-center mt-[-1px] z-20 touch-none md:touch-pan-y"
          style={{ height: `${cardHeight}px` }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
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
                cardWidth={cardWidth}
                cardHeight={cardHeight}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
