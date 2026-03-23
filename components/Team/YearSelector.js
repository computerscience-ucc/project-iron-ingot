import React from "react";

const YearSelector = ({ years, selected, onSelect }) => (
  <div className="flex flex-wrap items-center gap-2 overflow-x-auto scrollbar-hide mb-8">
    {years.map((year) => {
      const isActive = selected === year._id;
      return (
        <button
          key={year.academicYear}
          onClick={() => onSelect(year._id)}
          className={`pl-2 pr-3 py-1.5 rounded-[4px] text-[0.875rem] font-medium leading-normal transition-colors whitespace-nowrap ${
            isActive
              ? "bg-[#FF5154] text-white cursor-default"
              : "bg-[#202020] text-[#8C8C8C] hover:text-[#EFEFEF] hover:bg-[#2A2A2A] cursor-pointer"
          }`}
        >
          {year.academicYear}
        </button>
      );
    })}
  </div>
);

export default YearSelector;
