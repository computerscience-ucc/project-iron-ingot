import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import OfficerCard from "../components/Home/MeetCouncil/OfficerCard";
import CouncilParallaxText from "../components/Home/MeetCouncil/CouncilParallaxText";
import CouncilAbout from "../components/Home/MeetCouncil/CouncilAbout";

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
  }
`;

export default function Council() {
  const [councils, setCouncils] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    client.fetch(ALL_COUNCILS_QUERY).then((data) => {
      const list = data || [];
      setCouncils(list);
      const current = list.find((c) => c.isCurrent) || list[0];
      if (current) setSelectedId(current._id);
    });
  }, []);

  const council = councils.find((c) => c._id === selectedId);

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

          <div className="relative w-full max-w-[16rem] md:max-w-[20rem] lg:max-w-[28rem] aspect-square bg-[#242424] border border-dashed border-[#8E8E8E] flex items-center justify-center overflow-hidden group">
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

        {/* Executive Section */}
        <section className="relative section-container px-0 md:px-12 lg:px-[6rem] mt-8 md:mt-12 lg:mt-[3.4rem] font-sans">
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
                />
              ))}
            </div>
          </div>
        </section>

        {/* View All Link */}
        <div className="section-container px-0 md:px-12 lg:px-[6rem] mt-4 md:mt-6 mb-6 md:mb-8 lg:mb-[2rem] font-sans">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-[#8C8C8C] hover:text-[#FF5154] transition-colors text-sm md:text-base"
          >
            View all council members
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>

      <CouncilAbout />
    </div>
  );
}
