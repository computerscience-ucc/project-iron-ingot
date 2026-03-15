import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { client } from "../../../lib/sanity";
import { _Transition_Page } from "../../../lib/animations";

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

import PersonLightbox from "../../../components/Team/PersonLightbox";
import NameOnlyList from "../../../components/Team/NameOnlyList";
import PersonCard from "../../../components/Team/PersonCard";
import YearSelector from "../../../components/Team/YearSelector";
import MemberCarousel from "../../../components/Team/MemberCarousel";

// ─── Animation variants ────────────────────────
const fadeSlide = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const cardPop = {
  initial: { opacity: 0, scale: 0.85, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

// ─── Helpers ──────────────────────────────────
const anyPhoto = (arr) => arr?.some((m) => !!m.photo) ?? false;
const CAROUSEL_THRESHOLD = 5;

// ─── Committee Section ─────────────────────────
const CommitteeSection = ({ committee, onPersonClick }) => {
  const count = committee.members?.length || 0;
  const hasPhotos = anyPhoto(committee.members);
  const isCarousel = hasPhotos && count >= CAROUSEL_THRESHOLD;

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
        <MemberCarousel members={committee.members} onPersonClick={onPersonClick} />
      ) : hasPhotos ? (
        <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-wrap justify-center gap-6">
          {committee.members?.map((m, i) => (
            <PersonCard
              key={i}
              name={m.name}
              subtitle={m.role || "Member"}
              photo={m.photo}
              highlight={m.role?.toLowerCase().includes("head")}
              onClick={onPersonClick ? () => onPersonClick({ name: m.name, photo: m.photo, subtitle: m.role || "Member" }) : undefined}
            />
          ))}
        </motion.div>
      ) : (
        <NameOnlyList items={committee.members?.map((m) => ({ name: m.name, subtitle: m.role || "Member" })) || []} />
      )}
    </motion.div>
  );
};

