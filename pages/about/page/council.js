import { _Transition_Page } from '../../../components/_Animations';
import { motion } from 'framer-motion';

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
        <div className="mt-16  grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="col-span-full">
            <p className="text-xl">Prof. Joemen Barrios</p>
            <p className="text-sm text-yellow-600">Program Coordinator</p>
          </div>
          <div className="col-span-full">
            <p className="text-xl">Jaqueline Porral</p>
            <p className="text-sm text-yellow-600">Council President</p>
          </div>
          <div className="col-span-full">
            <p className="text-xl">Gerald Chavez</p>
            <p className="text-sm text-yellow-600">Council Vice-President</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Mark Neil Embile</p>
            <p className="text-sm text-yellow-600">Council Secretary</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Jessica Joy Gapusan</p>
            <p className="text-sm text-yellow-600">Council Treasurer</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Mark Rhicky Rabi</p>
            <p className="text-sm text-yellow-600">Business Manager</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Khate Crystal Bautista</p>
            <p className="text-sm text-yellow-600">Business Manager</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Katherine Ocares</p>
            <p className="text-sm text-yellow-600">Public Relation Officer</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Jhude Vergara</p>
            <p className="text-sm text-yellow-600">Public Relation Officer</p>
          </div>
        </div>
        <p className="text-2xl mt-24  font-semibold">Class Presidents</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="col-span-full md:col-span-2">
            <p className="text-xl">Alexander Caberto</p>
            <p className="text-sm text-yellow-600">BSCS 4A</p>
          </div>
          <div className="col-span-full md:col-span-2">
            <p className="text-xl">Mark Neil Embile</p>
            <p className="text-sm text-yellow-600">BSCS 4B</p>
          </div>
          <div className="col-span-full md:col-span-2">
            <p className="text-xl">Carl Emmanuel Alvarado Sy</p>
            <p className="text-sm text-yellow-600">BSCS 4C</p>
          </div>
          <div className="col-span-full md:col-span-full">
            <p className="text-xl">Mauirene R. Fuentes</p>
            <p className="text-sm text-yellow-600">BSCS 3A</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Khate Crystal Bautista</p>
            <p className="text-sm text-yellow-600">BSCS 2A</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Mark Rhicky Rabi</p>
            <p className="text-sm text-yellow-600">BSCS 2B</p>
          </div>
        </div>

        <div className="border-b-2 border-white max-w-xl mx-auto my-32" />

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
