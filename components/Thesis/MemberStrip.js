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
  const link = member.linkedIn || member.website || null;
  const photoUrl = typeof member.photo === "string"
    ? member.photo
    : member.photo?.asset?.url || null;

  const inner = (
    <div
      className="relative flex flex-col items-center cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* avatar */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-red-500/60 transition-all shadow-md bg-[#1a1d24] flex items-center justify-center shrink-0">
        {photoUrl ? (
          <Image src={photoUrl} fill style={{ objectFit: "cover" }} alt={member.fullName} sizes="48px" />
        ) : (
          <span className="text-sm font-bold text-gray-300">{getInitials(member.fullName)}</span>
        )}
      </div>

      {/* social icon */}
      {link && (
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0e1015] border border-white/10 flex items-center justify-center">
          {member.linkedIn
            ? <AiFillLinkedin size={10} className="text-blue-400" />
            : <AiOutlineGlobal size={10} className="text-green-400" />}
        </span>
      )}

      {/* tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute top-14 z-20 bg-[#1a1d24] border border-white/10 rounded-xl px-3 py-2 shadow-xl whitespace-nowrap pointer-events-none"
          >
            <p className="text-xs font-semibold text-gray-100">{member.fullName}</p>
            {member.section && <p className="text-[10px] text-gray-500 mt-0.5">{member.section}</p>}
            {link && (
              <p className="text-[9px] text-red-400 mt-1">
                {member.linkedIn ? "LinkedIn" : "Website"} →
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return link
    ? <a href={link} target="_blank" rel="noopener noreferrer">{inner}</a>
    : <div>{inner}</div>;
};

const MemberStrip = ({ members }) => {
  if (!members || members.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-5 items-start mb-10 px-1">
      {members.map((m, i) => <MemberCard key={i} member={m} />)}
    </div>
  );
};

export default MemberStrip;
