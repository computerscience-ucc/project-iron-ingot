import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

const TopGradient = ({ colorLeft, colorRight }) => {
  colorLeft = colorLeft || '#007ACC';
  colorRight = colorRight || '#F92450';

  const [isVisible, setIsVisible] = useState(true);

  useEffect((e) => {
    window.addEventListener('scroll', (e) => {
      setIsVisible(window.scrollY < 75);
    });
    return (e) => {
      window.removeEventListener('scroll', e);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.5, easings: 'circOut' },
      }}
      exit={{ opacity: 0, transition: { duration: 0.2, easings: 'circIn' } }}
      className="fixed top-0 left-0 h-[200px] scale-x-150 lg:h-[300px] w-full overflow-hidden -z-[1]"
    >
      <motion.div
        animate={{
          opacity: isVisible ? 1 : 0,
        }}
        style={{
          background: `radial-gradient(at 30% 0%, ${colorLeft}58, transparent, transparent)`,
        }}
        className="absolute top-0 left-0 z-0 h-full w-screen"
      />
      <motion.div
        animate={{
          opacity: isVisible ? 1 : 0,
        }}
        style={{
          background: `radial-gradient(at 70% 0%, ${colorRight}58, transparent, transparent)`,
        }}
        className="absolute top-0 left-0 z-0 h-full w-screen"
      />
    </motion.div>
  );
};

export default TopGradient;
