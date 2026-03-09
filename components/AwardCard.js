import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const AwardCard = ({ award, onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="relative group break-inside-avoid rounded-2xl overflow-hidden bg-[#0f1218] border border-white/5 hover:border-red-500/40 transition-all cursor-pointer shadow-md hover:shadow-red-900/20 hover:shadow-lg mb-6"
    >
      {award.headerImage ? (
        <>
          {!loaded && (
            <div className="w-full h-48 bg-[#1a1d24] animate-pulse" />
          )}
          <div className={`w-full h-48 relative overflow-hidden transition-transform duration-500 group-hover:scale-105 ${
            loaded ? 'block' : 'hidden'
          }`}>
            <Image
              src={award.headerImage}
              alt={award.title}
              onLoadingComplete={() => setLoaded(true)}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </>
      ) : (
        <div className="w-full h-[260px] flex flex-col items-center justify-center bg-[#13151b] p-6 text-center gap-2">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-1">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-300">{award.title}</p>
          {award.category && (
            <p className="text-xs text-gray-500">{award.category}</p>
          )}
        </div>
      )}

      {/* hover overlay */}
      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-4">
        <div className="flex items-start justify-between gap-2">
          {award.academicYear && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-700/80 text-white font-semibold">
              {award.academicYear}
            </span>
          )}
          {award.images && award.images.length > 1 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-gray-300 ml-auto">
              {award.images.length} photos
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-snug">{award.title}</p>
          {award.category && (
            <p className="text-xs text-gray-300 mt-0.5">{award.category}</p>
          )}
          {award.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{award.description}</p>
          )}
          <p className="text-[10px] text-red-400 mt-2 font-medium">Click to view →</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AwardCard;
