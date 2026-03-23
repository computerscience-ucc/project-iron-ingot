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

  const rows = useMemo(() => {
    const res = [];
    for (let i = 0; i < filtered.length; i += 2) {
      res.push(filtered.slice(i, i + 2));
    }
    return res;
  }, [filtered]);

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
        className="max-w-[1440px] w-[80%] mx-auto pt-[4rem] pb-[4rem] z-10 min-h-screen relative"
      >
        {/* Full-height vertical borders for the layout sides */}
        <div className="absolute left-[calc(240px+4rem)] top-0 bottom-0 w-px border-l border-dashed border-[#2F2F2F] hidden md:block" />
        <div className="absolute right-0 top-0 bottom-0 w-px border-r border-dashed border-[#2F2F2F] hidden md:block" />

        {/* Full-height vertical dashed borders between columns */}
        {/* These calculate the center of the 1fr section and add/subtract 1.5rem offset */}
        <div className="absolute left-[calc(240px+4rem+(100%-(240px+4rem))/2-1.5rem)] top-0 bottom-0 w-px border-l border-dashed border-[#2F2F2F] hidden md:block" />
        <div className="absolute left-[calc(240px+4rem+(100%-(240px+4rem))/2+1.5rem)] top-0 bottom-0 w-px border-l border-dashed border-[#2F2F2F] hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] md:gap-[4rem] min-h-full">
          {/* Sidebar */}
          <aside className="flex flex-col w-full sticky top-[4rem] h-fit pr-4 md:pr-0 pb-10 md:pb-0">
            <h1 className="text-[2rem] text-[#ffffff] font-semibold mb-4 tracking-normal">
              Blog
            </h1>
            <p className="text-[1rem] text-[#8C8C8C] font-normal leading-normal mb-10 max-w-[95%]">
              See what CS students are up to in the BSCS Program
            </p>

            <div className="flex flex-col gap-[2.5rem]">
              {/* Year Filter */}
              <div className="flex flex-col gap-3">
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
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex flex-col w-full relative min-h-full">
            <div className="flex items-center justify-end mb-[1.5rem] mt-2 gap-1.5 relative z-10">
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
                key={`${selectedYear}-${sortLatest}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                {rows.length === 0 ? (
                  <p className="text-[1rem] text-[#8C8C8C] font-normal leading-normal text-center w-full py-10">
                    No blog posts found.
                  </p>
                ) : (
                  rows.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="grid grid-cols-1 md:grid-cols-2 gap-x-12 pb-4 mb-12 border-t border-b border-dashed border-[#2F2F2F]"
                    >
                      {row.map((blog, index) => (
                        <BlogCard key={blog._id || index} blog={blog} />
                      ))}
                    </div>
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
