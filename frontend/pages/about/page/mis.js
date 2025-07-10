import { _Transition_Page } from '../../../components/_Animations';
import { motion } from 'framer-motion';

const Page_MIS = (e) => {
  return (
    <>
      <motion.section
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-8  text-center"
      >
        <p className="text-2xl font-semibold mb-16">
          About Management Information System
        </p>

        <p>
          Management Information System helps the students in terms of data
          encoding and enrollment, MIS help the student to{' '}
          <span className="font-semibold text-header-color">
            see and gather their data in our Database
          </span>
          , MIS was built to help the University in terms of{' '}
          <span className="font-semibold text-header-color">
            students data, enrolling, encoding, and even photocopying
          </span>{' '}
          their paper works.
        </p>
        <p className="mt-4">
          <span className="font-semibold text-header-color">
            Prof. Joemen Barrios
          </span>
          , also an alumni of the University, is known as one of the{' '}
          <span className="font-semibold text-header-color">
            pioneers of the said organization
          </span>
          . As of now together with the student volunteers from all over the CSD
          or Computer Studies Department continously working to achieve its
          goal.
        </p>
        <p className="mt-4">
          MIS also teaching the other students under of its organization (ACES),
          different things about Computers, programming, encoding, and even
          technologies
        </p>
      </motion.section>
    </>
  );
};

export default Page_MIS;
