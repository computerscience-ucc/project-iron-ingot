import { motion } from 'framer-motion';

const CardSkeleton = ({ height }) => {
  height = height || 200;

  return (
    <motion.div
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: 1,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      className="relative min-h-[200px] w-full overflow-hidden rounded-lg bg-[#fff] bg-opacity-[0.05]"
    ></motion.div>
  );
};

export default CardSkeleton;
