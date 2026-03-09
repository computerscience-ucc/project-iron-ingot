import { motion } from 'framer-motion';

const YearSelector = ({ years, selected, onSelect }) => (
  <div className="flex flex-wrap justify-center gap-2 mt-8">
    {years.map((year) => (
      <motion.button
        key={year.academicYear}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(year._id)}
        className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
          selected === year._id
            ? 'text-white'
            : 'text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/10'
        }`}
      >
        {selected === year._id && (
          <motion.div
            layoutId="teamYearPill"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-button-color to-header-color"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ zIndex: -1 }}
          />
        )}
        {year.academicYear}
        {year.isCurrent && <span className="ml-1 text-yellow-400 text-[10px] align-bottom">★</span>}
      </motion.button>
    ))}
  </div>
);

export default YearSelector;
