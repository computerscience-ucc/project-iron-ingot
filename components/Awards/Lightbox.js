import { useState, useMemo, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CgClose, CgChevronLeft, CgChevronRight } from "react-icons/cg";
import Image from "next/image";
import { preloadImage } from "../../lib/imageCache";
import { getBlurPlaceholder } from "../../lib/imagePlaceholders";

const formatDescription = (text) => {
  if (!text) return null;
  const boldRegex =
    /([\uD835\uDC00-\uD835\uDC19\uD835\uDC1A-\uD835\uDC33\uD835\uDFCE-\uD835\uDFD7]+)/gu;

  const diffUpper = 0x1d400 - 0x41;
  const diffLower = 0x1d41a - 0x61;
  const diffDigit = 0x1d7ce - 0x30;

  const normalize = (str) => {
    let result = "";
    for (const char of str) {
      const code = char.codePointAt(0);
      if (code >= 0x1d400 && code <= 0x1d419)
        result += String.fromCharCode(code - diffUpper);
      else if (code >= 0x1d41a && code <= 0x1d433)
        result += String.fromCharCode(code - diffLower);
      else if (code >= 0x1d7ce && code <= 0x1d7d7)
        result += String.fromCharCode(code - diffDigit);
      else result += char;
    }
    return result;
  };

  const parts = text.split(boldRegex);
  return parts.map((part, i) => {
    if (part.match(boldRegex)) {
      return (
        <strong key={i} className="font-bold text-white">
          {normalize(part)}
        </strong>
      );
    }
    return part;
  });
};

const Lightbox = ({ award, onClose }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const images = useMemo(() => {
    // Standardize to objects with url and metadata
    let raw = [];
    if (award.images && award.images.length > 0) raw = award.images;
    else if (award.headerImage) raw = [award.headerImage];

    return raw.map(img => {
      if (typeof img === "string") return { url: img, metadata: null };
      return img;
    });
  }, [award]);

  const currentImg = images[imgIndex];
  const aspectRatio = currentImg?.metadata?.aspectRatio || 1.5;

  const go = useCallback((dir) => {
    if (images.length < 2) return;
    setDirection(dir);
    setImgIndex((i) => (i + dir + images.length) % images.length);
  }, [images.length]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, go]);

  // body lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Preload all award images into cache on open
  useEffect(() => {
    if (!images?.length) return;
    images.forEach((img) => {
      if (img?.url) preloadImage(img.url).catch(() => {});
    });
  }, [images]);

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
      className="fixed inset-0 z-[200] flex justify-center bg-black/92 backdrop-blur-md overflow-y-auto p-4 sm:p-10 custom-scrollbar"
      onClick={onClose}
      data-lenis-prevent
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative max-w-[95vw] bg-[#121212] border border-[#5B5B5B] border-dashed flex flex-col my-auto"
        style={{
          height: "fit-content",
          width: `min(95vw, calc(min(650px, 70vh) * ${aspectRatio}))`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Markers */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-[#FF5154] z-50 transform -translate-x-[1px] -translate-y-[1px]" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-[#FF5154] z-50 transform translate-x-[1px] -translate-y-[1px]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#FF5154] z-50 transform -translate-x-[1px] translate-y-[1px]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#FF5154] z-50 transform translate-x-[1px] translate-y-[1px]" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 rounded-[6px] bg-white/5 hover:bg-white/10 text-white transition-colors"
          aria-label="Close"
        >
          <CgClose size={18} />
        </button>

        {/* main img */}
        <div
          className="relative flex items-center justify-center bg-black overflow-hidden shrink-0 w-full"
          style={{ aspectRatio: aspectRatio }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={imgIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[imgIndex].url}
                alt={`${award.title} — photo ${imgIndex + 1}`}
                fill
                style={{ objectFit: "contain" }}
                sizes="100vw"
                priority
                placeholder="blur"
                blurDataURL={getBlurPlaceholder(images[imgIndex])}
              />
            </motion.div>
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
          <div
            className="flex gap-2 px-4 py-3 overflow-x-auto bg-[#1A1A1A] border-t border-[#5B5B5B] border-dashed shrink-0 custom-scrollbar"
            data-lenis-prevent
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > imgIndex ? 1 : -1);
                  setImgIndex(i);
                }}
                className={`shrink-0 w-14 h-10 rounded-md overflow-hidden border-2 transition-all ${
                  i === imgIndex
                    ? "border-red-500 opacity-100"
                    : "border-transparent opacity-40 hover:opacity-75"
                }`}
              >
                <div className="w-full h-full relative">
                  <Image src={img.url} alt={`thumb-${i}`} fill style={{ objectFit: "cover" }} sizes="100px" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* info */}
        <div className="px-4 py-4 sm:px-5 sm:py-6 border-t border-[#5B5B5B] border-dashed shrink-0">
          <div className="mb-3 sm:mb-4">
            <h2 className="text-[1rem] sm:text-[1.25rem] font-semibold text-white tracking-tight leading-tight mb-2 sm:mb-3">{award.title}</h2>
            {award.description && (
              <p className="text-[#EFEFEF] text-[0.8rem] sm:text-[0.9rem] leading-relaxed font-normal whitespace-pre-wrap">
                {formatDescription(award.description)}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {award.category && (
              <span className="px-1.5 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.65rem] sm:text-[0.75rem] font-sans font-medium uppercase tracking-wide">
                {award.category}
              </span>
            )}
            {award.badges && award.badges.length > 0 && award.badges.map((b, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.65rem] sm:text-[0.75rem] font-sans font-medium uppercase tracking-wide">
                {b}
              </span>
            ))}
            {award.academicYear && (
              <span className="px-1.5 py-0.5 bg-[#F02E31] text-[#EFEFEF] text-[0.65rem] sm:text-[0.75rem] font-sans font-medium tracking-wide">
                {award.academicYear}
              </span>
            )}
            {award.tags && award.tags.length > 0 && award.tags.map((t, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-[#121212] border border-[#5B5B5B] border-dashed text-[#EFEFEF] text-[0.65rem] sm:text-[0.75rem] font-sans font-medium uppercase tracking-wide">
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Lightbox;
