import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AiFillLinkedin, AiOutlineGlobal } from "react-icons/ai";
import Image from "next/image";

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const MemberCard = ({ member }) => {
  const [hovered, setHovered] = useState(false);
  const photoUrl = typeof member.photo === "string"
    ? member.photo
    : member.photo?.asset?.url || null;

  return (
    <div 
      className="relative aspect-square bg-transparent border-r border-b border-dashed border-[#8E8E8E]/40 w-[60px] sm:w-[80px] group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Corner markers */}
      <div className="absolute top-[-0.5px] left-[-0.5px] w-[4px] h-[4px] bg-[#FF5154] z-30"></div>
      <div className="absolute top-[-0.5px] right-[-0.5px] w-[4px] h-[4px] bg-[#FF5154] z-30"></div>
      <div className="absolute bottom-[-0.5px] left-[-0.5px] w-[4px] h-[4px] bg-[#FF5154] z-30"></div>
      <div className="absolute bottom-[-0.5px] right-[-0.5px] w-[4px] h-[4px] bg-[#FF5154] z-30"></div>

      <div className="relative w-full h-full opacity-100 grayscale-0 transition-opacity group-hover:opacity-60">
        {photoUrl ? (
          <Image src={photoUrl} fill className="object-cover" alt={member.fullName || ""} />
        ) : (
          <div className="flex items-center justify-center h-full text-[#8C8C8C] text-[10px] sm:text-xs font-bold bg-transparent">
            {getInitials(member.fullName)}
          </div>
        )}
      </div>

      {/* Social Icons (Absolute Bottom Left) */}
      {(member.linkedIn || member.website) && (
        <div className="absolute bottom-0 left-0 z-[50] flex items-center overflow-hidden">
          {member.linkedIn && (
            <a
              href={member.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] bg-[#181818] border-r border-t border-dashed border-[#8E8E8E]/40 flex items-center justify-center text-[#0077B5] hover:text-white transition-all"
            >
              <AiFillLinkedin className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" />
            </a>
          )}
          {member.website && (
            <a
              href={member.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] bg-[#181818] border-r border-t border-dashed border-[#8E8E8E]/40 flex items-center justify-center text-[#3B82F6] hover:text-white transition-all"
            >
              <AiOutlineGlobal className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" />
            </a>
          )}
        </div>
      )}

      {/* Floating Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full mt-[8px] left-1/2 z-[100] bg-[#1a1b1e] border border-[#2F2F2F] px-3 py-1.5 shadow-2xl whitespace-nowrap pointer-events-none rounded-[4px]"
            style={{ x: "-50%" }}
          >
            <p className="text-[0.75rem] font-normal text-white leading-tight text-center">{member.fullName}</p>
            {member.role && <p className="text-[0.65rem] text-[#8C8C8C] mt-0.5 uppercase tracking-wider font-normal text-center">{member.role}</p>}
            {member.website && (
              <p className="text-[0.75rem] text-[#8C8C8C] mt-1 font-normal leading-tight text-center">
                Visit Website →
              </p>
            )}
            
            {/* Small arrow/beak above tooltip */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a1b1e] border-l border-t border-[#2F2F2F] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MemberStrip = ({ members }) => {
  if (!members || members.length === 0) return null;
  return (
    <div className="mb-10 w-fit max-w-full">
      <div className="flex flex-wrap border-t border-l border-dashed border-[#8E8E8E]/40 w-fit max-w-full">
        {members.map((m, i) => <MemberCard key={i} member={m} />)}
      </div>
    </div>
  );
};

export default MemberStrip;
