import { useEffect, useMemo, useState } from 'react';

import Head from '../../components/Head';
import ThesisCard from '../../components/card/Thesis';
import TopGradient from '../../components/TopGradient';
import { _Transition_Page } from '../../components/_Animations';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefetcer } from '../../components/Prefetcher';
import { CgArrowUp, CgArrowDown } from 'react-icons/cg';

// ─── constants ─────────────────────────────────
const ALL = 'All';
const DEPARTMENTS = ['CS', 'IT', 'IS', 'EMC', 'Other'];
const DEPT_LABEL = {
  CS: 'Computer Science',
  IT: 'Information Technology',
  IS: 'Information Systems',
  EMC: 'Entertainment & Multimedia Computing',
  Other: 'General / Other',
};

// ─── helpers ───────────────────────────────────
function getYears(list) {
  const years = [...new Set(list.map((t) => t.academicYear || 'Unknown'))].sort().reverse();
  return [ALL, ...years];
}

// ─── Year pill ─────────────────────────────────
const YearPill = ({ label, active, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
      active ? 'text-white' : 'text-white/50 hover:text-white/80'
    }`}
  >
    {active && (
      <motion.div
        layoutId="thesisYearPill"
        className="absolute inset-0 rounded-full bg-header-color/30 border border-header-color/40"
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
    )}
    <span className="relative z-10">{label}</span>
  </motion.button>
);

// ─── Dept section ──────────────────────────────
const DeptSection = ({ dept, items }) => {
  if (items.length === 0) return null;
  return (
    <div className="mt-12">
      {/* Header — two-line layout to prevent overflow */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-header-color/20 text-header-color border border-header-color/30">
            {dept}
          </span>
          <div className="flex-1 h-px bg-white/10 min-w-0" />
          <span className="flex-shrink-0 text-white/30 text-xs">
            {items.length} project{items.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="mt-1.5 ml-1 text-sm text-white/40">{DEPT_LABEL[dept]}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((thesis, i) => (
          <ThesisCard key={thesis._id || i} thesis={thesis} />
        ))}
      </div>
    </div>
  );
};

// ─── Page ──────────────────────────────────────
const Thesis = () => {
  const { thesis } = usePrefetcer();
  const [thesisList, setThesisList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(ALL);
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    setThesisList(thesis || []);
  }, [thesis]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const years = useMemo(() => getYears(thesisList), [thesisList]);

  // All items for the selected year, sorted by date
  const yearFiltered = useMemo(() => {
    let list =
      selectedYear === ALL
        ? thesisList
        : thesisList.filter((t) => (t.academicYear || 'Unknown') === selectedYear);
    return [...list].sort((a, b) => {
      const diff = new Date(a._createdAt) - new Date(b._createdAt);
      return sortAsc ? diff : -diff;
    });
  }, [thesisList, selectedYear, sortAsc]);

  // Split into department buckets
  const deptMap = useMemo(() => {
    const map = {};
    for (const d of DEPARTMENTS) {
      map[d] = yearFiltered.filter((t) => (t.department || 'Other') === d);
    }
    return map;
  }, [yearFiltered]);

  // Has any department data?
  const hasDepts = DEPARTMENTS.some((d) => deptMap[d].length > 0);

  return (
    <>
      <TopGradient colorLeft={'#fd0101'} colorRight={'#a50000'} />
      <Head
        title="Thesis | Ingo"
        description="Innovative thesis projects by BSCS seniors. Explore cutting-edge research and connect with student developers."
        url="/thesis"
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
          <p className="text-4xl font-semibold">Thesis</p>
          <p className="text-lg font-semibold text-white/60">
            See what graduating and graduate CS students made their projects
          </p>
        </div>

        {/* Controls */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
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

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedYear + sortAsc}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {yearFiltered.length === 0 ? (
              <p className="mt-16 text-white/40 text-lg">
                No thesis projects found for {selectedYear === ALL ? 'any year' : selectedYear}.
              </p>
            ) : (
              <>
                {/* ── All projects (flat overview) ── */}
                <div className="mt-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs uppercase tracking-widest text-white/40">All Projects</span>
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-white/30 text-xs">{yearFiltered.length} total</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {yearFiltered.map((thesis, i) => (
                      <ThesisCard key={thesis._id || i} thesis={thesis} />
                    ))}
                  </div>
                </div>

                {/* ── Per-department sections ── */}
                {hasDepts && (
                  <div className="mt-20">
                    {/* Prominent "By Department" banner */}
                    <div className="relative flex items-center gap-4 py-5 px-6 rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
                      {/* subtle glow */}
                      <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-header-color/10 blur-3xl pointer-events-none" />
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl font-bold tracking-tight">By Department</p>
                        <p className="text-sm text-white/40 mt-0.5">Projects grouped by specialization track</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {DEPARTMENTS.filter((d) => deptMap[d].length > 0).map((d) => (
                          <span key={d} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-header-color/20 text-header-color border border-header-color/30">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    {DEPARTMENTS.map((dept) => (
                      <DeptSection key={dept} dept={dept} items={deptMap[dept]} />
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </>
  );
};

export default Thesis;

