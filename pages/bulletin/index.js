import { useEffect, useMemo, useState } from "react";
import Head from "../../components/Head";
import { _Transition_Page } from "../../lib/animations";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefetcher } from "../../components/Prefetcher";
import dayjs from "dayjs";
import Link from "next/link";

const ALL = "All";

export default function Bulletin() {
  const { bulletins } = usePrefetcher();
  const [bulletinList, setBulletinList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(ALL);
  const [sortLatest, setSortLatest] = useState(true);

  useEffect(() => {
    setBulletinList(bulletins || []);
  }, [bulletins]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const years = useMemo(() => {
    const list = [
      ...new Set(bulletinList.map((b) => dayjs(b._updatedAt || b._createdAt).format("YYYY"))),
    ].sort().reverse();
    return [ALL, ...list];
  }, [bulletinList]);

  const filteredList = useMemo(() => {
    let list = bulletinList;
    if (selectedYear !== ALL) {
      list = list.filter((b) => dayjs(b._updatedAt || b._createdAt).format("YYYY") === selectedYear);
    }

    return [...list].sort((a, b) => {
      const diff = new Date(b._updatedAt || b._createdAt) - new Date(a._updatedAt || a._createdAt);
      return sortLatest ? diff : -diff;
    });
  }, [bulletinList, selectedYear, sortLatest]);

  return (
    <>
      <Head
        title="Bulletin | Ingo"
        description="Official BSCS program bulletins, announcements, and important updates from the Computer Science department."
        url="/bulletin"
      />

      <motion.main
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-[1200px] w-[80%] mx-auto pt-[2rem] pb-[4rem] z-10 min-h-screen relative"
      >
        <div className="flex flex-col gap-3 justify-center mt-8 mb-6 text-left">
          <h1 className="text-[2rem] text-[#ffffff] font-semibold tracking-normal">
            Bulletin
          </h1>
          <p className="text-[1rem] text-[#8C8C8C] font-normal leading-normal max-w-[600px]">
            Celebrating the milestones, breakthroughs, and outstanding achievements of
            our BSCS students as they redefine excellence in technology.
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
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

          <div className="flex items-center gap-1.5 shrink-0 relative z-10">
            <span className="text-[0.875rem] text-[#8C8C8C] font-normal leading-normal">
              Sort by:
            </span>
            <button
              onClick={() => setSortLatest(!sortLatest)}
              className="flex items-center gap-4 pl-0 pr-3 py-1 text-[0.875rem] text-[#EFEFEF] font-normal leading-normal hover:text-white transition-colors"
            >
              <span>{sortLatest ? "Latest" : "Oldest"}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
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
        </div>

        {/* Bulletin List */}
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedYear}-${sortLatest}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col w-full"
            >
              {filteredList.length > 0 ? (
                filteredList.map((bulletin) => (
                  <Link href={`/bulletin/${bulletin.slug}`} key={bulletin._id} scroll={false}>
                    <div className="py-6 border-b border-dashed border-[#2F2F2F] group cursor-pointer hover:bg-white/[0.02] transition-colors rounded-sm -mx-4 px-4">
                      <h2 className="text-[1.25rem] font-semibold text-[#EFEFEF] group-hover:text-white mb-1.5 tracking-normal transition-colors leading-[1.3] line-clamp-2">
                        {bulletin.title}
                      </h2>
                      <p className="text-[#8C8C8C] text-[0.875rem] font-normal leading-normal mb-3.5">
                        By{" "}
                        {bulletin.authors
                          ?.map((a) => `${a.fullName?.firstName || ""} ${a.fullName?.lastName || ""}`.trim())
                          .filter(Boolean)
                          .join(", ") || "Unknown"}
                        {" "}on {dayjs(bulletin._updatedAt || bulletin._createdAt).format("MMM DD, YYYY")}
                      </p>
                      {bulletin.tags && bulletin.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap mt-2">
                          {bulletin.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.8rem] font-sans font-medium uppercase tracking-wide"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-[#8C8C8C] text-[1rem] font-normal leading-normal py-10 text-center border-b border-dashed border-[#2F2F2F]">
                  No bulletins found{selectedYear !== ALL ? ` for ${selectedYear}` : ""}.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </>
  );
}
