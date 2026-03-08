import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { CgArrowRight, CgChevronLeft, CgChevronRight, CgClose } from 'react-icons/cg';
import { client } from '../../../components/Prefetcher';
import { _Transition_Page } from '../../../components/_Animations';

// ─── GROQ query ────────────────────────────────
const TEAM_QUERY = `
  *[_type == 'devTeam'] | order(academicYear desc) {
    _id,
    academicYear,
    isCurrent,
    leadership[] {
      name, role,
      "photo": photo.asset->url
    },
    departments[] {
      departmentName,
      members[] {
        name, role,
        "photo": photo.asset->url
      }
    }
  }
`;

// ─── Gradient palette for initials fallback ────
const GRADIENTS = [
  'from-rose-500/40 to-pink-600/30',
  'from-violet-500/40 to-purple-600/30',
  'from-blue-500/40 to-cyan-600/30',
  'from-emerald-500/40 to-teal-600/30',
  'from-amber-500/40 to-orange-600/30',
  'from-fuchsia-500/40 to-pink-500/30',
  'from-sky-500/40 to-indigo-600/30',
  'from-lime-500/40 to-green-600/30',
  'from-red-500/40 to-rose-600/30',
  'from-cyan-500/40 to-blue-600/30',
];

const getGradient = (name) => {
  const hash = (name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
};

// ─── Animation variants ────────────────────────
const fadeSlide = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const cardPop = {
  initial: { opacity: 0, scale: 0.85, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// ─── Lightbox slide variants ──────────────────
const lightboxSlideVariants = {
  enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
};

// ─── Person Lightbox ─────────────────────────
const PersonLightbox = ({ people, initialIndex, onClose }) => {
  const [idx, setIdx] = useState(initialIndex);
  const [dir, setDir] = useState(1);
  const person = people[idx];
  const gradient = getGradient(person?.name);

  const go = (d) => { setDir(d); setIdx((i) => (i + d + people.length) % people.length); };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') { setDir(1);  setIdx((i) => (i + 1 + people.length) % people.length); }
      if (e.key === 'ArrowLeft')  { setDir(-1); setIdx((i) => (i - 1 + people.length) % people.length); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, people.length]);

  if (!person) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-lg bg-[#0e1015] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white transition"
          aria-label="Close"
        >
          <CgClose size={18} />
        </button>

        {/* Prev */}
        {people.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white transition"
            aria-label="Previous"
          >
            <CgChevronLeft size={22} />
          </button>
        )}

        {/* Next */}
        {people.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white transition"
            aria-label="Next"
          >
            <CgChevronRight size={22} />
          </button>
        )}

        {/* Grid-stack wrapper: entering + exiting overlap in the same cell, no height doubling or FLIP */}
        <div style={{ display: 'grid', overflow: 'hidden' }}>
          <AnimatePresence custom={dir} initial={false}>
            <motion.div
              key={idx}
              custom={dir}
              variants={lightboxSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              style={{ gridArea: '1 / 1' }}
            >
              {person.photo ? (
                <div className="w-full overflow-hidden bg-black flex items-center justify-center" style={{ maxHeight: '70vh' }}>
                  <img src={person.photo} alt={person.name} className="w-full h-auto max-h-[70vh] object-contain" />
                </div>
              ) : (
                <div
                  className={`w-full flex items-center justify-center bg-gradient-to-br ${gradient}`}
                  style={{ height: '400px' }}
                >
                  <span className="text-9xl font-bold opacity-70">{person.name?.charAt(0) || '?'}</span>
                </div>
              )}

              <div className="p-5">
                <p className="text-lg font-bold text-white">{person.name}</p>
                <p className="text-sm text-header-color mt-1">{person.subtitle}</p>
                {people.length > 1 && (
                  <p className="text-[10px] text-white/20 mt-2">{idx + 1} / {people.length}</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Helpers ──────────────────────────────────
const anyPhoto = (arr) => arr?.some((m) => !!m.photo) ?? false;

// ─── Name-only list (no photos in section) ────
const NameOnlyList = ({ items }) => (
  <div className="flex flex-wrap justify-center gap-3 max-w-3xl m-auto">
    {items.map((item, i) => (
      <div key={i} className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center w-full md:w-auto md:min-w-[130px]">
        <p className="text-md font-semibold text-white leading-tight">{item.name}</p>
        {item.subtitle && <p className="text-[11px] text-header-color mt-0.5 leading-tight">{item.subtitle}</p>}
      </div>
    ))}
  </div>
);

// ─── Portrait Card (rectangular, uniform size) ─
const PersonCard = ({ name, subtitle, photo, highlight = false, onClick }) => {
  const gradient = getGradient(name);
  return (
    <motion.div
      variants={cardPop}
      onClick={onClick}
      className={`w-52 md:w-64 flex-shrink-0 flex flex-col ${highlight ? 'relative' : ''} ${onClick ? 'cursor-pointer group/card' : ''}`}
    >
      {highlight && (
        <motion.div
          className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-header-color/20 to-button-color/10 blur-md -z-10"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {photo ? (
        <div className={`h-64 md:h-80 w-full rounded-xl overflow-hidden ring-1 ${highlight ? 'ring-header-color' : 'ring-white/10'} shadow-lg transition-all ${onClick ? 'group-hover/card:ring-header-color group-hover/card:scale-[1.02]' : ''}`}>
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`h-64 md:h-80 w-full rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} ring-1 ${highlight ? 'ring-header-color' : 'ring-white/10'} shadow-lg transition-all ${onClick ? 'group-hover/card:ring-header-color' : ''}`}>
          <span className="text-5xl md:text-6xl font-bold opacity-70">{name?.charAt(0) || '?'}</span>
        </div>
      )}
      <div className="mt-3 text-center px-1">
        <p className="font-semibold leading-tight text-sm md:text-base">{name}</p>
        <p className="text-[11px] text-header-color leading-tight mt-1">{subtitle}</p>
        {onClick && <p className="text-[9px] text-white/20 mt-0.5 group-hover/card:text-white/40 transition-colors">Click to view</p>}
      </div>
    </motion.div>
  );
};

// ─── Year Pill Selector ────────────────────────
const YearSelector = ({ years, selected, onSelect }) => (
  <div className="flex flex-wrap justify-center gap-2 mt-8">
    {years.map((year) => (
      <motion.button
        key={year.academicYear}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(year._id)}
        className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
          selected === year._id
            ? 'text-white'
            : 'text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/10'
        }`}
      >
        {selected === year._id && (
          <motion.div
            layoutId="teamYearPill"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-button-color to-header-color"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ zIndex: -1 }}
          />
        )}
        {year.academicYear}
        {year.isCurrent && <span className="ml-1 text-yellow-400 text-[10px] align-bottom">★</span>}
      </motion.button>
    ))}
  </div>
);

// ─── Auto-scrolling Carousel ───────────────────
const CAROUSEL_THRESHOLD = 5;
const AUTO_SCROLL_THRESHOLD = CAROUSEL_THRESHOLD;
const SCROLL_SPEED = 0.4;

const MemberCarousel = ({ members, renderItem, onPersonClick }) => {
  const containerRef = useRef();
  const innerRef = useRef();
  const x = useMotionValue(0);
  const [constraint, setConstraint] = useState(0);
  const isDragging = useRef(false);
  const isHovering = useRef(false);
  const isVisible = useRef(false);
  const autoScroll = members.length >= AUTO_SCROLL_THRESHOLD;

  useEffect(() => {
    const measure = () => {
      if (innerRef.current && containerRef.current) {
        setConstraint(innerRef.current.scrollWidth - containerRef.current.offsetWidth);
      }
    };
    measure();
    // Re-measure on resize
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [members]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry.isIntersecting; },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll ping-pong
  useEffect(() => {
    if (!autoScroll || constraint <= 0) return;
    let dir = -1;
    let raf;
    const step = () => {
      if (!isDragging.current && !isHovering.current && isVisible.current) {
        const cur = x.get();
        let next = cur + dir * SCROLL_SPEED;
        if (next <= -constraint) { dir = 1; }
        if (next >= 0) { dir = -1; }
        x.set(next);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [autoScroll, constraint, x]);

  const defaultRender = (m, i) => (
    <PersonCard
      key={i}
      name={m.name}
      subtitle={m.role || 'Member'}
      photo={m.photo}
      onClick={onPersonClick ? () => onPersonClick({ name: m.name, photo: m.photo, subtitle: m.role || 'Member' }) : undefined}
    />
  );

  return (
    <div
      className="w-full"
      onMouseEnter={() => { isHovering.current = true; }}
      onMouseLeave={() => { isHovering.current = false; }}
    >
      <motion.div ref={containerRef} className="cursor-grab overflow-hidden">
        <motion.div
          ref={innerRef}
          style={{ x }}
          drag="x"
          dragConstraints={{ right: 0, left: -constraint }}
          onDragStart={() => { isDragging.current = true; }}
          onDragEnd={() => { setTimeout(() => { isDragging.current = false; }, 300); }}
          whileTap={{ cursor: 'grabbing' }}
          className="flex gap-5 py-2 w-max"
        >
          {members.map(renderItem || defaultRender)}
        </motion.div>
      </motion.div>
      <p className="flex items-center justify-end gap-2 mt-3 text-xs text-white/30">
        {autoScroll && <span className="animate-pulse text-white/20">Auto-scrolling</span>}
        <span>Drag to browse</span>
        <CgArrowRight size={14} className="text-yellow-500/60" />
      </p>
    </div>
  );
};

// ─── Department Section ────────────────────────
const DepartmentSection = ({ dept, onPersonClick }) => {
  const count = dept.members?.length || 0;
  const hasPhotos = anyPhoto(dept.members);
  const isCarousel = hasPhotos && count >= CAROUSEL_THRESHOLD;

  return (
    <motion.div
      variants={cardPop}
      className="w-full bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-header-color/20 transition-colors"
    >
      {/* Department header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-header-color to-button-color" />
        <p className="text-base font-semibold text-header-color">{dept.departmentName}</p>
        <span className="text-xs text-white/30 ml-auto">{count} members</span>
      </div>

      {isCarousel ? (
        <MemberCarousel members={dept.members} onPersonClick={onPersonClick} />
      ) : hasPhotos ? (
        <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-wrap justify-center gap-6">
          {dept.members?.map((m, i) => (
            <PersonCard
              key={i}
              name={m.name}
              subtitle={m.role || 'Member'}
              photo={m.photo}
              onClick={onPersonClick ? () => onPersonClick({ name: m.name, photo: m.photo, subtitle: m.role || 'Member' }) : undefined}
            />
          ))}
        </motion.div>
      ) : (
        <NameOnlyList items={dept.members?.map((m) => ({ name: m.name, subtitle: m.role || 'Member' })) || []} />
      )}
    </motion.div>
  );
};

// ─── Team Content ──────────────────────────────
const TeamContent = ({ team, onPersonClick }) => {
  if (!team) return null;

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="mt-12 flex flex-col items-center gap-10">
      {/* ── Leadership Pyramid ── */}
      {team.leadership?.length > 0 && (
        <motion.div variants={stagger} className="flex flex-col items-center gap-2">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Leadership</p>

          {anyPhoto(team.leadership) ? (
            <div className="flex flex-wrap justify-center gap-8">
              {team.leadership.map((leader, i) => (
                <PersonCard
                  key={i}
                  name={leader.name}
                  subtitle={leader.role}
                  photo={leader.photo}
                  highlight
                  onClick={onPersonClick ? () => onPersonClick({ name: leader.name, photo: leader.photo, subtitle: leader.role }) : undefined}
                />
              ))}
            </div>
          ) : (
            <NameOnlyList items={team.leadership.map((l) => ({ name: l.name, subtitle: l.role }))} />
          )}
        </motion.div>
      )}

      {/* ── Connector ── */}
      {team.leadership?.length > 0 && team.departments?.length > 0 && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="w-px h-10 bg-gradient-to-b from-header-color/40 to-transparent origin-top"
        />
      )}

      {/* ── Departments ── */}
      {team.departments?.length > 0 && (
        <motion.div variants={stagger} initial="initial" animate="animate" className="w-full flex flex-col gap-6">
          <p className="text-xs uppercase tracking-widest text-white/40 text-center">Departments</p>

          {team.departments.map((dept, i) => (
            <DepartmentSection key={i} dept={dept} onPersonClick={onPersonClick} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── Flatten team people for lightbox navigation ───
const buildTeamPeople = (team) => {
  if (!team) return [];
  const list = [];
  team.leadership?.forEach((l) => list.push({ name: l.name, photo: l.photo, subtitle: l.role }));
  team.departments?.forEach((d) => d.members?.forEach((m) => list.push({ name: m.name, photo: m.photo, subtitle: m.role || 'Member' })));
  return list;
};

// ─── Main Page Component ───────────────────────
const Page_Team = () => {
  const [teams, setTeams] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    client.fetch(TEAM_QUERY).then((data) => {
      setTeams(data || []);
      const current = data?.find((t) => t.isCurrent) || data?.[0];
      if (current) setSelectedId(current._id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const selectedTeam = teams.find((t) => t._id === selectedId);

  const handlePersonClick = (person) => {
    const people = buildTeamPeople(selectedTeam);
    const index = people.findIndex((p) => p.name === person.name && p.subtitle === person.subtitle);
    setLightbox({ people, index: index >= 0 ? index : 0 });
  };

  if (!loading && teams.length === 0) {
    return (
      <motion.section variants={_Transition_Page} initial="initial" animate="animate" exit="exit" className="py-8 text-center">
        <p className="text-2xl font-semibold">Project Ingo Development Team</p>
        <p className="mt-8 text-white/40">No team data available yet.</p>
      </motion.section>
    );
  }

  return (
    <>
      <AnimatePresence>
        {lightbox && <PersonLightbox people={lightbox.people} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />}
      </AnimatePresence>

    <motion.section
      variants={_Transition_Page}
      initial="initial"
      animate="animate"
      exit="exit"
      className="py-8 text-center"
    >
      <p className="text-2xl font-semibold">Project Ingo Development Team</p>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-header-color border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <>
          <YearSelector years={teams} selected={selectedId} onSelect={setSelectedId} />

          <AnimatePresence mode="wait">
            {selectedTeam && (
              <motion.div
                key={selectedTeam._id}
                variants={fadeSlide}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <TeamContent team={selectedTeam} onPersonClick={handlePersonClick} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.section>
    </>
  );
};

export default Page_Team;
