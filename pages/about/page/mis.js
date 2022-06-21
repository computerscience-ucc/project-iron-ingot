import { motion } from 'framer-motion';
import { _Transition_Page } from '../../../components/_Animations';

const Page_MIS = (e) => {
  return (
    <>
      <motion.section
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-8"
      >
        <p>MIS</p>
      </motion.section>
    </>
  );
};

export default Page_MIS;
