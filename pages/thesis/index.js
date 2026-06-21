import { useEffect, useMemo, useState } from "react";
import Head from "../../components/Head";
import ThesisCard from "../../components/Card/Thesis";
import { _Transition_Page } from "../../lib/animations";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefetcher } from "../../components/Prefetcher";
import { useRouter } from "next/router";
import { client } from "../../lib/sanity";
import { THESIS_LIST_QUERY } from "../../lib/groq/thesis";
import Pagination from "../../components/Pagination";
import SkeletonGrid from "../../components/ui/SkeletonGrid";

const ALL = "All";
const ITEMS_PER_PAGE = 10;

export async function getStaticProps() {
  try {
    const thesis = await client.fetch(THESIS_LIST_QUERY);
    return { props: { initialThesis: thesis || [] }, revalidate: 10 };
  } catch (error) {
    console.error("Error fetching thesis:", error);
    return { props: { initialThesis: [] }, revalidate: 10 };
  }
}

export default function Thesis({ initialThesis }) {
  const router = useRouter();
  const { thesis } = usePrefetcher();
  const [thesisList, setThesisList] = useState(initialThesis);
  const [selectedYear, setSelectedYear] = useState(ALL);
  const [selectedDepartment, setSelectedDepartment] = useState(ALL);
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [sortLatest, setSortLatest] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [isYearOpen, setIsYearOpen] = useState(true);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedDepartment, selectedCategory, sortLatest]);

  const departments = [ALL, "BSCS", "BSEMC", "BSIT", "BSIS", "Other"];

  useEffect(() => {
    if (thesis?.length > 0) {
      setThesisList(thesis);
      setIsInitialLoad(false);
    }
  }, [thesis]);

  useEffect(() => {
    if (initialThesis?.length > 0) {
      setIsInitialLoad(false);
    }
  }, [initialThesis]);

  useEffect(() => {
    if (router.isReady) {
      const { year, department, category } = router.query;

      if (year) {
        setSelectedYear(year);
        setIsYearOpen(true);
      }
      if (department) {
        setSelectedDepartment(department);
        setIsDepartmentOpen(true);
      }
      if (category) {
        setSelectedCategory(category);
        setIsCategoryOpen(true);
      }
    }
  }, [router.isReady, router.query]);

  // Extract unique academic years dynamically based on provided theses
  const years = useMemo(() => {
    const list = [
      ...new Set(thesisList.map((t) => t.academicYear || "Unknown")),
    ]
      .sort()
      .reverse();
    return [ALL, ...list];
  }, [thesisList]);

  // 1. Filter the base list by Year and Department first to determine available categories
  const listFilteredByYearAndDept = useMemo(() => {
    let list = thesisList;
    if (selectedYear !== ALL) {
      list = list.filter((t) => {
        const yearVal = String(t.academicYear || "Unknown");
        return yearVal === String(selectedYear) || yearVal.includes(String(selectedYear));
      });
    }
    if (selectedDepartment !== ALL) {
      const deptMap = {
        BSCS: "CS",
        BSEMC: "EMC",
        BSIT: "IT",
        BSIS: "IS",
        Other: "Other",
      };
      const target = deptMap[selectedDepartment];
      list = list.filter((t) => (t.department || "Other") === target);
    }
    return list;
  }, [thesisList, selectedYear, selectedDepartment]);

  // 2. Extract unique tags dynamically based on the year/dept context
  const categories = useMemo(() => {
    const counts = {};
    listFilteredByYearAndDept.forEach((t) => {
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
  }, [listFilteredByYearAndDept]);

  // 3. Safety: Reset selected category if it's no longer present in the dynamic list
  useEffect(() => {
    if (selectedCategory === ALL) return;
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory(ALL);
    }
  }, [categories, selectedCategory]);

  const filteredList = useMemo(() => {
    let list = listFilteredByYearAndDept;
    if (selectedCategory !== ALL) {
      list = list.filter((t) =>
        (t.tags || []).some(
          (tag) => tag.toLowerCase() === selectedCategory.toLowerCase(),
        ),
      );
    }

    return [...list].sort((a, b) => {
      const diff = new Date(b._createdAt) - new Date(a._createdAt);
      return sortLatest ? diff : -diff;
    });
  }, [listFilteredByYearAndDept, selectedCategory, sortLatest]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const displayList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredList.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredList, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderFilters = () => (
    <div className="flex flex-col gap-[1.5rem] w-full">
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
              <div className="flex flex-col">
                {years.map((y) => {
                  const isActive = selectedYear === y || (selectedYear && y.includes(selectedYear));
                  return (
                    <button
                      key={y}
                      onClick={() => setSelectedYear(y)}
                      className={`text-left px-3 py-1.5 rounded-[4px] text-[0.875rem] font-normal leading-normal transition-colors ${isActive
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

      {/* Department Filter */}
      <div className="flex flex-col gap-1.5">
        <div
          className="flex items-center gap-1.5 text-[#8C8C8C] text-[0.875rem] font-normal cursor-pointer hover:text-white transition-colors pl-2 select-none"
          onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
        >
          <span>Department</span>
          <svg
            width="10" height="6" viewBox="0 0 10 6" fill="none"
            className={`transition-transform duration-200 ${isDepartmentOpen ? "" : "rotate-180"}`}
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
          {isDepartmentOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col">
                {departments.map((d) => {
                  const isActive = selectedDepartment === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDepartment(d)}
                      className={`text-left px-3 py-1.5 rounded-[4px] text-[0.875rem] font-normal leading-normal transition-colors ${isActive
                        ? "bg-[#2A2A2A] text-white"
                        : "text-[#EFEFEF] hover:bg-[#202020]"
                      }`}
                    >
                      {d}
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
              <div className="flex flex-col">
                {categories.map((c) => {
                  const isActive = selectedCategory === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`text-left px-3 py-1.5 rounded-[4px] text-[0.875rem] font-normal leading-normal transition-colors ${isActive
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
  );

  return (
    <>
      <Head
        title="Thesis | Ingo"
        description="Search projects, open each profile, and watch project outputs."
        url="/thesis"
      />

      <motion.main
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-[1440px] w-[var(--container-width)] md:w-[80%] mx-auto pt-[4rem] pb-[12rem] z-10 min-h-screen relative"
      >
        {/* Full-height dashed borders sticking to the cards container */}
        <div className="absolute left-[calc(240px+4rem)] top-0 bottom-0 w-px border-l border-dashed border-[#2F2F2F] hidden md:block" />
        <div className="absolute right-0 top-0 bottom-0 w-px border-r border-dashed border-[#2F2F2F] hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] md:gap-[4rem] min-h-full">
          {/* Sidebar */}
          <aside className="flex flex-col w-full relative lg:sticky lg:top-[4rem] h-fit pr-4 md:pr-0 pb-4 md:pb-0 z-20">
            <h1 className="text-[1.6rem] text-[#ffffff] font-semibold mb-4 tracking-normal">
              Thesis
            </h1>
            <p className="text-[1rem] text-[#8C8C8C] font-normal leading-normal mb-4 md:mb-10 max-w-[95%]">
              Search projects, open each profile, and watch project outputs.
            </p>

            {/* Desktop Filters */}
            <div className="hidden md:block">
              {renderFilters()}
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex flex-col w-full relative min-h-full">
            <div className="flex items-center justify-between md:justify-end mb-[1rem] mt-0 md:mt-2 w-full relative z-30">

              {/* Mobile Filter Button & Dropdown */}
              <div className="relative md:hidden">
                <button
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  className={`flex items-center gap-2 text-[0.875rem] font-normal text-[#EFEFEF] hover:text-white transition-colors border border-[#2F2F2F] px-4 py-2 rounded-[4px] ${isMobileFilterOpen ? "bg-[#252525]" : "bg-[#1A1A1A]"
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  <span>Filter</span>
                </button>

                <AnimatePresence>
                  {isMobileFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-[calc(100%+0.5rem)] left-0 w-[260px] bg-[#181818] border border-[#2F2F2F] rounded-[8px] pt-2 pb-4 px-4 shadow-xl z-50 overflow-y-auto max-h-[60vh] flex flex-col items-start"
                    >
                      {/* X close button for mobile convenience */}
                      <button
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="self-end text-[#8C8C8C] hover:text-white mb-0.5 p-1 -mr-1"
                      >
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 1L1 13M1 1l12 12" />
                        </svg>
                      </button>

                      {renderFilters()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sort By Container */}
              <div className="flex items-center gap-1.5">
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

            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedYear}-${selectedCategory}-${sortLatest}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-8 lg:gap-[1.5rem]"
              >
                {isInitialLoad ? (
                  <SkeletonGrid cardType="thesis" count={4} />
                ) : displayList.length === 0 ? (
                  <p className="text-[1rem] text-[#8C8C8C] font-normal leading-normal text-center w-full py-10">
                    No thesis projects found.
                  </p>
                ) : (
                  displayList.map((thesis, i) => (
                    <ThesisCard key={thesis._id || i} thesis={thesis} />
                  ))
                )}
              </motion.div>
            </AnimatePresence>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </section>
        </div>
      </motion.main>
    </>
  );
}
