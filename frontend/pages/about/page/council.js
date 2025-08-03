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
          {/* Leadership */}
          <div className="col-span-full">
            <p className="text-xl">Prof. Joemen G. Barrios</p>
            <p className="text-sm text-header-color">Adviser</p>
          </div>
          <div className="col-span-full">
            <p className="text-xl">Gwyneth F. Uy</p>
            <p className="text-sm text-header-color">President</p>
          </div>
          <div className="col-span-full">
            <p className="text-xl">Marianne Celest T. Jerez</p>
            <p className="text-sm text-header-color">Vice President</p>
          </div>
          
          {/* Officers */}
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Crystal M. Florano</p>
            <p className="text-sm text-header-color">Secretary</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Jan Aryan C. Bebania</p>
            <p className="text-sm text-header-color">Assistant Secretary</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Joshua V. Dayapera</p>
            <p className="text-sm text-header-color">Treasurer</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Nathaniel C. Tarroza</p>
            <p className="text-sm text-header-color">Auditor</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Dhan Renz D.C. Ellorinco</p>
            <p className="text-sm text-header-color">Public Relations Officer</p>
          </div>

          {/* Year Representatives */}
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Gian Higino O. Fungo</p>
            <p className="text-sm text-header-color">4th Year Representative</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Red Evan I. Igot</p>
            <p className="text-sm text-header-color">3rd Year Representative</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Rodge Patrick T. Pangilinan</p>
            <p className="text-sm text-header-color">2nd Year Representative</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Daniel Z. Baladad</p>
            <p className="text-sm text-header-color">1st Year Representative</p>
          </div>

          {/* Creative Committee */}
          <div className="col-span-full">
            <p className="text-lg font-semibold mt-8 mb-4 text-header-color">Creative Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Jella Anne M. Gonzales</p>
            <p className="text-sm text-header-color">Creative Committee Head</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Allan V. Jabol Jr.</p>
            <p className="text-sm text-header-color">Creative Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Ma. Janine F. Bayot</p>
            <p className="text-sm text-header-color">Creative Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Chrizzon T. Villa-Abrille</p>
            <p className="text-sm text-header-color">Creative Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Michael Angelo B. Baynosa</p>
            <p className="text-sm text-header-color">Creative Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Justine Andrie C. Pelgone</p>
            <p className="text-sm text-header-color">Creative Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Maxine Joy B. Valdez</p>
            <p className="text-sm text-header-color">Creative Committee</p>
          </div>

          {/* Program Committee */}
          <div className="col-span-full">
            <p className="text-lg font-semibold mt-8 mb-4 text-header-color">Program Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Christian D. Perez</p>
            <p className="text-sm text-header-color">Program Committee Head</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Gero Earl S. Pereyra</p>
            <p className="text-sm text-header-color">Program Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Carl James A. Juliane</p>
            <p className="text-sm text-header-color">Program Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Gabrielle Windser A. Gomez</p>
            <p className="text-sm text-header-color">Program Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Reshell Kyla M. Turgo</p>
            <p className="text-sm text-header-color">Program Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Alberto Jr. B. Balante</p>
            <p className="text-sm text-header-color">Program Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Shaira Marie A. Sollano</p>
            <p className="text-sm text-header-color">Program Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Jennelyn A. Tumbokon</p>
            <p className="text-sm text-header-color">Program Committee</p>
          </div>

          {/* Technical Committee */}
          <div className="col-span-full">
            <p className="text-lg font-semibold mt-8 mb-4 text-header-color">Technical Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Jhon Keneth B. Namias</p>
            <p className="text-sm text-header-color">Technical Committee Head</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Ike Andrie N. Rosacay</p>
            <p className="text-sm text-header-color">Technical Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Shan Ricz M. Ilao</p>
            <p className="text-sm text-header-color">Technical Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">John Key Bird G. Bojos</p>
            <p className="text-sm text-header-color">Technical Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Michaelrey O. Cristobal</p>
            <p className="text-sm text-header-color">Technical Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Exequiel Lord S. Papina</p>
            <p className="text-sm text-header-color">Technical Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">John Leonard F. Chan</p>
            <p className="text-sm text-header-color">Technical Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Mary Joy L. Sembrero</p>
            <p className="text-sm text-header-color">Technical Committee</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">Fritz Mckenzie V. Hernandez</p>
            <p className="text-sm text-header-color">Technical Committee</p>
          </div>
        </div>


        <p className="text-2xl mt-24  font-semibold">Class Presidents</p>
        {/* TODO: Add class president names once data is available */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* 4th Year - 3 sections */}
          <div className="col-span-full md:col-span-2">
            <p className="text-xl">TBA</p>
            <p className="text-sm text-header-color">BSCS 4A</p>
          </div>
          <div className="col-span-full md:col-span-2">
            <p className="text-xl">TBA</p>
            <p className="text-sm text-header-color">BSCS 4B</p>
          </div>
          <div className="col-span-full md:col-span-2">
            <p className="text-xl">TBA</p>
            <p className="text-sm text-header-color">BSCS 4C</p>
          </div>
          
          {/* 3rd Year - 2 sections */}
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">TBA</p>
            <p className="text-sm text-header-color">BSCS 3A</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">TBA</p>
            <p className="text-sm text-header-color">BSCS 3B</p>
          </div>
          
          {/* 2nd Year - 2 sections */}
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">TBA</p>
            <p className="text-sm text-header-color">BSCS 2A</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">TBA</p>
            <p className="text-sm text-header-color">BSCS 2B</p>
          </div>
          
          {/* 1st Year - 2 sections */}
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">TBA</p>
            <p className="text-sm text-header-color">BSCS 1A</p>
          </div>
          <div className="col-span-full md:col-span-3">
            <p className="text-xl">TBA</p>
            <p className="text-sm text-header-color">BSCS 1B</p>
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
