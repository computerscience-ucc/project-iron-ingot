import { useEffect, useMemo, useState } from "react";
import Head from "../../components/Head";
import GalleryCard from "../../components/Card/Gallery";
import { _Transition_Page } from "../../lib/animations";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefetcher } from "../../components/Prefetcher";

const ALL = "All";

export default function GalleryPage() {
  const { gallery } = usePrefetcher();
  const [projectList, setProjectList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(ALL);
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [sortLatest, setSortLatest] = useState(true);

  const [isYearOpen, setIsYearOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  useEffect(() => {
    setProjectList(gallery || []);
  }, [gallery]);

  // Extract unique years dynamically based on provided projects
  const years = useMemo(() => {
    const list = [
      ...new Set(projectList.map((t) => {
        const d = t.projectDate || t._createdAt;
        return d ? new Date(d).getFullYear().toString() : "Unknown";
      })),
    ].sort().reverse();
    return [ALL, ...list];
  }, [projectList]);

  // 1. Filter the base list by Year first to determine available categories
  const listFilteredByYear = useMemo(() => {
    let list = projectList;
    if (selectedYear !== ALL) {
      list = list.filter((t) => {
        const d = t.projectDate || t._createdAt;
        const year = d ? new Date(d).getFullYear().toString() : "Unknown";
        return year === selectedYear;
      });
    }
    return list;
  }, [projectList, selectedYear]);

  // 2. Extract unique tags dynamically based on the year
  const categories = useMemo(() => {
    const counts = {};
    listFilteredByYear.forEach((t) => {
      (t.tags || []).forEach((tag) => {
        const key = tag.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    // Capitalize first letter for display
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const result = sorted.map(capitalize);
    return [ALL, ...result];
  }, [listFilteredByYear]);

  // 3. Safety: Reset selected category if it's no longer present in the dynamic list
  useEffect(() => {
    if (selectedCategory === ALL) return;
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory(ALL);
    }
  }, [categories, selectedCategory]);

  const filteredList = useMemo(() => {
    let list = listFilteredByYear;
    if (selectedCategory !== ALL) {
      list = list.filter((t) =>
        (t.tags || []).some(
          (tag) => tag.toLowerCase() === selectedCategory.toLowerCase(),
        ),
      );
    }

    return [...list].sort((a, b) => {
      const dateA = new Date(a.projectDate || a._createdAt);
      const dateB = new Date(b.projectDate || b._createdAt);
      const diff = dateB - dateA;
      return sortLatest ? diff : -diff;
    });
  }, [listFilteredByYear, selectedCategory, sortLatest]);

  return (
    <>
      <Head
        title="Gallery of Projects | Ingo"
        description="Search projects, open each profile, and watch project outputs."
        url="/gallery"
      />

      <motion.main
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-[1440px] w-[80%] mx-auto pt-[4rem] pb-[12rem] z-10 min-h-screen relative"
      >
        {/* Full-height dashed borders sticking to the cards container */}
        <div className="absolute left-[calc(240px+4rem)] top-0 bottom-0 w-px border-l border-dashed border-[#2F2F2F] hidden md:block" />
        <div className="absolute right-0 top-0 bottom-0 w-px border-r border-dashed border-[#2F2F2F] hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] md:gap-[4rem] min-h-full">
          {/* Sidebar */}
          <aside className="flex flex-col w-full sticky top-[4rem] h-fit pr-4 md:pr-0 pb-10 md:pb-0">
            <h1 className="text-[2rem] text-[#ffffff] font-semibold mb-4 tracking-normal leading-tight">
              Gallery of Projects
            </h1>
            <p className="text-[1rem] text-[#8C8C8C] font-normal leading-normal mb-10 max-w-[95%]">
              Search projects, open each profile, and watch project outputs.
            </p>

            <div className="flex flex-col gap-[1.5rem]">
              {/* Year Filter */}
              <div className="flex flex-col gap-1.5">
                <div
                  className="flex items-center gap-1.5 text-[#8C8C8C] text-[0.875rem] font-normal cursor-pointer hover:text-white transition-colors pl-2 select-none"
                  onClick={() => setIsYearOpen(!isYearOpen)}
                >
                  <span>Year</span>
                  <svg
                    width="10" height="6" viewBox="0 0 10 6" fill="none"
                    className={`transition-transform duration-200 ${isYearOpen ? "" : "rotate-180"}`}
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <AnimatePresence>
                  {isYearOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col pr-6">
                        {years.map((y) => {
                          const isActive = selectedYear === y;
                          return (
                            <button
                              key={y}
                              onClick={() => setSelectedYear(y)}
                              className={`text-left px-3 py-1.5 rounded-[4px] text-[0.875rem] font-normal leading-normal transition-colors ${
                                isActive
                                  ? "bg-[#EA2B2E] text-white"
                                  : "text-[#EFEFEF] hover:bg-[#202020]"
                              }`}
                            >
                              {y}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Category Filter */}
              <div className="flex flex-col gap-1.5">
                <div
                  className="flex items-center gap-1.5 text-[#8C8C8C] text-[0.875rem] font-normal cursor-pointer hover:text-white transition-colors pl-2 select-none"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <span>Category</span>
                  <svg
                    width="10" height="6" viewBox="0 0 10 6" fill="none"
                    className={`transition-transform duration-200 ${isCategoryOpen ? "" : "rotate-180"}`}
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col pr-6">
                        {categories.map((c) => {
                          const isActive = selectedCategory === c;
                          return (
                            <button
                              key={c}
                              onClick={() => setSelectedCategory(c)}
                              className={`text-left px-3 py-1.5 rounded-[4px] text-[0.875rem] font-normal leading-normal transition-colors ${
                                isActive
                                  ? "bg-[#2A2A2A] text-white"
                                  : "text-[#EFEFEF] hover:bg-[#202020]"
                              }`}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex flex-col w-full relative min-h-full">
            <div className="flex items-center justify-end mb-[1rem] mt-2 gap-1.5 relative z-10">
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

            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedYear}-${selectedCategory}-${sortLatest}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-[1.5rem]"
              >
                {filteredList.length === 0 ? (
                  <p className="text-[1rem] text-[#8C8C8C] font-normal leading-normal text-center w-full py-10">
                    No projects found.
                  </p>
                ) : (
                  filteredList.map((project, i) => (
                    <GalleryCard key={project._id || i} project={project} />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </motion.main>
    </>
  );
}
