import { useEffect, useMemo, useState } from "react";
import BlogCard from "../../components/Card/Blog";
import Head from "../../components/Head";
import { _Transition_Page } from "../../lib/animations";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefetcher } from "../../components/Prefetcher";

const ALL = "All";

function getYears(blogs) {
  const years = [...new Set(blogs.map((b) => b.academicYear || "Unknown"))].sort().reverse();
  return [ALL, ...years];
}

export default function BlogPage() {
  const { blogs } = usePrefetcher();
  const [blogList, setBlogList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(ALL);
  const [sortLatest, setSortLatest] = useState(true);

  useEffect(() => {
    setBlogList(blogs || []);
  }, [blogs]);

  const years = useMemo(() => getYears(blogList), [blogList]);

  const filtered = useMemo(() => {
    let list = selectedYear === ALL
      ? blogList
      : blogList.filter((b) => (b.academicYear || "Unknown") === selectedYear);

    return [...list].sort((a, b) => {
      const diff = new Date(b._createdAt) - new Date(a._createdAt);
      return sortLatest ? diff : -diff;
    });
  }, [blogList, selectedYear, sortLatest]);



  return (
    <>
      <Head
        title="Blog | Ingo"
        description="Latest blog posts from BSCS students and faculty. Computer science trends, tutorials, and insights."
        url="/blog"
      />

      <motion.main
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-[1200px] w-[var(--container-width)] md:w-[80%] mx-auto pt-[2rem] pb-[4rem] z-10 min-h-screen relative"
      >
        <div className="flex flex-col gap-3 justify-center mt-8 mb-6 text-left">
          <h1 className="text-[1.6rem] md:text-[1.8rem] lg:text-[2rem] text-[#ffffff] font-semibold tracking-normal">
            Blog
          </h1>
          <p className="text-[1rem] text-[#8C8C8C] font-normal leading-normal max-w-[600px]">
            See what CS students are up to in the BSCS Program
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

        {/* Blog List */}
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedYear}-${sortLatest}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-8 lg:gap-[1.5rem]"
            >
              {filtered.length === 0 ? (
                <p className="text-[1rem] text-[#8C8C8C] font-normal leading-normal text-center w-full py-10">
                  No blog posts found.
                </p>
              ) : (
                filtered.map((blog, i) => (
                  <BlogCard key={blog._id || i} blog={blog} />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </>
  );
}
