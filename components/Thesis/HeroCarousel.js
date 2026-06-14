import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";
import Image from "next/image";

const HeroCarousel = ({ images, youtubeId }) => {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [tab, setTab] = useState("photos");
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const hasImages = images && images.length > 0;
  const hasVideo = !!youtubeId;

  const go = useCallback((d) => {
    if (!hasImages || images.length < 2) return;
    setDir(d);
    setIdx((i) => (i + d + images.length) % images.length);
  }, [hasImages, images]);

  useEffect(() => {
    if (paused || tab !== "photos" || !hasImages || images.length < 2) return;
    timerRef.current = setInterval(() => go(1), 4000);
    return () => clearInterval(timerRef.current);
  }, [paused, tab, hasImages, images, go]);

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  if (!hasImages && !hasVideo) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-[#242424] mb-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Absolute border overlay - Dashed style */}
      <div className="absolute inset-0 border border-[#5B5B5B] border-dashed pointer-events-none z-30" />

      {/* Corner Markers */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-[#FF5154] z-[40] transform -translate-x-[1px] -translate-y-[1px]" />
      <div className="absolute top-0 right-0 w-2 h-2 bg-[#FF5154] z-[40] transform translate-x-[1px] -translate-y-[1px]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#FF5154] z-[40] transform -translate-x-[1px] translate-y-[1px]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#FF5154] z-[40] transform translate-x-[1px] translate-y-[1px]" />

      {/* tab bar */}
      {hasImages && hasVideo && (
        <div className="flex border-b border-[#5B5B5B] border-dashed relative z-20 bg-[#181818]">
          {["photos", "video"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 md:px-8 py-2.5 md:py-3 text-[0.8rem] md:text-[0.875rem] font-medium transition-all relative ${
                tab === t
                  ? "text-white"
                  : "text-[#8C8C8C] hover:text-[#EFEFEF]"
              }`}
            >
              <span className="relative z-10">
                {t === "photos" ? `Photos (${images.length})` : "Video"}
              </span>
              {tab === t && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* photos */}
      {tab === "photos" && hasImages && (
        <div className="relative w-full aspect-video">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={images[idx]}
                fill
                className="object-cover"
                sizes="1100px"
                alt={`Photo ${idx + 1}`}
                priority={idx === 0}
              />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button onClick={() => go(-1)} aria-label="Previous image"
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-[6px] bg-black/40 hover:bg-white/10 flex items-center justify-center text-white transition-all backdrop-blur-sm">
                <CgChevronLeft size={20} />
              </button>
              <button onClick={() => go(1)} aria-label="Next image"
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-[6px] bg-black/40 hover:bg-white/10 flex items-center justify-center text-white transition-all backdrop-blur-sm">
                <CgChevronRight size={20} />
              </button>
              <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 md:gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === idx ? "bg-white w-8" : "bg-white/30 w-1.5 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
              <span className="absolute top-4 right-4 z-20 text-[0.7rem] font-sans font-bold tracking-wider px-2.5 py-1 bg-black/50 text-[#EFEFEF] backdrop-blur-md uppercase">
                {idx + 1} / {images.length}
              </span>
            </>
          )}
        </div>
      )}

      {/* video */}
      {(tab === "video" || (!hasImages && hasVideo)) && (
        <div className="relative w-full aspect-video z-10">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&enablejsapi=1`}
            title="Thesis Video"
            allow="autoplay; fullscreen; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
