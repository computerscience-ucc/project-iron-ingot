import { motion } from "framer-motion";

const YearSelector = ({ years, selected, onSelect }) => (
  <div className="flex flex-wrap items-center gap-2 overflow-x-auto scrollbar-hide mb-8 relative">
    {years.map((year) => {
      const isActive = selected === year._id;
      return (
        <button
          key={year.academicYear}
          onClick={() => onSelect(year._id)}
          className={`relative pl-2 pr-3 py-1.5 rounded-[4px] text-[0.875rem] font-medium leading-normal transition-all whitespace-nowrap ${
            isActive
              ? "text-white cursor-default"
              : "text-[#8C8C8C] hover:text-[#EFEFEF] cursor-pointer"
          }`}
        >
          {isActive && (
            <motion.div
              layoutId="activeTeamYearSlider"
              className="absolute inset-0 bg-[#FF5154] rounded-[4px] z-0"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {!isActive && <div className="absolute inset-0 bg-[#202020] hover:bg-[#2A2A2A] rounded-[4px] z-0 transition-colors" />}
          <span className="relative z-10">{year.academicYear}</span>
        </button>
      );
    })}
  </div>
);

export default YearSelector;
