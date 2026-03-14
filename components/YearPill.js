import { motion } from 'framer-motion';

const YearPill = ({ label, year = label, selected, active = selected, onClick }) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
      (active || selected === year)
        ? 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
        : 'bg-[#1a1c23] text-gray-400 border-white/5 hover:bg-[#22252e] hover:text-gray-200'
    }`}
  >
    {label || year}
  </motion.button>
);

export default YearPill;
