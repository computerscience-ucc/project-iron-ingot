import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { CgArrowRight } from 'react-icons/cg';
import { client } from '../../../components/Prefetcher';
import { _Transition_Page } from '../../../components/_Animations';

// ─── GROQ query ────────────────────────────────
const COUNCIL_QUERY = `
  *[_type == 'council'] | order(academicYear desc) {
    _id,
    academicYear,
    isCurrent,
    "adviser": {
      "name": adviser.name,
      "photo": adviser.photo.asset->url
    },
    "president": {
      "name": president.name,
      "photo": president.photo.asset->url
    },
    "vicePresident": {
      "name": vicePresident.name,
      "photo": vicePresident.photo.asset->url
    },
    officers[] {
      name, position,
      "photo": photo.asset->url
    },
    yearRepresentatives[] {
      name, yearLevel,
      "photo": photo.asset->url
    },
    committees[] {
      committeeName,
      members[] {
        name, role,
        "photo": photo.asset->url
      }
    },
    classPresidents[] {
      name, section,
      "photo": photo.asset->url
    }
  }
`;

// ─── Gradient palette ────
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

// ─── Portrait Card (rectangular, uniform size) ─
const PersonCard = ({ name, subtitle, photo, highlight = false }) => {
  const gradient = getGradient(name);
  return (
    <motion.div
      variants={cardPop}
      className={`w-36 md:w-44 flex-shrink-0 flex flex-col ${highlight ? 'relative' : ''}`}
    >
      {highlight && (
        <motion.div
          className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-header-color/20 to-button-color/10 blur-md -z-10"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {photo ? (
        <div className={`h-44 md:h-56 w-full rounded-xl overflow-hidden ring-1 ${highlight ? 'ring-header-color' : 'ring-white/10'} shadow-lg`}>
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`h-44 md:h-56 w-full rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} ring-1 ${highlight ? 'ring-header-color' : 'ring-white/10'} shadow-lg`}>
          <span className="text-5xl md:text-6xl font-bold opacity-70">{name?.charAt(0) || '?'}</span>
        </div>
      )}
      <div className="mt-3 text-center px-1">
        <p className="font-semibold leading-tight text-sm md:text-base">{name}</p>
        <p className="text-[11px] text-header-color leading-tight mt-1">{subtitle}</p>
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
            layoutId="yearPill"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-button-color to-header-color"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ zIndex: -1 }}
          />
        )}
        {year.academicYear}
        {year.isCurrent && <span className="ml-1 text-yellow-400 text-[10px]">★</span>}
      </motion.button>
    ))}
  </div>
);

// ─── Auto-scrolling Carousel ───────────────────
const CAROUSEL_THRESHOLD = 5;
const AUTO_SCROLL_THRESHOLD = 10;
const SCROLL_SPEED = 0.4;

