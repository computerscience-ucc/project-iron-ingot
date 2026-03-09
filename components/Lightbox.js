import { useState, useMemo, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CgClose, CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import Image from 'next/image';

const Lightbox = ({ award, onClose }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const MotionImage = motion(Image);

  const images = useMemo(() => {
    if (award.images && award.images.length > 0) return award.images;
    if (award.headerImage) return [award.headerImage];
    return [];
  }, [award]);

  const go = useCallback((dir) => {
    if (images.length < 2) return;
    setDirection(dir);
    setImgIndex((i) => (i + dir + images.length) % images.length);
  }, [images.length]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, go]);
  
  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="relative w-full max-w-4xl bg-[#0e1015] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
        style={{ maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white transition"
          aria-label="Close"
        >
          <CgClose size={18} />
        </button>

        {/* main img */}
        <div
          className="relative flex items-center justify-center bg-black overflow-hidden shrink-0"
          style={{ minHeight: '240px', maxHeight: '55vh' }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <MotionImage
              key={imgIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeOut' }}
              src={images[imgIndex]}
              alt={`${award.title} — photo ${imgIndex + 1}`}
              layout="fill"
              objectFit="contain"
            />
          </AnimatePresence>

          {/* prev / next */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                className="absolute left-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition"
                aria-label="Previous"
              >
                <CgChevronLeft size={24} />
              </button>
              <button
                onClick={() => go(1)}
                className="absolute right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition"
                aria-label="Next"
              >
                <CgChevronRight size={24} />
              </button>

              {/* counter */}
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] px-2.5 py-0.5 rounded-full bg-black/70 text-gray-300 pointer-events-none">
                {imgIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        {/* thumb strip */}
        {images.length > 1 && (
          <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-[#0a0c10] border-t border-white/5 shrink-0">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > imgIndex ? 1 : -1);
                  setImgIndex(i);
                }}
                className={`shrink-0 w-14 h-10 rounded-md overflow-hidden border-2 transition-all ${
                  i === imgIndex
                    ? 'border-red-500 opacity-100'
                    : 'border-transparent opacity-40 hover:opacity-75'
                }`}
              >
                <div className="w-full h-full relative">
                  <Image src={img} alt={`thumb-${i}`} layout="fill" objectFit="cover" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* info */}
        <div className="px-5 py-4 border-t border-white/5 shrink-0 overflow-y-auto">
          <div className="flex items-start gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-white leading-snug">{award.title}</h2>
              {award.category && (
                <p className="text-sm text-gray-400 mt-0.5">{award.category}</p>
              )}
              {award.description && (
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{award.description}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {award.academicYear && (
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-600/30 font-semibold">
                  {award.academicYear}
                </span>
              )}
            </div>
          </div>

          {/* badges */}
          {award.badges && award.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {award.badges.map((b, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          {/* tags */}
          {award.tags && award.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {award.tags.map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Lightbox;
