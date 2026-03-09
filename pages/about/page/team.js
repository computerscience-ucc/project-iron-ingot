import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { _Transition_Page } from '../../../components/_Animations';
import { client } from '../../../lib/sanity';
import PersonLightbox from '../../../components/Team/PersonLightbox';
import NameOnlyList from '../../../components/Team/NameOnlyList';
import PersonCard from '../../../components/Team/PersonCard';
import YearSelector from '../../../components/Team/YearSelector';
import MemberCarousel from '../../../components/Team/MemberCarousel';
import DepartmentSection from '../../../components/Team/DepartmentSection';

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

// ─── Helpers ──────────────────────────────────
const anyPhoto = (arr) => arr?.some((m) => !!m.photo) ?? false;
const CAROUSEL_THRESHOLD = 5;

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
            <DepartmentSection key={i} dept={dept} onPersonClick={onPersonClick} CAROUSEL_THRESHOLD={CAROUSEL_THRESHOLD} />
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
