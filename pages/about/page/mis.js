import { _Transition_Page } from "../../../lib/animations";
import { motion } from "framer-motion";

const Page_MIS = () => {
  return (
    <>
      <motion.section
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-12 text-left"
      >
        <h2 className="text-[1.625rem] font-semibold text-white mb-10 tracking-normal leading-tight">
          About Management Information System
        </h2>

        <div className="flex flex-col gap-6 text-[1rem] text-[#8C8C8C] font-normal leading-relaxed max-w-[800px]">
          <p>
            Management Information System helps the students in terms of data
            encoding and enrollment, MIS help the student to{" "}
            <span className="font-medium text-white">
              see and gather their data in our Database
            </span>
            , MIS was built to help the University in terms of{" "}
            <span className="font-medium text-white">
              students data, enrolling, encoding, and even photocopying
            </span>{" "}
            their paper works.
          </p>
          <p>
            <span className="font-medium text-white">
              Prof. Joemen Barrios
            </span>
            , also an alumni of the University, is known as one of the{" "}
            <span className="font-medium text-white">
              pioneers of the said organization
            </span>
            . As of now together with the student volunteers from all over the CSD
            or Computer Studies Department continously working to achieve its
            goal.
          </p>
          <p>
            MIS also teaching the other students under of its organization (ACES),
            different things about Computers, programming, encoding, and even
            technologies.
          </p>
        </div>
      </motion.section>
    </>
  );
};

export default Page_MIS;
