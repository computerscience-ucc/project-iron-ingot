import { useEffect, useMemo, useState } from 'react';
import { CgArrowDown, CgArrowUp, CgChevronRight, CgClose, CgSearch } from 'react-icons/cg';

import Head from '../../components/Head';
import Link from 'next/link';
import Image from 'next/image';
import TopGradient from '../../components/TopGradient';
import { _Transition_Page } from '../../components/_Animations';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefetcer } from '../../components/Prefetcher';
import dayjs from 'dayjs';

const ALL = 'All';

const GalleryPage = () => {
  const { gallery } = usePrefetcer();
  const [projectList, setProjectList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedTag, setSelectedTag] = useState(ALL);
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    setProjectList(gallery || []);
  }, [gallery]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const availableTags = useMemo(() => {
    const tags = new Set();
    projectList.forEach((project) => {
      (project.tags || []).forEach((tag) => {
        if (tag) tags.add(tag);
      });
    });
    return [ALL, ...Array.from(tags).sort((a, b) => a.localeCompare(b))];
  }, [projectList]);

  const filteredProjects = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    let list = selectedTag === ALL
      ? projectList
      : projectList.filter((project) => (project.tags || []).includes(selectedTag));

    if (q) {
      list = list.filter((project) => {
      const titleMatch = (project.title || '').toLowerCase().includes(q);
      const personMatch = (project.personName || '').toLowerCase().includes(q);
      const tagMatch = (project.tags || []).some((tag) =>
        (tag || '').toLowerCase().includes(q)
      );
      return titleMatch || personMatch || tagMatch;
      });
    }

    return [...list].sort((a, b) => {
      const diff = new Date(a.projectDate || a._createdAt) - new Date(b.projectDate || b._createdAt);
      return sortAsc ? diff : -diff;
    });
  }, [projectList, searchValue, selectedTag, sortAsc]);

  return (
    <>
      <TopGradient colorLeft={'#fd0101'} colorRight={'#a50000'} />
      <Head
        title="Gallery of Projects | Ingo"
        description="Browse student and alumni project outputs, watch demos, and visit their work links."
        url="/gallery"
      />

      <motion.main
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-36 z-10 min-h-screen"
      >
        <div className="flex flex-col gap-2 justify-center mt-16">
          <p className="text-4xl font-semibold">Gallery of Projects</p>
          <p className="text-lg font-semibold text-white/60">
            Search projects, open each profile, and watch project outputs.
          </p>
        </div>

        <div className="mt-10 relative max-w-md">
          <CgSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by title, person, or tag..."
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

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-full pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-white/25 transition-colors"
            >
              {availableTags.map((tag) => (
                <option key={tag} value={tag} className="bg-[#0A0C10] text-white">
                  {tag === ALL ? 'All Tags' : tag}
                </option>
              ))}
            </select>
            <CgArrowDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
            />
          </div>

          <button
            onClick={() => setSortAsc((v) => !v)}
            className="ml-auto flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors border border-white/10 rounded-full px-3 py-1.5"
          >
            {sortAsc ? <CgArrowUp size={14} /> : <CgArrowDown size={14} />}
            {sortAsc ? 'Oldest first' : 'Newest first'}
          </button>
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedTag}-${sortAsc}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {filteredProjects.length > 0 ? (
                <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
                  {filteredProjects.map((project, index) => (
                    <Link key={project._id || index} href={`/gallery/${project.slug}`} scroll={false}>
                      <a className="flex items-center gap-4 px-4 py-4 hover:bg-white/[0.03] transition-colors">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/15 bg-[#171a20] shrink-0">
                          {project.profilePicture ? (
                            <Image
                              src={project.profilePicture}
                              alt={project.personName}
                              layout="fill"
                              objectFit="cover"
                            />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center text-sm text-white/50 font-semibold">
                              {(project.personName || '?').charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-lg font-semibold truncate">{project.title}</p>
                          <p className="text-sm text-white/60 truncate">{project.personName}</p>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            {(project.tags || []).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-0.5 rounded-full text-[11px] bg-[#27292D] text-white/80"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs text-white/40">
                            {dayjs(project.projectDate || project._createdAt).format('MMM D, YYYY')}
                          </p>
                          <span className="inline-flex items-center mt-1 text-sm text-white/60">
                            View <CgChevronRight className="ml-1" size={14} />
                          </span>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-lg">
                  No projects found{searchValue ? ` for "${searchValue}"` : selectedTag !== ALL ? ` in ${selectedTag}` : ''}.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </>
  );
};

export default GalleryPage;