// ─── Pyramid Section ───────────────────────────
const PyramidSection = ({ council, onPersonClick }) => {
  if (!council) return null;

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="mt-12 flex flex-col items-center gap-10">
      {/* Tier 1: Adviser */}
      {council.adviser?.name && (
        <motion.div variants={cardPop} className="flex flex-col items-center">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Adviser</p>
          {council.adviser.photo ? (
            <PersonCard name={council.adviser.name} subtitle="Adviser" photo={council.adviser.photo} highlight onClick={onPersonClick ? () => onPersonClick({ name: council.adviser.name, photo: council.adviser.photo, subtitle: "Adviser" }) : undefined} />
          ) : (
            <NameOnlyList items={[{ name: council.adviser.name, subtitle: "Adviser" }]} />
          )}
        </motion.div>
      )}

      {/* Tier 2: President & VP */}
      <motion.div variants={stagger} className="flex flex-col items-center gap-2">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Executive</p>
        {anyPhoto([council.president, council.vicePresident].filter(Boolean)) ? (
          <div className="flex flex-wrap justify-center gap-8">
            {council.president?.name && (
              <PersonCard name={council.president.name} subtitle="President" photo={council.president.photo} highlight onClick={onPersonClick ? () => onPersonClick({ name: council.president.name, photo: council.president.photo, subtitle: "President" }) : undefined} />
            )}
            {council.vicePresident?.name && (
              <PersonCard name={council.vicePresident.name} subtitle="Vice President" photo={council.vicePresident.photo} highlight onClick={onPersonClick ? () => onPersonClick({ name: council.vicePresident.name, photo: council.vicePresident.photo, subtitle: "Vice President" }) : undefined} />
            )}
          </div>
        ) : (
          <NameOnlyList items={[
            council.president?.name && { name: council.president.name, subtitle: "President" },
            council.vicePresident?.name && { name: council.vicePresident.name, subtitle: "Vice President" },
          ].filter(Boolean)} />
        )}
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
          {anyPhoto(council.officers) ? (
            <div className="flex flex-col items-center gap-6">
              {Array.from({ length: Math.ceil(council.officers.length / 3) }, (_, rowIdx) => {
                const row = council.officers.slice(rowIdx * 3, rowIdx * 3 + 3);
                const isLastRow = rowIdx === Math.ceil(council.officers.length / 3) - 1;
                const isSolo = isLastRow && row.length === 1;
                return (
                  <div key={rowIdx} className={`flex gap-6 ${isSolo ? "justify-center" : "flex-wrap justify-center"}`}>
                    {row.map((o, i) => (
                      <PersonCard key={rowIdx * 3 + i} name={o.name} subtitle={o.position} photo={o.photo} onClick={onPersonClick ? () => onPersonClick({ name: o.name, photo: o.photo, subtitle: o.position }) : undefined} />
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <NameOnlyList items={council.officers.map((o) => ({ name: o.name, subtitle: o.position }))} />
          )}
        </motion.div>
      )}

      {/* Tier 4: Year Representatives */}
      {council.yearRepresentatives?.length > 0 && (
        <motion.div variants={stagger} className="flex flex-col items-center gap-2 mt-6">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Year Representatives</p>
          {anyPhoto(council.yearRepresentatives) ? (
            <div className="flex flex-wrap justify-center gap-6 max-w-3xl">
              {council.yearRepresentatives.map((r, i) => (
                <PersonCard key={i} name={r.name} subtitle={r.yearLevel} photo={r.photo} onClick={onPersonClick ? () => onPersonClick({ name: r.name, photo: r.photo, subtitle: r.yearLevel }) : undefined} />
              ))}
            </div>
          ) : (
            <NameOnlyList items={council.yearRepresentatives.map((r) => ({ name: r.name, subtitle: r.yearLevel }))} />
          )}
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
            <CommitteeSection key={ci} committee={committee} onPersonClick={onPersonClick} />
          ))}
        </motion.div>
      )}

      {/* Class Presidents */}
      {council.classPresidents?.length > 0 && (
        <motion.div
          variants={fadeSlide}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          className="w-full mt-10 flex flex-col items-center"
        >
          <div className="border-b border-white/10 w-full max-w-xl mb-10" />
          <p className="text-xs uppercase tracking-widest text-white/40 mb-6">Class Presidents</p>
          {anyPhoto(council.classPresidents) ? (
            <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-wrap justify-center gap-4">
              {council.classPresidents.map((cp, i) => (
                <PersonCard key={i} size="sm" name={cp.name} subtitle={cp.section} photo={cp.photo} onClick={onPersonClick ? () => onPersonClick({ name: cp.name, photo: cp.photo, subtitle: cp.section }) : undefined} />
              ))}
            </motion.div>
          ) : (
            <NameOnlyList items={council.classPresidents.map((cp) => ({ name: cp.name, subtitle: cp.section }))} />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── Flatten council people for lightbox navigation ─
const buildCouncilPeople = (council) => {
  if (!council) return [];
  const list = [];
  if (council.adviser?.name) list.push({ name: council.adviser.name, photo: council.adviser.photo, subtitle: "Adviser" });
  if (council.president?.name) list.push({ name: council.president.name, photo: council.president.photo, subtitle: "President" });
  if (council.vicePresident?.name) list.push({ name: council.vicePresident.name, photo: council.vicePresident.photo, subtitle: "Vice President" });
  council.officers?.forEach((o) => list.push({ name: o.name, photo: o.photo, subtitle: o.position }));
  council.yearRepresentatives?.forEach((r) => list.push({ name: r.name, photo: r.photo, subtitle: r.yearLevel }));
  council.committees?.forEach((c) => c.members?.forEach((m) => list.push({ name: m.name, photo: m.photo, subtitle: m.role || "Member" })));
  council.classPresidents?.forEach((cp) => list.push({ name: cp.name, photo: cp.photo, subtitle: cp.section }));
  return list;
};

// ─── Main Page Component ───────────────────────
const Page_Council = () => {
  const [councils, setCouncils] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    client.fetch(COUNCIL_QUERY).then((data) => {
      setCouncils(data || []);
      const current = data?.find((c) => c.isCurrent) || data?.[0];
      if (current) setSelectedId(current._id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const selectedCouncil = councils.find((c) => c._id === selectedId);

  const handlePersonClick = (person) => {
    const people = buildCouncilPeople(selectedCouncil);
    const index = people.findIndex((p) => p.name === person.name && p.subtitle === person.subtitle);
    setLightbox({ people, index: index >= 0 ? index : 0 });
  };

  if (!loading && councils.length === 0) {
    return (
      <motion.section variants={_Transition_Page} initial="initial" animate="animate" exit="exit" className="py-8 text-center">
        <p className="text-2xl font-semibold">Computer Science Council</p>
        <p className="mt-8 text-white/40">No council data available yet.</p>
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
        <p className="text-2xl font-semibold">Computer Science Council</p>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-header-color border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <>
            <YearSelector years={councils} selected={selectedId} onSelect={setSelectedId} />

            <AnimatePresence mode="wait">
              {selectedCouncil && (
                <motion.div
                  key={selectedCouncil._id}
                  variants={fadeSlide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <PyramidSection council={selectedCouncil} onPersonClick={handlePersonClick} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.section>
    </>
  );
};

export default Page_Council;
