import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { _Transition_Page } from "../../../lib/animations";
import PersonLightbox from "../../../components/Team/PersonLightbox";
import OfficerCard from "../../../components/Home/MeetCouncil/OfficerCard";
import DepartmentSection from "../../../components/Team/DepartmentSection";


// ─── Animation variants ────────────────────────
const fadeSlide = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

// ─── Team Content ──────────────────────────────
const TeamContent = ({ team, onPersonClick }) => {
  if (!team) return null;

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="mt-2 flex flex-col gap-8 text-left">
      {/* ── Leadership ── */}
      {team.leadership?.length > 0 && (
        <motion.div variants={stagger} className="flex flex-col">
          <h3 className="text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-[1.2rem]">
            Leadership
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5rem]">
            {team.leadership.map((leader, i) => (
              <OfficerCard
                key={i}
                name={leader.name}
                role={leader.role}
                photo={leader.photo || "/mascot/grad-bot.png"}
                imageClassName={leader.photo ? "object-cover" : "object-contain p-[3rem] opacity-30"}
                className="w-full"
                onClick={onPersonClick ? () => onPersonClick({ name: leader.name, photo: leader.photo, subtitle: leader.role }) : undefined}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Departments ── */}
      {team.departments?.length > 0 && (
        <motion.div variants={stagger} initial="initial" animate="animate" className="w-full flex flex-col gap-8">
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
  team.departments?.forEach((d) => d.members?.forEach((m) => list.push({ name: m.name, photo: m.photo, subtitle: m.role || "Member" })));
  return list;
};

// ─── Main Page Component ───────────────────────
const Page_Team = ({ teams, selectedTeamId }) => {
  const [lightbox, setLightbox] = useState(null);

  const selectedTeam = teams?.find((t) => t._id === selectedTeamId);

  const handlePersonClick = (person) => {
    const people = buildTeamPeople(selectedTeam);
    const index = people.findIndex((p) => p.name === person.name && p.subtitle === person.subtitle);
    setLightbox({ people, index: index >= 0 ? index : 0 });
  };

  if (!teams || teams.length === 0) {
    return (
      <motion.section variants={_Transition_Page} initial="initial" animate="animate" exit="exit" className="py-8 text-left">
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
        className="pb-8 text-left"
      >
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
      </motion.section>
    </>
  );
};

export default Page_Team;
