import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import SkeletonBox from "../ui/SkeletonBox";

const Card = ({ award, onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="relative group bg-[#1A1A1A] border border-dashed border-[#5B5B5B] cursor-pointer w-full break-inside-avoid"
    >
      {/* Corner Dots */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-[#efefef] z-30 transform -translate-x-[0.5px] -translate-y-[0.5px]" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-[#efefef] z-30 transform translate-x-[0.5px] -translate-y-[0.5px]" />
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-[#efefef] z-30 transform -translate-x-[0.5px] translate-y-[0.5px]" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#efefef] z-30 transform translate-x-[0.5px] translate-y-[0.5px]" />

      {award.headerImage?.url ? (
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: award.headerImage.metadata ? `${award.headerImage.metadata.width} / ${award.headerImage.metadata.height}` : "auto",
          }}
        >
          {!loaded && (
            <div className="absolute inset-0 z-10 opacity-50">
              <SkeletonBox width="100%" height="100%" borderRadius="0" />
            </div>
          )}
          <Image
            src={award.headerImage.url}
            alt={award.title}
            onLoad={() => setLoaded(true)}
            fill
            className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="bg-[#262626] flex flex-col items-center justify-center p-6 text-center gap-2 aspect-[3/4]">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-1">
            <svg className="w-6 h-6 text-[#8C8C8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        </div>
      )}

      {/* hover overlay */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5 z-20">
        <h3 className="text-[1rem] sm:text-[1.25rem] font-semibold text-[#EFEFEF] group-hover:text-white mb-1.5 sm:mb-2 tracking-normal transition-colors leading-[1.3] line-clamp-2">
          {award.title}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {award.academicYear && (
            <span className="px-1.5 py-0.5 bg-[#EA2B2E] text-[#EFEFEF] text-[0.7rem] sm:text-[0.8rem] font-sans font-medium tracking-wide">
              {award.academicYear}
            </span>
          )}
          {award.category && (
            <span className="px-1.5 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.7rem] sm:text-[0.8rem] font-sans font-medium uppercase tracking-wide">
              {award.category}
            </span>
          )}
          {award.images && award.images.length > 1 && (
            <span className="px-1.5 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.7rem] sm:text-[0.8rem] font-sans font-medium uppercase tracking-wide">
              {award.images.length} Photos
            </span>
          )}
          {award.tags?.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.7rem] sm:text-[0.8rem] font-sans font-medium uppercase tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
