import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import Head from "../../components/Head";
import { _Transition_Page } from "../../lib/animations";
import { client } from "../../lib/sanity";
import Card from "../../components/Awards/Card";
import Lightbox from "../../components/Awards/Lightbox";

// ─────────────────────────────────────
// Sanity GROQ query
// ─────────────────────────────────────
const QUERY = `
  *[_type == 'award'] | order(academicYear desc, dateAwarded desc) {
    _id,
    "title": awardTitle,
    "slug": slug.current,
    "headerImage": headerImage.asset->{url, "metadata": metadata.dimensions},
    "images": awardImages[].asset->{url, "metadata": metadata.dimensions},
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

const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("All");
  const [sortAsc, setSortAsc] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    client.fetch(QUERY).then((data) => {
      const result = data || [];
      setAwards(result);
      setLoading(false);

      // Check if there's an ID in the query to open immediately
      if (router.query.id) {
        const award = result.find((a) => a._id === router.query.id);
        if (award) setLightbox(award);
      }
    });
  }, [router.query.id]);

  // Unique years derived from data
  const years = useMemo(() => {
    const s = new Set(awards.map((a) => a.academicYear).filter(Boolean));
    return ["All", ...[...s].sort((a, b) => b.localeCompare(a))];
  }, [awards]);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let list =
      selectedYear === "All"
        ? [...awards]
        : awards.filter((a) => a.academicYear === selectedYear);
    if (sortAsc) list.reverse();
    return list;
  }, [awards, selectedYear, sortAsc]);

  return (
    <>
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
        className="max-w-[1200px] w-[var(--container-width)] md:w-[80%] mx-auto pt-[2rem] pb-[4rem] z-10 min-h-screen relative"
      >
        {/* Header */}
        <div className="flex flex-col gap-3 justify-center mt-8 mb-6 text-left">
          <h1 className="text-[2rem] text-[#ffffff] font-semibold tracking-normal">
            Achievements &amp; Awards Gallery
          </h1>
          <p className="text-[1rem] text-[#8C8C8C] font-normal leading-normal max-w-[600px]">
            Celebrating the milestones, breakthroughs, and outstanding achievements of
            our BSCS students as they redefine excellence in technology.
          </p>
        </div>

        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-10">
          {/* Year pills */}
          <div className="flex flex-wrap items-center gap-2">
            {years.map((y) => {
              const isActive = selectedYear === y;
              return (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-3 py-1.5 rounded-[4px] text-[0.875rem] font-normal leading-normal transition-colors ${
                    isActive
                      ? "bg-[#EA2B2E] text-white"
                      : "bg-[#2A2A2A] text-[#EFEFEF] hover:bg-[#202020]"
                  }`}
                >
                  {y}
                </button>
              );
            })}
          </div>

          {/* Sort toggle */}
          {awards.length > 0 && (
            <div className="flex items-center gap-1.5 shrink-0 relative z-10">
              <span className="text-[0.875rem] text-[#8C8C8C] font-normal leading-normal">
                Sort by:
              </span>
              <button
                onClick={() => setSortAsc((v) => !v)}
                className="flex items-center gap-4 pl-0 pr-3 py-1 text-[0.875rem] text-[#EFEFEF] font-normal leading-normal hover:text-white transition-colors"
              >
                <span>{sortAsc ? "Oldest" : "Latest"}</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${sortAsc ? "rotate-180" : ""}`}>
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="columns-2 lg:columns-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[4px] bg-[#262626] opacity-50 animate-pulse mb-4"
                style={{ height: `${200 + (i % 3) * 100}px` }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-[#8C8C8C] text-[1rem] font-normal leading-normal py-10 text-center border-b border-dashed border-[#2F2F2F]">
            No awards found{selectedYear !== "All" ? ` for ${selectedYear}` : ""}.
          </div>
        )}

        {/* Masonry-like Columns */}
        {!loading && filtered.length > 0 && (
          <div className="columns-2 lg:columns-4 gap-4 space-y-4">
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
