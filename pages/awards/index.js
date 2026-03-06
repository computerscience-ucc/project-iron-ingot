import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CgClose,
  CgChevronLeft,
  CgChevronRight,
  CgArrowUp,
  CgArrowDown,
} from 'react-icons/cg';
import Head from '../../components/Head';
import TopGradient from '../../components/TopGradient';
import { _Transition_Page } from '../../components/_Animations';
import { client } from '../../components/Prefetcher';

// ─────────────────────────────────────
// Sanity GROQ query
// ─────────────────────────────────────
const QUERY = `
  *[_type == 'award'] | order(academicYear desc, dateAwarded desc) {
    _id,
    "title": awardTitle,
    "slug": slug.current,
    "headerImage": headerImage.asset->url,
    "images": awardImages[].asset->url,
    "category": awardCategory,
    "badges": awardBadges,
    "description": awardDescription,
    academicYear,
    dateAwarded,
    tags
  }
`;

// ─────────────────────────────────────
// Year pill
// ─────────────────────────────────────
const YearPill = ({ year, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
      selected ? 'text-white' : 'text-gray-400 hover:text-gray-200'
    }`}
  >
    {selected && (
      <motion.span
        layoutId="awardYearPill"
        className="absolute inset-0 rounded-full bg-red-700/70"
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
    )}
    <span className="relative z-10">{year}</span>
  </button>
);

// ─────────────────────────────────────
// Award card (masonry tile)
// ─────────────────────────────────────
const AwardCard = ({ award, onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="relative group break-inside-avoid rounded-2xl overflow-hidden bg-[#0f1218] border border-white/5 hover:border-red-500/40 transition-all cursor-pointer shadow-md hover:shadow-red-900/20 hover:shadow-lg mb-6"
    >
      {award.headerImage ? (
        <>
          {!loaded && (
            <div className="w-full h-48 bg-[#1a1d24] animate-pulse" />
          )}
          <img
            src={award.headerImage}
            alt={award.title}
            onLoad={() => setLoaded(true)}
            className={`w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 ${
              loaded ? 'block' : 'hidden'
            }`}
          />
        </>
      ) : (
        <div className="w-full h-[260px] flex flex-col items-center justify-center bg-[#13151b] p-6 text-center gap-2">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-1">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-300">{award.title}</p>
          {award.category && (
            <p className="text-xs text-gray-500">{award.category}</p>
          )}
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-4">
        <div className="flex items-start justify-between gap-2">
          {award.academicYear && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-700/80 text-white font-semibold">
              {award.academicYear}
            </span>
          )}
          {award.images && award.images.length > 1 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-gray-300 ml-auto">
              {award.images.length} photos
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-snug">{award.title}</p>
          {award.category && (
            <p className="text-xs text-gray-300 mt-0.5">{award.category}</p>
          )}
          {award.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{award.description}</p>
          )}
          <p className="text-[10px] text-red-400 mt-2 font-medium">Click to view →</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────
// Lightbox
// ─────────────────────────────────────
const Lightbox = ({ award, onClose }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const images = useMemo(() => {
    if (award.images && award.images.length > 0) return award.images;
    if (award.headerImage) return [award.headerImage];
    return [];
  }, [award]);

  const go = (dir) => {
    if (images.length < 2) return;
    setDirection(dir);
    setImgIndex((i) => (i + dir + images.length) % images.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

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

        {/* Main image */}
        <div
          className="relative flex items-center justify-center bg-black overflow-hidden shrink-0"
          style={{ minHeight: '240px', maxHeight: '55vh' }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={imgIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeOut' }}
              src={images[imgIndex]}
              alt={`${award.title} — photo ${imgIndex + 1}`}
              className="max-w-full w-auto h-auto object-contain"
              style={{ maxHeight: '55vh' }}
            />
          </AnimatePresence>

          {/* Prev / Next */}
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

              {/* Counter */}
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] px-2.5 py-0.5 rounded-full bg-black/70 text-gray-300 pointer-events-none">
                {imgIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
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
                <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Award info */}
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

          {/* Badges */}
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

          {/* Tags */}
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

// ─────────────────────────────────────
// Main page
// ─────────────────────────────────────
const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortAsc, setSortAsc] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setLoading(true);
    client.fetch(QUERY).then((data) => {
      setAwards(data || []);
      setLoading(false);
    });
  }, []);

  // Unique years derived from data
  const years = useMemo(() => {
    const s = new Set(awards.map((a) => a.academicYear).filter(Boolean));
    return ['All', ...[...s].sort((a, b) => b.localeCompare(a))];
  }, [awards]);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let list =
      selectedYear === 'All'
        ? [...awards]
        : awards.filter((a) => a.academicYear === selectedYear);
    if (sortAsc) list.reverse();
    return list;
  }, [awards, selectedYear, sortAsc]);

  return (
    <>
      <TopGradient colorLeft="#fd0101" colorRight="#a50000" />
      <Head
        title="Awards | Ingo"
        description="Celebrating excellence in the BSCS Program"
        url="/awards"
      />

      {/* Lightbox portal */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox award={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>

      <motion.main
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-36 z-10"
      >
        {/* Header */}
        <div className="flex flex-col gap-1.5 mt-16 mb-8">
          <p className="text-4xl font-semibold">Achievements &amp; Awards Gallery</p>
          <p className="text-lg text-gray-400">Celebrating excellence in the BSCS Program</p>
        </div>

        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          {/* Year pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 flex-1">
            {years.map((y) => (
              <YearPill
                key={y}
                year={y}
                selected={selectedYear === y}
                onClick={() => setSelectedYear(y)}
              />
            ))}
          </div>

          {/* Sort toggle */}
          {awards.length > 0 && (
            <button
              onClick={() => setSortAsc((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-gray-200 transition-all shrink-0"
            >
              {sortAsc ? <CgArrowUp size={14} /> : <CgArrowDown size={14} />}
              {sortAsc ? 'Oldest first' : 'Newest first'}
            </button>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-2xl bg-[#13151b] animate-pulse mb-6"
                style={{ height: `${180 + (i % 3) * 60}px` }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-3">
            <svg className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <p className="text-sm">
              No awards found{selectedYear !== 'All' ? ` for ${selectedYear}` : ''}.
            </p>
          </div>
        )}

        {/* Masonry grid */}
        {!loading && filtered.length > 0 && (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
            {filtered.map((award) => (
              <AwardCard
                key={award._id}
                award={award}
                onClick={() => setLightbox(award)}
              />
            ))}
          </div>
        )}
      </motion.main>
    </>
  );
};

export default Awards;
