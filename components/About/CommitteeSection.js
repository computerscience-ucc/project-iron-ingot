import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const CommitteeSection = ({ committees }) => {
  const [activeCommitteeIdx, setActiveCommitteeIdx] = useState(0);
  const [selectedMemberIdx, setSelectedMemberIdx] = useState(0);

  if (!committees || committees.length === 0) return null;

  const activeCommittee = committees[activeCommitteeIdx];
  const members = activeCommittee.members || [];
  const selectedMember = members[selectedMemberIdx] || members[0];

  const handleCommitteeChange = (index) => {
    setActiveCommitteeIdx(index);
    setSelectedMemberIdx(0);
  };

  const getFallbackDescription = (name) => {
    const lowerName = name?.toLowerCase() || "";
    if (lowerName.includes("program")) return "The dedicated team responsible for organizing our technical events, workshops, and program initiatives.";
    if (lowerName.includes("creative")) return "A group of visionary designers and artists focused on crafting the visual language, digital assets, and creative campaigns for our community.";
    if (lowerName.includes("technical")) return "A specialized team of developers and sysadmins dedicated to maintaining our core systems, software development, and technical platform stability.";
    return "The dedicated team contributing to our community's initiatives and projects.";
  };

  return (
    <div className="flex flex-col mt-16 w-full">
      {/* Committee Header: Title & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h3 className="text-[1.6rem] font-semibold text-white leading-tight tracking-wide">
          Committee Members
        </h3>

        {/* Committee Tabs */}
        <div className="flex flex-wrap items-center bg-[#202020] rounded-[6px] p-1 gap-1 h-fit w-fit">
          {committees.map((c, i) => (
            <button
              key={i}
              onClick={() => handleCommitteeChange(i)}
              className={`pl-2 pr-3 py-1.5 rounded-[4px] text-[0.875rem] font-medium leading-normal transition-all ${
                activeCommitteeIdx === i 
                  ? "bg-[#333333] text-white shadow-sm"
                  : "bg-transparent text-[#8C8C8C] hover:text-[#EFEFEF]"
              }`}
            >
              {c.committeeName.replace(/ committee/gi, "")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[4rem] xl:gap-[2rem] items-start">
        {/* Left: Interactive Grid */}
        <div className="grid grid-cols-4 w-full border-t border-l border-dashed border-[#8E8E8E]/40 h-fit">
          {Array.from({ length: 12 }).map((_, idx) => {
            const member = members[idx];
            const isSelected = member && selectedMemberIdx === idx;
            const isEmpty = !member;

            return (
              <div
                key={idx}
                onClick={() => !isEmpty && setSelectedMemberIdx(idx)}
                className={`relative aspect-square transition-all duration-300 border-r border-b border-dashed border-[#8E8E8E]/40 ${
                  !isEmpty ? "cursor-pointer bg-[#242424]" : "cursor-default bg-transparent"
                }`}
              >
                {/* Corner markers - always visible */}
                <div className="absolute top-[-0.5px] left-[-0.5px] w-[4px] h-[4px] bg-[#FF5154] z-30"></div>
                <div className="absolute top-[-0.5px] right-[-0.5px] w-[4px] h-[4px] bg-[#FF5154] z-30"></div>
                <div className="absolute bottom-[-0.5px] left-[-0.5px] w-[4px] h-[4px] bg-[#FF5154] z-30"></div>
                <div className="absolute bottom-[-0.5px] right-[-0.5px] w-[4px] h-[4px] bg-[#FF5154] z-30"></div>

                {!isEmpty && (
                  <div className={`relative w-full h-full transition-all duration-300 ${
                    isSelected ? "opacity-100 grayscale-0" : "opacity-25 grayscale hover:opacity-60"
                  }`}>
                    {member.photo && (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Details & Selector */}
        <div className="flex flex-col h-full min-h-[300px] py-4">
          {/* Selected Member Details */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${activeCommitteeIdx}-${selectedMemberIdx}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-1 items-start mb-8"
            >
              <h4 className="text-[1.25rem] font-semibold text-[#EFEFEF] tracking-normal leading-[1.3] line-clamp-1 w-full">
                {selectedMember?.name || "Member Name"}
              </h4>
              <p className="text-[#8C8C8C] text-[0.875rem] leading-[1.4] font-medium line-clamp-1 w-full">
                {selectedMember?.role || "Member"}
              </p>
            </motion.div>
          </AnimatePresence>

          <p className="text-[1rem] text-[#8C8C8C] font-normal leading-snug max-w-[450px] mt-auto">
            {activeCommittee.description || getFallbackDescription(activeCommittee.committeeName)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommitteeSection;
