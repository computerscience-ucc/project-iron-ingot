import { motion } from 'framer-motion';
import { _Transition_Page } from '../../../components/_Animations';

const Page_Council = (e) => {
  return (
    <>
      <motion.section
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-8"
      >
        <p className="text-2xl font-semibold">Computer Science Council</p>

        {/* what is computer science council */}
        <div className="mt-8">
          <p className="text-lg font-semibold">
            What is Computer Science Council?
          </p>
          <p className="text-lg">
            Computer Science Council is a group of students who are interested
            in computer science. We are a collective of students that brings
            together a community of people who are interested in computer
            science.
          </p>
        </div>
      </motion.section>
    </>
  );
};

export default Page_Council;
