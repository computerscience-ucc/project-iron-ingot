import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";
import Image from "next/image";

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
    <div className="relative">
      {/* header */}
      <div className="pt-0 pb-6">
        <h3 className="text-[1.125rem] md:text-[1.25rem] font-semibold text-[#EFEFEF] tracking-normal leading-[1.3]">
          Showcase
        </h3>
      </div>

      {/* main image */}
      <div className="relative overflow-hidden aspect-[16/10] md:aspect-video">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[idx]}
              fill
              style={{ objectFit: "contain" }}
              sizes="100vw"
              alt={`Showcase ${idx + 1}`}
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-[6px] rounded-[6px] bg-black/40 hover:bg-white/10 text-white transition-colors">
              <CgChevronLeft size={20} />
            </button>
            <button onClick={() => go(1)} aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-[6px] rounded-[6px] bg-black/40 hover:bg-white/10 text-white transition-colors">
              <CgChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Counter (Bottom Centered) */}
      <div className="flex justify-center py-4">
        <p className="text-[1rem] text-[#8C8C8C] font-normal leading-relaxed">
          {idx + 1} / {images.length}
        </p>
      </div>

      {/* thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 pb-4 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
              className={`shrink-0 w-12 h-9 rounded-[4px] overflow-hidden border transition-all ${
                i === idx ? "border-[#FF5154] opacity-100" : "border-transparent opacity-40 hover:opacity-100"
              }`}
            >
              <Image src={img} width={48} height={36} style={{ objectFit: "cover" }} alt={`Showcase thumbnail ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowcaseGallery;
