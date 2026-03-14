import { useEffect, useMemo, useState } from 'react';

import BulletinCard from '../../components/Card/Bulletin';
import Head from '../../components/Head';
import TopGradient from '../../components/TopGradient';
import { _Transition_Page } from '../../lib/animations';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefetcher } from '../../components/Prefetcher';
import { CgSearch, CgClose } from 'react-icons/cg';

const Bulletin = (e) => {
  const { bulletins } = usePrefetcher();
  const [bulletinList, setBulletinList] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setBulletinList(bulletins);
  }, [bulletins]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return bulletinList;
    return bulletinList.filter((b) => {
      const titleMatch = (b.title || '').toLowerCase().includes(q);
      const tagMatch = (b.tags || []).some((t) => (t || '').toLowerCase().includes(q));
      return titleMatch || tagMatch;
    });
  }, [bulletinList, searchValue]);

  return (
    <>
      <TopGradient colorLeft={'#fd0101'} colorRight={'#a50000'} />
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
        className="py-36 z-10 min-h-screen"
      >
        <div className="flex flex-col gap-2 justify-center mt-16">
          <p className="text-4xl font-semibold">Bulletin</p>
          <p className="text-lg font-semibold text-white/60">
            See what professors are up to in the BSCS Program
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
            placeholder="Search bulletins…"
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

        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filtered.map((bulletin, index) => (
                    <div key={bulletin._id || index}>
                      <BulletinCard bulletin={bulletin} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-lg">
                  No bulletins found{searchValue ? ` for "${searchValue}"` : ''}.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </>
  );
};

export default Bulletin;
