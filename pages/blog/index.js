import { useEffect, useMemo, useState } from 'react';

import BlogCard from '../../components/Card/Blog';
import Head from '../../components/Head';
import TopGradient from '../../components/TopGradient';
import { _Transition_Page } from '../../lib/animations';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefetcher } from '../../components/Prefetcher';
import { CgArrowUp, CgArrowDown, CgSearch, CgClose } from 'react-icons/cg';
import YearPill from '../../components/YearPill';

// ─── helpers ───────────────────────────────────
const ALL = 'All';

function getYears(blogs) {
  const years = [...new Set(blogs.map((b) => b.academicYear || 'Unknown'))].sort().reverse();
  return [ALL, ...years];
}

function authorString(authors) {
  return (authors || [])
    .map((a) => `${a.fullName?.firstName || ''} ${a.fullName?.lastName || ''}`.trim())
    .join(' ');
}



// ─── Page ──────────────────────────────────────
const BlogPage = () => {
  const { blogs } = usePrefetcher();
  const [blogList, setBlogList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(ALL);
  const [sortAsc, setSortAsc] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setBlogList(blogs || []);
  }, [blogs]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const years = useMemo(() => getYears(blogList), [blogList]);

  const filtered = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    let list = selectedYear === ALL
      ? blogList
      : blogList.filter((b) => (b.academicYear || 'Unknown') === selectedYear);
    if (q) {
      list = list.filter((b) => {
        const titleMatch = (b.title || '').toLowerCase().includes(q);
        const tagMatch = (b.tags || []).some((t) => (t || '').toLowerCase().includes(q));
        const authorMatch = authorString(b.authors).toLowerCase().includes(q);
        const yearMatch = (b.academicYear || '').toLowerCase().includes(q);
        return titleMatch || tagMatch || authorMatch || yearMatch;
      });
    }
    return [...list].sort((a, b) => {
      const diff = new Date(a._createdAt) - new Date(b._createdAt);
      return sortAsc ? diff : -diff;
    });
  }, [blogList, selectedYear, sortAsc, searchValue]);

  return (
    <>
      <TopGradient colorLeft={'#fd0101'} colorRight={'#a50000'} />
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
        className="py-36 z-10 min-h-screen"
      >
        {/* Header */}
        <div className="flex flex-col gap-2 justify-center mt-16">
          <p className="text-4xl font-semibold">Blog</p>
          <p className="text-lg font-semibold text-white/60">
            See what CS students are up to in the BSCS Program
          </p>
        </div>

        {/* Search bar */}
        <div className="mt-10 relative max-w-md">
          <CgSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by title, author, tag, or year…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-9 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/25 transition-colors"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              <CgClose size={14} />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {/* Year pills */}
          <div className="flex flex-wrap gap-1">
            {years.map((y) => (
              <YearPill
                key={y}
                label={y}
                active={selectedYear === y}
                onClick={() => setSelectedYear(y)}
              />
            ))}
          </div>

          {/* Sort toggle */}
          <button
            onClick={() => setSortAsc((v) => !v)}
            className="ml-auto flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors border border-white/10 rounded-full px-3 py-1.5"
          >
            {sortAsc ? <CgArrowUp size={14} /> : <CgArrowDown size={14} />}
            {sortAsc ? 'Oldest first' : 'Newest first'}
          </button>
        </div>

        {/* Grid */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedYear + sortAsc}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filtered.map((blog, index) => (
                    <div key={blog._id || index}>
                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-lg">
                  No blog posts found{searchValue ? ` for "${searchValue}"` : selectedYear !== ALL ? ` in ${selectedYear}` : ''}.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </>
  );
};

export default BlogPage;

