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
        className="py-8  text-center"
      >
        <p className="text-2xl font-semibold">
          Computer Science Council Members
        </p>
        <div className="mt-9 grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="col-span-full">
            <p className="text-xl">Jaqueline Porral</p>
            <p className="text-sm text-primary">President</p>
          </div>
          <div className="col-span-full">
            <p className="text-xl">Gerald Chavez</p>
            <p className="text-sm text-primary">Vice-President</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Mark Neil Embile</p>
            <p className="text-sm text-primary">Council Secretary</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Jessica Joy Gapusan</p>
            <p className="text-sm text-primary">Council Treasurer</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Mark Rhicky Rabi</p>
            <p className="text-sm text-primary">Business Manager</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Khate Crystal Bautista</p>
            <p className="text-sm text-primary">Business Manager</p>
          </div>
        </div>

        <div className="divider max-w-xl mx-auto my-10" />

        <p className="text-xl mb-5">
          About Bachelor of Science in Computer Science{' '}
        </p>
        <p>
          The study of computers and computing, encompassing their theoretical
          and algorithmic underpinnings, hardware and software, and applications
          for information processing. Computer science is the study of
          algorithms and data structures, computer and network architecture,
          data and information modelling, and artificial intelligence. Because
          computer science has certain mathematical and technical basis, it
          combines concepts from queueing theory, probability and statistics,
          and electrical circuit design. During the conceptualization, creation,
          measurement, and refining of novel algorithms, information structures,
          and computer architectures, computer science makes extensive use of
          hypothesis testing and experimentation. Computer science degree holder
          can become Software Engineer, Web Developer, and Hardware Engineer.
        </p>
      </motion.section>
    </>
  );
};

export default Page_Council;
