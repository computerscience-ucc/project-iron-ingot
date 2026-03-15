import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import Image from 'next/image';
import Link from 'next/link';

const Carousel = ({ awards }) => {
  const items = awards?.filter((a) => a.headerImage) || [];
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const go = useCallback((d) => {
    if (items.length < 2) return;
    setDir(d);
    setIdx((i) => (i + d + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length < 2) return;
    timerRef.current = setInterval(() => go(1), 3500);
    return () => clearInterval(timerRef.current);
  }, [paused, items.length, go]);

  if (items.length === 0) return null;

  const current = items[idx];

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="flex flex-col gap-2 justify-center mb-32 mt-10">
      <div className="flex items-end justify-between mb-10">
        <p className="text-3xl font-semibold text-left md:text-center">
          Awards &amp; Achievements
        </p>
        <Link href="/awards">
          <a className="text-sm text-red-400 hover:text-red-300 transition hidden md:block">
            View all →
          </a>
        </Link>
      </div>

      <div
        className="relative w-full rounded-2xl overflow-hidden bg-[#0e1015] border border-white/5 shadow-xl"
        style={{ height: '480px' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={current.headerImage}
              alt={current.title}
              layout="fill"
              objectFit="cover"
              priority
            />
            {/* gradient wrapper */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {current.academicYear && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-600/80 text-white font-semibold">
                    {current.academicYear}
                  </span>
                )}
                {current.category && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300">
                    {current.category}
                  </span>
                )}
              </div>
              <p className="text-xl md:text-2xl font-bold text-white leading-snug">{current.title}</p>
              {current.description && (
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{current.description}</p>
              )}
              <Link href="/awards">
                <a className="inline-block mt-3 text-xs text-red-400 hover:text-red-300 transition font-semibold">
                  See all awards →
                </a>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* prev / next */}
        {items.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition"
              aria-label="Previous"
            >
              <CgChevronLeft size={22} />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition"
              aria-label="Next"
            >
              <CgChevronRight size={22} />
            </button>
          </>
        )}

        {/* dot indicators */}
        {items.length > 1 && (
          <div className="absolute top-4 right-4 z-10 flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? 'bg-white w-5' : 'bg-white/30 w-1.5 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* counter */}
        <span className="absolute top-4 left-4 z-10 text-[11px] px-2 py-0.5 rounded-full bg-black/60 text-gray-300">
          {idx + 1} / {items.length}
        </span>
      </div>
    </div>
  );
};

export default Carousel;
