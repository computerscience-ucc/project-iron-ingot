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
      className="w-full rounded-2xl overflow-hidden bg-black border border-white/5 mb-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* tab bar */}
      {hasImages && hasVideo && (
        <div className="flex border-b border-white/10">
          {["photos", "video"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                tab === t
                  ? "text-white border-b-2 border-red-500"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t === "photos" ? `Photos (${images.length})` : "Video"}
            </button>
          ))}
        </div>
      )}

      {/* photos */}
      {tab === "photos" && hasImages && (
        <div className="relative w-full" style={{ height: "420px" }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[idx]}
                fill
                style={{ objectFit: "cover" }}
                sizes="100vw"
                alt={`Photo ${idx + 1}`}
                priority={idx === 0}
              />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button onClick={() => go(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition">
                <CgChevronLeft size={22} />
              </button>
              <button onClick={() => go(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition">
                <CgChevronRight size={22} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === idx ? "bg-white w-5" : "bg-white/40 w-1.5 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
              <span className="absolute top-3 right-3 z-10 text-[11px] px-2 py-0.5 rounded-full bg-black/60 text-gray-300">
                {idx + 1} / {images.length}
              </span>
            </>
          )}
        </div>
      )}

      {/* video */}
      {(tab === "video" || (!hasImages && hasVideo)) && (
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
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
