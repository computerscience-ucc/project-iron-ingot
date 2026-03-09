import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import Image from 'next/image';

const ShowcaseGallery = ({ images }) => {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (d) => {
    setDir(d);
    setIdx((i) => (i + d + images.length) % images.length);
  };

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0a0c10] shadow-xl">
      {/* header */}
      <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2 flex-wrap">
        <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase break-words leading-snug">
          Project Showcase
        </span>
        <span className="text-[10px] text-gray-600 ml-auto shrink-0">
          {idx + 1} / {images.length}
        </span>
      </div>

      {/* main image */}
      <div className="relative bg-black overflow-hidden" style={{ height: '320px' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={images[idx]}
              layout="fill"
              objectFit="contain"
              alt={`Showcase ${idx + 1}`}
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition">
              <CgChevronLeft size={18} />
            </button>
            <button onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition">
              <CgChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-1.5 px-3 py-2.5 overflow-x-auto bg-[#080a0e] border-t border-white/5">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
              className={`shrink-0 w-12 h-9 rounded-md overflow-hidden border-2 transition-all ${
                i === idx ? 'border-red-500 opacity-100' : 'border-transparent opacity-35 hover:opacity-70'
              }`}
            >
              <Image src={img} width={48} height={36} objectFit="cover" alt={`thumb-${i}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowcaseGallery;
