import { useEffect, useMemo, useState } from "react";
import BlogCard from "../../components/Card/Blog";
import Head from "../../components/Head";
import { _Transition_Page } from "../../lib/animations";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefetcher } from "../../components/Prefetcher";
import Pagination from "../../components/Pagination";
import { client } from "../../lib/sanity";
import { BLOG_LIST_QUERY } from "../../lib/groq/blog";

const ALL = "All";
const ITEMS_PER_PAGE = 10;

export async function getStaticProps() {
  try {
    const blogs = await client.fetch(BLOG_LIST_QUERY);
    return { props: { initialBlogs: blogs || [] }, revalidate: 10 };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { props: { initialBlogs: [] }, revalidate: 10 };
  }
}

function getYears(blogs) {
  const years = [...new Set(blogs.map((b) => b.academicYear || "Unknown"))].sort().reverse();
  return [ALL, ...years];
}

export default function BlogPage({ initialBlogs }) {
  const { blogs } = usePrefetcher();
  const [blogList, setBlogList] = useState(initialBlogs);
  const [selectedYear, setSelectedYear] = useState(ALL);
  const [sortLatest, setSortLatest] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isYearOpen, setIsYearOpen] = useState(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, sortLatest]);

  useEffect(() => {
    if (blogs?.length > 0) setBlogList(blogs);
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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const rows = useMemo(() => {
    const res = [];
    for (let i = 0; i < displayList.length; i += 2) {
      res.push(displayList.slice(i, i + 2));
    }
    return res;
  }, [displayList]);

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
        className="max-w-[1440px] w-[var(--container-width)] md:w-[80%] mx-auto pt-[4rem] pb-[4rem] z-10 min-h-screen relative"
      >
        {/* Full-height vertical borders for the layout sides */}
        <div className="absolute left-[calc(240px+4rem)] top-0 bottom-0 w-px border-l border-dashed border-[#2F2F2F] hidden md:block" />
        <div className="absolute right-0 top-0 bottom-0 w-px border-r border-dashed border-[#2F2F2F] hidden md:block" />

        {/* Full-height vertical dashed borders between columns */}
        <div className="absolute left-[calc(240px+4rem+(100%-(240px+4rem))/2-1.5rem)] top-0 bottom-0 w-px border-l border-dashed border-[#2F2F2F] hidden md:block" />
        <div className="absolute left-[calc(240px+4rem+(100%-(240px+4rem))/2+1.5rem)] top-0 bottom-0 w-px border-l border-dashed border-[#2F2F2F] hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] md:gap-[4rem] min-h-full">
          {/* Sidebar */}
          <aside className="flex flex-col w-full relative lg:sticky lg:top-[4rem] h-fit pr-4 md:pr-0 pb-4 md:pb-0 z-20">
            <h1 className="text-[2rem] text-[#ffffff] font-semibold mb-4 tracking-normal">
              Blog
            </h1>
            <p className="text-[1rem] text-[#8C8C8C] font-normal leading-normal mb-6 max-w-[95%]">
              See what CS students are up to in the BSCS Program
            </p>

            <div className="flex flex-col gap-[1.5rem]">
              {/* Mobile / Tablet Filter + Sort */}
              <div className="lg:hidden flex flex-col gap-5">
                <div className="flex flex-col items-start gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {years.map((y) => {
                      const isActive = selectedYear === y;
                      return (
                        <button
                          key={y}
                          onClick={() => setSelectedYear(y)}
                          className={`px-3 py-1.5 rounded-[4px] text-[0.875rem] font-normal leading-normal transition-colors ${isActive
                            ? "bg-[#EA2B2E] text-white"
                            : "bg-[#2A2A2A] text-[#EFEFEF] hover:bg-[#202020]"
                          }`}
                        >
                          {y}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-1.5 relative z-10 pl-1">
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
              </div>

              {/* Desktop Filter (Thesis style) */}
              <div className="hidden lg:flex flex-col gap-1.5 w-full">
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
                          const isActive = selectedYear === y;
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
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex flex-col w-full relative min-h-full">
            <div className="hidden lg:block lg:mb-[1.5rem]" />

            {/* Desktop Sort By Container */}
            <div className="hidden lg:flex items-center justify-end mb-[1rem] w-full relative z-30">
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
                key={`${selectedYear}-${sortLatest}-${currentPage}`}
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
                      className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-y-0 gap-x-12 pb-6 mb-8 md:mb-12 border-t border-b border-dashed border-[#2F2F2F]"
                    >
                      {row.map((blog, index) => {
                        const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + rowIndex * 2 + index;
                        return <BlogCard key={blog._id || index} blog={blog} index={globalIndex} />;
                      })}
                    </div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="justify-center lg:justify-end"
            />
          </section>
        </div>
      </motion.main>
    </>
  );
}