const MemberCarousel = ({ members, renderItem }) => {
  const containerRef = useRef();
  const innerRef = useRef();
  const x = useMotionValue(0);
  const [constraint, setConstraint] = useState(0);
  const isDragging = useRef(false);
  const isHovering = useRef(false);
  const autoScroll = members.length >= AUTO_SCROLL_THRESHOLD;

  useEffect(() => {
    const measure = () => {
      if (innerRef.current && containerRef.current) {
        setConstraint(innerRef.current.scrollWidth - containerRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [members]);

  // Auto-scroll ping-pong
  useEffect(() => {
    if (!autoScroll || constraint <= 0) return;
    let dir = -1;
    let raf;
    const step = () => {
      if (!isDragging.current && !isHovering.current) {
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
      highlight={m.role?.toLowerCase().includes('head')}
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

// ─── Committee Section ─────────────────────────
const CommitteeSection = ({ committee }) => {
  const count = committee.members?.length || 0;
  const isCarousel = count >= CAROUSEL_THRESHOLD;

  return (
    <motion.div
      variants={cardPop}
      className="w-full bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-header-color/20 transition-colors"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-header-color to-button-color" />
        <p className="text-base font-semibold text-header-color">{committee.committeeName}</p>
        <span className="text-xs text-white/30 ml-auto">{count} members</span>
      </div>

      {isCarousel ? (
        <MemberCarousel members={committee.members} />
      ) : (
        <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-wrap justify-center gap-6">
          {committee.members?.map((m, i) => (
            <PersonCard
              key={i}
              name={m.name}
              subtitle={m.role || 'Member'}
              photo={m.photo}
              highlight={m.role?.toLowerCase().includes('head')}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── Pyramid Section ───────────────────────────
const PyramidSection = ({ council }) => {
  if (!council) return null;

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="mt-12 flex flex-col items-center gap-10">
      {/* Tier 1: Adviser */}
      {council.adviser?.name && (
        <motion.div variants={cardPop} className="flex flex-col items-center">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Adviser</p>
          <PersonCard name={council.adviser.name} subtitle="Adviser" photo={council.adviser.photo} highlight />
        </motion.div>
      )}

      {/* Tier 2: President & VP */}
      <motion.div variants={stagger} className="flex flex-col items-center gap-2">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Executive</p>
        <div className="flex flex-wrap justify-center gap-8">
          {council.president?.name && (
            <PersonCard name={council.president.name} subtitle="President" photo={council.president.photo} highlight />
          )}
          {council.vicePresident?.name && (
            <PersonCard name={council.vicePresident.name} subtitle="Vice President" photo={council.vicePresident.photo} highlight />
          )}
        </div>
      </motion.div>

      {/* Connector line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="w-px h-8 bg-gradient-to-b from-header-color to-transparent origin-top"
      />

      {/* Tier 3: Officers */}
      {council.officers?.length > 0 && (
        <motion.div variants={stagger} className="flex flex-col items-center gap-2">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Officers</p>
          <div className="flex flex-wrap justify-center gap-6 max-w-3xl">
            {council.officers.map((o, i) => (
              <PersonCard key={i} name={o.name} subtitle={o.position} photo={o.photo} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Tier 4: Year Representatives */}
      {council.yearRepresentatives?.length > 0 && (
        <motion.div variants={stagger} className="flex flex-col items-center gap-2 mt-6">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Year Representatives</p>
          <div className="flex flex-wrap justify-center gap-6 max-w-3xl">
            {council.yearRepresentatives.map((r, i) => (
              <PersonCard key={i} name={r.name} subtitle={r.yearLevel} photo={r.photo} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Connector */}
      {council.committees?.length > 0 && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="w-px h-10 bg-gradient-to-b from-header-color/40 to-transparent origin-top"
        />
      )}

      {/* Committees — now uses carousel when large */}
      {council.committees?.length > 0 && (
        <motion.div variants={stagger} initial="initial" animate="animate" className="w-full flex flex-col gap-6">
          <p className="text-xs uppercase tracking-widest text-white/40 text-center">Committees</p>

          {council.committees.map((committee, ci) => (
            <CommitteeSection key={ci} committee={committee} />
          ))}
        </motion.div>
      )}

      {/* Class Presidents */}
      {council.classPresidents?.length > 0 && (
        <motion.div
          variants={fadeSlide}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="w-full mt-10 flex flex-col items-center"
        >
          <div className="border-b border-white/10 w-full max-w-xl mb-10" />
          <p className="text-xs uppercase tracking-widest text-white/40 mb-6">Class Presidents</p>
          <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {council.classPresidents.map((cp, i) => (
              <PersonCard key={i} name={cp.name} subtitle={cp.section} photo={cp.photo} />
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── Main Page Component ───────────────────────
const Page_Council = () => {
  const [councils, setCouncils] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(COUNCIL_QUERY).then((data) => {
      setCouncils(data || []);
      const current = data?.find((c) => c.isCurrent) || data?.[0];
      if (current) setSelectedId(current._id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const selectedCouncil = councils.find((c) => c._id === selectedId);

  if (!loading && councils.length === 0) {
    return (
      <motion.section variants={_Transition_Page} initial="initial" animate="animate" exit="exit" className="py-8 text-center">
        <p className="text-2xl font-semibold">Computer Science Council</p>
        <p className="mt-8 text-white/40">No council data available yet.</p>
      </motion.section>
    );
  }

  return (
    <motion.section
      variants={_Transition_Page}
      initial="initial"
      animate="animate"
      exit="exit"
      className="py-8 text-center"
    >
      <p className="text-2xl font-semibold">Computer Science Council</p>

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
          <YearSelector years={councils} selected={selectedId} onSelect={setSelectedId} />

          <AnimatePresence exitBeforeEnter>
            {selectedCouncil && (
              <motion.div
                key={selectedCouncil._id}
                variants={fadeSlide}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <PyramidSection council={selectedCouncil} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.section>
  );
};

export default Page_Council;
