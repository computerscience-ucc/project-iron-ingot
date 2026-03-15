import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CgChevronLeft, CgChevronRight, CgClose } from "react-icons/cg";
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

  if (!person) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-[#0e1015] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white transition"
          aria-label="Close"
        >
          <CgClose size={18} />
        </button>

        {/* prev */}
        {people.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white transition"
            aria-label="Previous"
          >
            <CgChevronLeft size={22} />
          </button>
        )}

        {/* next */}
        {people.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white transition"
            aria-label="Next"
          >
            <CgChevronRight size={22} />
          </button>
        )}

        {/* grid-stack wrapper: entering + exiting overlap in the same cell, no height doubling or FLIP */}
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
                <div className="w-full overflow-hidden bg-black flex items-center justify-center relative" style={{ height: "50vh", maxHeight: "70vh" }}>
                  <Image src={person.photo} alt={person.name} fill style={{ objectFit: "contain" }} sizes="100vw" priority />
                </div>
              ) : (
                <div
                  className={`w-full flex items-center justify-center bg-gradient-to-br ${gradient}`}
                  style={{ height: "400px" }}
                >
                  <span className="text-9xl font-bold opacity-70">{person.name?.charAt(0) || "?"}</span>
                </div>
              )}

              <div className="p-5">
                <p className="text-lg font-bold text-white">{person.name}</p>
                <p className="text-sm text-header-color mt-1">{person.subtitle}</p>
                {people.length > 1 && (
                  <p className="text-[10px] text-white/20 mt-2">{idx + 1} / {people.length}</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PersonLightbox;
