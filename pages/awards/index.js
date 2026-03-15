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
import { _Transition_Page } from '../../lib/animations';
import { client } from '../../lib/sanity';
import YearPill from '../../components/YearPill';
import Card from '../../components/Awards/Card';
import Lightbox from '../../components/Awards/Lightbox';

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
              <Card
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
