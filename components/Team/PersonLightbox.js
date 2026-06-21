import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { preloadImage } from "../../lib/imageCache";
import { getBlurPlaceholder } from "../../lib/imagePlaceholders";

const GRADIENTS = [
  "from-rose-500/40 to-pink-600/30",
  "from-violet-500/40 to-purple-600/30",
  "from-blue-500/40 to-cyan-600/30",
  "from-emerald-500/40 to-teal-600/30",
  "from-amber-500/40 to-orange-600/30",
  "from-fuchsia-500/40 to-pink-500/30",
  "from-sky-500/40 to-indigo-600/30",
  "from-lime-500/40 to-green-600/30",
  "from-red-500/40 to-rose-600/30",
  "from-cyan-500/40 to-blue-600/30",
];

export const getGradient = (name) => {
  const hash = (name || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
};

const lightboxSlideVariants = {
  enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
};

const PersonLightbox = ({ people, initialIndex, onClose }) => {
  const [idx, setIdx] = useState(initialIndex);
  const [dir, setDir] = useState(1);
  const person = people[idx];
  const gradient = getGradient(person?.name);

  const go = useCallback((d) => {
    setDir(d);
    setIdx((i) => (i + d + people.length) % people.length);
  }, [people.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft")  go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, people.length, go]);

  // body lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Preload current + adjacent images into cache
  useEffect(() => {
    if (!people?.length) return;
    const toPreload = [
      people[idx]?.photo,
      people[(idx + 1) % people.length]?.photo,
      people[(idx - 1 + people.length) % people.length]?.photo,
    ].filter(Boolean);
    toPreload.forEach((url) => preloadImage(url).catch(() => {}));
  }, [idx, people]);

  if (!person) return null;

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = Math.abs(offset.x) * Math.abs(velocity.x);
    if (offset.x < -50 || swipe > 3000) go(1);
    else if (offset.x > 50 || swipe > 3000) go(-1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm touch-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-[#121212] border border-[#333] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Markers */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-[#FF5154] z-40" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-[#FF5154] z-40" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#FF5154] z-40" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#FF5154] z-40" />

        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 md:w-11 md:h-11 rounded-[6px] md:rounded-[8px] bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all hover:bg-black/60"
          aria-label="Close"
        >
          <CgClose size={18} />
        </button>

        {/* sliding wrapper */}
        <div className="relative">
          {/* prev/next buttons (centered on image) */}
          <div className="absolute top-0 left-0 w-full aspect-square pointer-events-none z-30 flex items-center justify-between px-3">
            {people.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                className="pointer-events-auto w-9 h-9 md:w-11 md:h-11 rounded-[6px] md:rounded-[8px] bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all hover:bg-black/60"
                aria-label="Previous"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </button>
            )}

            {people.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); go(1); }}
                className="pointer-events-auto w-9 h-9 md:w-11 md:h-11 rounded-[6px] md:rounded-[8px] bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all hover:bg-black/60"
                aria-label="Next"
              >
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <div style={{ display: "grid", overflow: "hidden" }}>
            <AnimatePresence custom={dir} initial={false}>
              <motion.div
                key={idx}
                custom={dir}
                variants={lightboxSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="cursor-grab active:cursor-grabbing"
                style={{ gridArea: "1 / 1" }}
              >
                {person.photo ? (
                  <div className="w-full aspect-square overflow-hidden bg-[#1a1a1a] flex items-center justify-center relative border-b border-[#5B5B5B] border-dashed">
                    <Image src={person.photo} alt={person.name} fill style={{ objectFit: "cover" }} sizes="100vw" priority draggable={false} placeholder="blur" blurDataURL={getBlurPlaceholder(person.photo)} />
                  </div>
                ) : (
                  <div
                    className={`w-full aspect-square flex items-center justify-center bg-gradient-to-br ${gradient} border-b border-[#5B5B5B] border-dashed`}
                  >
                    <span className="text-9xl font-bold opacity-70 select-none">{person.name?.charAt(0) || "?"}</span>
                  </div>
                )}

                <div className="p-4 sm:p-5 text-left">
                  <h2 className="text-[1.1rem] sm:text-[1.25rem] font-semibold text-white tracking-tight leading-tight">{person.name}</h2>
                  <p className="text-[0.8rem] sm:text-[0.9rem] text-[#8C8C8C] mt-1 font-normal tracking-tight">{person.subtitle}</p>
                  {people.length > 1 && (
                    <span className="inline-block mt-3.5 text-[10px] sm:text-[11px] text-[#8C8C8C] pointer-events-none uppercase tracking-widest leading-none font-medium opacity-60">
                      {idx + 1} / {people.length}
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PersonLightbox;
