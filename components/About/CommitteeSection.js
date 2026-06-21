import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PersonLightbox from "../Team/PersonLightbox";
import OfficerCard from "../Home/MeetCouncil/OfficerCard";

const CommitteeSection = ({ committees }) => {
  const [lightbox, setLightbox] = useState(null);

  if (!committees || committees.length === 0) return null;

  const openLightbox = (members, index) => {
    const people = members.map((m) => ({
      name: m.name,
      photo: m.photo,
      subtitle: m.role || "Member",
    }));
    setLightbox({ people, index });
  };
  return (
    <div className="flex flex-col w-full mt-16 md:mt-24 py-10 border-t border-b border-[#333333]">
      <AnimatePresence>
        {lightbox && (
          <PersonLightbox
            people={lightbox.people}
            initialIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-[4rem]">
        {committees.map((committee, cIdx) => (
          <div key={cIdx} className="flex flex-col">
            <h3 className="text-[1.375rem] md:text-[1.5rem] lg:text-[1.6rem] font-semibold text-[#D1D1D1] leading-tight tracking-wide mb-[1.2rem]">
              {committee.committeeName.replace(/ committee/gi, "")}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-[0.8rem] gap-y-[1.1rem]">
              {committee.members?.map((member, mIdx) => (
                <OfficerCard
                  key={mIdx}
                  name={member.name}
                  role={member.role}
                  photo={member.photo}
                  className="w-full"
                  nameClassName="text-sm md:text-base lg:text-[1.05rem]"
                  onClick={() => openLightbox(committee.members, mIdx)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommitteeSection;
