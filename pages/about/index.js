import { AnimatePresence, motion } from "framer-motion";
import Head from "../../components/Head";
import Page_MIS from "./page/mis";
import Page_Team from "./page/team";
import { _Transition_Page } from "../../lib/animations";
import { useEffect, useState } from "react";
import { client } from "../../lib/sanity";
import CommitteeSection from "../../components/About/CommitteeSection";
import OfficerCard from "../../components/Home/MeetCouncil/OfficerCard";

// ─────────────────────────────────────
// Sanity GROQ query for Council
// ─────────────────────────────────────
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
      name, 
      "position": position,
      "photo": photo.asset->url
    },
    classPresidents[] {
      name,
      section,
      "photo": photo.asset->url
    },
    committees[] {
      committeeName,
      description,
      members[] {
        name,
        role,
        "photo": photo.asset->url
      }
    }
  }
`;

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

const AboutPage = () => {
  const [selected, setSelected] = useState(2); // Set default to Computer Science Council
  const [councils, setCouncils] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  useEffect(() => {
    client.fetch(COUNCIL_QUERY).then((data) => {
      const result = data || [];
      setCouncils(result);
      const current = result.find((c) => c.isCurrent) || result[0];
      if (current) setSelectedYear(current.academicYear);
    });

    client.fetch(TEAM_QUERY).then((data) => {
      const result = data || [];
      setTeams(result);
      const current = result.find((t) => t.isCurrent) || result[0];
      if (current) setSelectedTeamId(current._id);
    });
  }, []);

  const selectTab = (id) => {
    setSelected(id);
  };

  const council = councils.find((c) => c.academicYear === selectedYear);
  const years = [...new Set(councils.map((c) => c.academicYear))];

  const adviser = council?.adviser;
  const executives = [
    council?.president && {
      name: council.president.name,
      role: "President",
      photo: council.president.photo,
    },
    council?.vicePresident && {
      name: council.vicePresident.name,
      role: "Vice President",
      photo: council.vicePresident.photo,
    },
  ].filter(Boolean);

  return (
    <>
      <Head
        title="About | Ingo"
        description="Learn about Ingo, the BSCS information board. Meet our team, council, and discover our mission."
        url="/about"
      />

      <motion.main
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-[1200px] w-[var(--container-width)] md:w-[80%] mx-auto pt-[2rem] pb-[8rem] z-10 min-h-screen relative"
      >
        {/* Header */}
        <div className="flex flex-col gap-3 justify-center mt-8 mb-6 text-left">
          <h1 className="text-[2rem] text-[#ffffff] font-semibold tracking-normal">
            About
          </h1>
          <p className="text-[1rem] text-[#8C8C8C] font-normal leading-normal max-w-[600px]">
            Meet the students and developers behind our community&apos;s digital initiatives.
          </p>
        </div>

        {/* Controls bar / tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 mt-6">
          {/* Main Tabs */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center lg:bg-[#202020] rounded-[6px] p-0 lg:p-1 gap-2 lg:gap-1 h-fit relative">
            <button
              onClick={() => selectTab(1)}
              className={`relative text-left lg:text-center pl-2 pr-3 py-1.5 rounded-[4px] text-[0.875rem] font-normal leading-normal transition-colors w-full lg:w-auto ${
                selected === 1 ? "text-white" : "text-[#8C8C8C] hover:text-[#EFEFEF]"
              }`}
            >
              {selected === 1 && (
                <motion.div
                  layoutId="activeTabAbout"
                  className="absolute inset-0 bg-[#333333] rounded-[4px] z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Development Team</span>
            </button>
            <button
              onClick={() => selectTab(2)}
              className={`relative text-left lg:text-center pl-2 pr-3 py-1.5 rounded-[4px] text-[0.875rem] font-normal leading-normal transition-colors w-full lg:w-auto ${
                selected === 2 ? "text-white" : "text-[#8C8C8C] hover:text-[#EFEFEF]"
              }`}
            >
              {selected === 2 && (
                <motion.div
                  layoutId="activeTabAbout"
                  className="absolute inset-0 bg-[#333333] rounded-[4px] z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Computer Science Council</span>
            </button>
            <button
              onClick={() => selectTab(3)}
              className={`relative text-left lg:text-center pl-2 pr-3 py-1.5 rounded-[4px] text-[0.875rem] font-normal leading-normal transition-colors w-full lg:w-auto ${
                selected === 3 ? "text-white" : "text-[#8C8C8C] hover:text-[#EFEFEF]"
              }`}
            >
              {selected === 3 && (
                <motion.div
                  layoutId="activeTabAbout"
                  className="absolute inset-0 bg-[#333333] rounded-[4px] z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">MIS - ACES</span>
            </button>
          </div>

          {/* Year Pills Filter (Only for Council and Team) */}
          {selected === 2 && years.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto scrollbar-hide">
              {(() => {
                const currentYear = councils.find((c) => c.isCurrent)?.academicYear;
                return years.map((y) => {
                  const isActive = selectedYear === y;
                  const hasAsterisk = y === currentYear;
                  return (
                    <button
                      key={y}
                      onClick={() => setSelectedYear(y)}
                      className={`relative ${hasAsterisk ? "pl-2 pr-3" : "px-3"} py-1.5 rounded-[4px] text-[0.875rem] font-normal leading-normal transition-colors whitespace-nowrap flex items-center ${
                        isActive ? "text-white" : "text-[#EFEFEF] hover:bg-[#202020]"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeYearCouncil"
                          className="absolute inset-0 bg-[#EA2B2E] rounded-[4px] z-0"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      {!isActive && <div className="absolute inset-0 bg-[#2A2A2A] rounded-[4px] z-0" />}
                      <span className="relative z-10 flex items-center">
                        {hasAsterisk && (
                          <span className="mr-[0.35rem] text-[#EFEFEF] text-[12px] relative top-[0.5px]">✱</span>
                        )}
                        {y}
                      </span>
                    </button>
                  );
                });
              })()}
            </div>
          )}

          {selected === 1 && teams.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto scrollbar-hide">
              {teams.map((t) => {
                const isActive = selectedTeamId === t._id;
                const hasAsterisk = t.isCurrent;
                  return (
                    <button
                      key={t._id}
                      onClick={() => setSelectedTeamId(t._id)}
                      className={`relative ${hasAsterisk ? "pl-2 pr-3" : "px-3"} py-1.5 rounded-[4px] text-[0.875rem] font-normal leading-normal transition-colors whitespace-nowrap flex items-center ${
                        isActive ? "text-white" : "text-[#EFEFEF] hover:bg-[#202020]"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeYearTeam"
                          className="absolute inset-0 bg-[#EA2B2E] rounded-[4px] z-0"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      {!isActive && <div className="absolute inset-0 bg-[#2A2A2A] rounded-[4px] z-0" />}
                      <span className="relative z-10 flex items-center">
                        {hasAsterisk && (
                          <span className="mr-[0.35rem] text-[#EFEFEF] text-[12px] relative top-[0.5px]">✱</span>
                        )}
                        {t.academicYear}
                      </span>
                    </button>
                  );
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-2">
          <AnimatePresence mode="wait">
            <div key={`${selected}-${selectedYear}`}>
              {selected === 1 && (
                <motion.div
                  key="team"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Page_Team teams={teams} selectedTeamId={selectedTeamId} />
                </motion.div>
              )}

              {selected === 2 && council && (
                <>
                  <div className="flex flex-col xl:flex-row gap-[4rem] xl:gap-[6rem] w-full items-start justify-start">
                    {/* Adviser */}
                    <div className="flex flex-col w-full xl:w-auto">
                      <h3 className="text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-[1.2rem]">
                        Adviser
                      </h3>
                      <OfficerCard
                        name={adviser?.name || ""}
                        role="CS Coordinator / Council Adviser"
                        photo={adviser?.photo}
                        className="w-full xl:w-[22.5rem]"
                      />
                    </div>

                    {/* Executive */}
                    <div className="flex flex-col w-full xl:w-auto">
                      <h3 className="text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-[1.2rem]">
                        Executive
                      </h3>
                      <div className="flex gap-[1.5rem] flex-wrap xl:flex-nowrap w-full">
                        {executives.map((exec, idx) => (
                          <OfficerCard
                            key={idx}
                            name={exec.name}
                            role={exec.role}
                            photo={exec.photo}
                            className="w-full xl:w-[22.5rem]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Officers */}
                  {council.officers && council.officers.length > 0 && (
                    <div className="flex flex-col mt-12">
                      <h3 className="text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-[1.2rem]">
                        Officers
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[1.5rem] gap-y-[2.5rem]">
                        {council.officers.map((officer, idx) => (
                          <OfficerCard
                            key={idx}
                            name={officer.name}
                            role={officer.position}
                            photo={officer.photo}
                            className="w-full"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Committees */}
                  {council.committees && council.committees.length > 0 && (
                    <CommitteeSection committees={council.committees} />
                  )}

                  {/* Class Presidents */}
                  {council.classPresidents && council.classPresidents.length > 0 && (
                    <div className="flex flex-col mt-12">
                      <h3 className="text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-[1.2rem]">
                        Class Presidents
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[1.5rem] gap-y-[2.5rem]">
                        {council.classPresidents.map((cp, idx) => (
                          <OfficerCard
                            key={idx}
                            name={cp.name}
                            role={cp.section}
                            photo={cp.photo || "/mascot/grad-bot.png"}
                            imageClassName={cp.photo ? "object-cover" : "object-contain p-[3rem] opacity-30"}
                            className="w-full"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {selected === 3 && <Page_MIS />}
            </div>
          </AnimatePresence>
        </div>
      </motion.main>
    </>
  );
};

export default AboutPage;
