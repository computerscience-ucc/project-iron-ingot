import { motion } from "framer-motion";
import Image from "next/image";
import { getGradient } from "./PersonLightbox";

const cardPop = {
  initial: { opacity: 0, scale: 0.85, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const PersonCard = ({ name, subtitle, photo, highlight = false, onClick, size = "lg" }) => {
  const gradient = getGradient(name);
  const isSmall = size === "sm";
  const cardW = isSmall ? "w-32 md:w-40" : "w-52 md:w-64";
  const cardH = isSmall ? "h-40 md:h-48" : "h-64 md:h-80";
  const initials = isSmall ? "text-3xl md:text-4xl" : "text-5xl md:text-6xl";

  return (
    <motion.div
      variants={cardPop}
      onClick={onClick}
      className={`${cardW} flex-shrink-0 flex flex-col ${highlight ? "relative" : ""} ${onClick ? "cursor-pointer group/card" : ""}`}
    >
      {highlight && (
        <motion.div
          className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-header-color/20 to-button-color/10 blur-md -z-10"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {photo ? (
        <div className={`${cardH} w-full rounded-xl overflow-hidden ring-1 ${highlight ? "ring-header-color" : "ring-white/10"} shadow-lg transition-all relative ${onClick ? "group-hover/card:ring-header-color group-hover/card:scale-[1.02]" : ""}`}>
          <Image src={photo} alt={name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      ) : (
        <div className={`${cardH} w-full rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} ring-1 ${highlight ? "ring-header-color" : "ring-white/10"} shadow-lg transition-all ${onClick ? "group-hover/card:ring-header-color" : ""}`}>
          <span className={`${initials} font-bold opacity-70`}>{name?.charAt(0) || "?"}</span>
        </div>
      )}
      <div className="mt-3 text-center px-1">
        <p className="font-semibold leading-tight text-sm md:text-base">{name}</p>
        <p className="text-[11px] text-header-color leading-tight mt-1">{subtitle}</p>
        {onClick && <p className="text-[9px] text-white/20 mt-0.5 group-hover/card:text-white/40 transition-colors">Click to view</p>}
      </div>
    </motion.div>
  );
};

export default PersonCard;
