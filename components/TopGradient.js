import { motion } from 'framer-motion';

const TopGradient = ({ colorLeft, colorRight }) => {
  colorLeft = colorLeft || '#007ACC';
  colorRight = colorRight || '#F92450';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.5, easings: 'circOut' },
      }}
      exit={{ opacity: 0, transition: { duration: 0.2, easings: 'circIn' } }}
      className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden"
    >
      <motion.div
        style={{
          background: `radial-gradient(at 30% 0%, ${colorLeft}58, transparent, transparent)`,
        }}
        className="absolute top-0 left-0 z-0 h-1/2 w-screen"
      />
      <motion.div
        style={{
          background: `radial-gradient(at 70% 0%, ${colorRight}58, transparent, transparent)`,
        }}
        className="absolute top-0 left-0 z-0 h-1/2 w-screen"
      />
    </motion.div>
  );
};

export default TopGradient;
