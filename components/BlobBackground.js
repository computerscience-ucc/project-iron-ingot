import { motion } from 'framer-motion';

const BlobBackgound = (e) => {
  return (
    <motion.div
      initial={{ opacity: 0, translateX: 50, translateY: -50 }}
      animate={{
        opacity: 1,
        translateX: 0,
        translateY: 0,
        transition: {
          duration: 0.2,
          ease: 'circOut',
          delay: 0.2,
        },
      }}
      exit={{
        opacity: 0,
        translateX: 50,
        translateY: -50,
        transition: {
          duration: 0.2,
          ease: 'circIn',
        },
      }}
      className="fixed w-full h-screen inset-0 -z-10"
    >
      <img className="absoute h-full w-full object-cover" src="./Blob.svg" />
    </motion.div>
  );
};

export default BlobBackgound;
