import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

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

  const go = (d) => { setDir(d); setIdx((i) => (i + d + people.length) % people.length); };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") { setDir(1);  setIdx((i) => (i + 1 + people.length) % people.length); }
      if (e.key === "ArrowLeft")  { setDir(-1); setIdx((i) => (i - 1 + people.length) % people.length); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, people.length]);

  // body lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!person) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-md p-4 overflow-y-auto custom-scrollbar"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-[#121212] border border-[#5B5B5B] border-dashed flex flex-col my-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Markers */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-[#FF5154] z-50 transform -translate-x-[1px] -translate-y-[1px]" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-[#FF5154] z-50 transform translate-x-[1px] -translate-y-[1px]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#FF5154] z-50 transform -translate-x-[1px] translate-y-[1px]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#FF5154] z-50 transform translate-x-[1px] translate-y-[1px]" />

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
                style={{ gridArea: "1 / 1" }}
              >
                {person.photo ? (
                  <div className="w-full aspect-square overflow-hidden bg-black flex items-center justify-center relative border-b border-[#5B5B5B] border-dashed">
                    <Image src={person.photo} alt={person.name} fill style={{ objectFit: "cover" }} sizes="100vw" priority />
                  </div>
                ) : (
                  <div
                    className={`w-full aspect-square flex items-center justify-center bg-gradient-to-br ${gradient} border-b border-[#5B5B5B] border-dashed`}
                  >
                    <span className="text-9xl font-bold opacity-70">{person.name?.charAt(0) || "?"}</span>
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
