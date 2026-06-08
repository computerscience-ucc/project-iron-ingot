import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/sanity";
import OfficerCard from "../components/Home/MeetCouncil/OfficerCard";
import CouncilParallaxText from "../components/Home/MeetCouncil/CouncilParallaxText";
import CouncilAbout from "../components/Home/MeetCouncil/CouncilAbout";
import PersonLightbox from "../components/Team/PersonLightbox";

const ALL_COUNCILS_QUERY = `
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
    committees[] {
      committeeName,
      members[] {
        name, role,
        "photo": photo.asset->url
      }
    },
    yearRepresentatives[] {
      name, yearLevel,
      "photo": photo.asset->url
    },
    classPresidents[] {
      name, section,
      "photo": photo.asset->url
    }
  }
`;

const CommitteeAccordion = ({ committee, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-white hover:bg-white/5 transition-colors"
      >
        <span>{committee.committeeName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {committee.members?.map((m, i) => (
                <div key={i} className="text-xs text-[#8C8C8C]">
                  <span className="text-white">{m.name}</span>
                  {m.role && <span className="block text-[10px]">{m.role}</span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Council() {
  const [councils, setCouncils] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    client.fetch(ALL_COUNCILS_QUERY).then((data) => {
      const list = data || [];
      setCouncils(list);
      const current = list.find((c) => c.isCurrent) || list[0];
      if (current) setSelectedId(current._id);
    });
  }, []);

  const council = councils.find((c) => c._id === selectedId);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [council]);

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
  const officersList = (council?.officers || []).map((o) => ({
    name: o.name,
    role: o.position,
    photo: o.photo,
  }));

  const allPeople = [
    council?.adviser && { name: council.adviser.name, photo: council.adviser.photo, subtitle: "Council Adviser" },
    ...executives.map((exec) => ({ name: exec.name, photo: exec.photo, subtitle: exec.role })),
    ...officersList.map((o) => ({ name: o.name, photo: o.photo, subtitle: o.role })),
  ].filter(Boolean);

  const handlePersonClick = (person) => {
    const idx = allPeople.findIndex((p) => p.name === person.name && p.subtitle === person.subtitle);
    setLightbox({ people: allPeople, index: idx >= 0 ? idx : 0 });
  };

  const next = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.offsetWidth || 0;
      scrollRef.current.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
    }
  };

  const prev = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.offsetWidth || 0;
      scrollRef.current.scrollBy({ left: -(cardWidth + 24), behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">
      <CouncilParallaxText />

      <div className="w-full flex flex-col items-center">
        {/* Year Selector */}
        {councils.length > 1 && (
          <div className="section-container px-0 md:px-12 lg:px-[6rem] flex flex-wrap items-center justify-center gap-2 mt-6">
            {councils.map((c) => {
              const isActive = c._id === selectedId;
              return (
                <button
                  key={c._id}
                  onClick={() => setSelectedId(c._id)}
                  className={`px-4 py-1.5 rounded-[4px] text-[0.875rem] font-normal leading-normal transition-all ${
                    isActive
                      ? "bg-[#EA2B2E] text-white"
                      : "bg-[#2A2A2A] text-[#EFEFEF] hover:bg-[#202020]"
                  }`}
                >
                  {c.academicYear}
                  {c.isCurrent && (
                    <span className="ml-1.5 text-[#FF5154] text-[0.7rem]">*</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Adviser Section */}
        <section className="relative section-container px-0 md:px-12 lg:px-[6rem] mt-4 md:mt-8 font-sans flex flex-col items-center">
          <h3 className="text-xl md:text-2xl lg:text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-4 md:mb-6">
            Adviser
          </h3>

          <div
            onClick={() => adviser?.name && handlePersonClick({ name: adviser.name, photo: adviser.photo, subtitle: "Council Adviser" })}
            className="relative w-full max-w-[16rem] md:max-w-[20rem] lg:max-w-[28rem] aspect-square bg-[#242424] border border-dashed border-[#8E8E8E] flex items-center justify-center overflow-hidden cursor-pointer group"
          >
            <div className="absolute top-[-1px] left-[-1px] w-[8px] h-[8px] bg-[#FF5154] z-10"></div>
            <div className="absolute top-[-1px] right-[-1px] w-[8px] h-[8px] bg-[#FF5154] z-10"></div>
            <div className="absolute bottom-[-1px] left-[-1px] w-[8px] h-[8px] bg-[#FF5154] z-10"></div>
            <div className="absolute bottom-[-1px] right-[-1px] w-[8px] h-[8px] bg-[#FF5154] z-10"></div>
            {adviser?.photo && (
              <Image
                src={adviser.photo}
                alt={adviser.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>

          <div className="flex flex-col items-center mt-3 md:mt-4 lg:mt-[1.2rem] gap-1">
            <h4 className="text-base md:text-lg lg:text-[1.6rem] font-semibold text-white leading-[1.2] tracking-wide text-center">
              {adviser?.name || "—"}
            </h4>
            <p className="text-[#8C8C8C] text-[0.8rem] md:text-sm lg:text-[1rem] leading-relaxed font-normal text-center">
              Council Adviser
            </p>
          </div>
        </section>

        {/* Officers Section */}
        <section className="relative section-container px-0 md:px-12 lg:mt-6 lg:px-[6rem] mt-8 md:mt-12 lg:mt-[3.4rem] mb-6 md:mb-8 lg:mb-[2rem] font-sans">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-[6rem]">
            {/* Executive Column */}
            <div className="flex flex-col">
              <div className="flex items-center mb-4 md:mb-4 lg:mb-[2rem] h-[40px] md:h-[48px] lg:h-[40px]">
                <h3 className="text-xl md:text-2xl lg:text-[1.6rem] font-semibold text-white leading-tight tracking-wide">
                  Executive
                </h3>
              </div>
              <div className="grid grid-cols-2 lg:flex gap-4 md:gap-6 lg:gap-[1.5rem]">
                  {executives.map((exec, idx) => (
                    <OfficerCard
                      key={idx}
                      name={exec.name}
                      role={exec.role}
                      photo={exec.photo}
                      className="w-full lg:min-w-[25rem] lg:w-[25rem]"
                      onClick={() => handlePersonClick({ name: exec.name, photo: exec.photo, subtitle: exec.role })}
                    />
                  ))}
              </div>
            </div>

            {/* Officers Column */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center justify-between mb-4 md:mb-4 lg:mb-[2rem] h-[40px] md:h-[48px] lg:h-[40px]">
                <h3 className="text-xl md:text-2xl lg:text-[1.6rem] font-semibold text-white leading-tight tracking-wide">
                  Officers
                </h3>
                <div className="flex gap-2">
                  <Button
                    onClick={prev}
                    className={`w-10 h-10 flex items-center justify-center rounded-[4px] border-none shadow-none ${!canScrollLeft
                      ? "bg-[#333333] text-gray-600 cursor-not-allowed"
                      : "bg-[#F02E31] text-white hover:bg-[#F02E31]/90"
                      }`}
                    disabled={!canScrollLeft}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
                  <Button
                    onClick={next}
                    className={`w-10 h-10 flex items-center justify-center rounded-[4px] border-none shadow-none ${!canScrollRight
                      ? "bg-[#333333] text-gray-600 cursor-not-allowed"
                      : "bg-[#F02E31] text-white hover:bg-[#F02E31]/90"
                      }`}
                    disabled={!canScrollRight}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="relative w-full flex-1">
                <div
                  ref={scrollRef}
                  onScroll={checkScroll}
                  className="flex gap-4 md:gap-6 lg:gap-[1.5rem] overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth pb-4"
                >
                  {officersList.map((officer, idx) => (
                    <div key={idx} className="snap-start shrink-0">
                      <OfficerCard
                        name={officer.name}
                        role={officer.role}
                        photo={officer.photo}
                        onClick={() => handlePersonClick({ name: officer.name, photo: officer.photo, subtitle: officer.role })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Committees Section */}
        {council?.committees?.length > 0 && (
          <section className="section-container px-0 md:px-12 lg:px-[6rem] mb-6 md:mb-8 lg:mb-[3rem] font-sans w-full">
            <h3 className="text-xl md:text-2xl lg:text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-4 md:mb-6">
              Committees
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {council.committees.map((c, idx) => (
                <CommitteeAccordion key={idx} committee={c} defaultOpen={idx === 0} />
              ))}
            </div>
          </section>
        )}

        {/* Year Representatives */}
        {council?.yearRepresentatives?.length > 0 && (
          <section className="section-container px-0 md:px-12 lg:px-[6rem] mb-6 md:mb-8 lg:mb-[3rem] font-sans w-full">
            <h3 className="text-xl md:text-2xl lg:text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-4 md:mb-6">
              Year Representatives
            </h3>
            <div className="flex flex-wrap gap-3">
              {council.yearRepresentatives.map((r, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/5 rounded px-3 py-2">
                  {r.photo && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={r.photo} alt={r.name} fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-white font-medium">{r.name}</p>
                    <p className="text-[10px] text-[#8C8C8C]">{r.yearLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Class Presidents */}
        {council?.classPresidents?.length > 0 && (
          <section className="section-container px-0 md:px-12 lg:px-[6rem] mb-6 md:mb-8 lg:mb-[3rem] font-sans w-full">
            <h3 className="text-xl md:text-2xl lg:text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-4 md:mb-6">
              Class Presidents
            </h3>
            <div className="flex flex-wrap gap-3">
              {council.classPresidents.map((cp, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/5 rounded px-3 py-2">
                  {cp.photo ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={cp.photo} alt={cp.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-xs text-white flex-shrink-0">
                      {cp.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-white font-medium">{cp.name}</p>
                    <p className="text-[10px] text-[#8C8C8C]">{cp.section}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <CouncilAbout />

      <AnimatePresence>
        {lightbox && (
          <PersonLightbox
            people={lightbox.people}
            initialIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
