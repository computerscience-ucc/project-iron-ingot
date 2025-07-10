import { useEffect, useRef, useState } from 'react';

import { CgArrowRight } from 'react-icons/cg';
import { _Transition_Page } from '../../../components/_Animations';
import { motion } from 'framer-motion';

const Page_Team = (e) => {
  const [carouselWidth, setCarouselWidth] = useState(0);
  const carousel = useRef();

  useEffect((e) => {
    setCarouselWidth(
      carousel.current.scrollWidth - carousel.current.offsetWidth
    );
  }, []);

  return (
    <>
      <motion.section
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-8"
      >
        <p className="text-2xl font-semibold text-center">
          Project Ingo Development Team
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-16 text-center gap-10">
          <div className="col-span-full flex flex-col ">
            <p className="text-xl">Gerald Chavez</p>
            <p className="text-sm text-header-color">
              Lead Project Developer &amp; Creative Director
            </p>
          </div>
          <div className="col-span-1 flex flex-col ">
            <p className="text-xl">Jacqueline Porral</p>
            <p className="text-sm text-header-color">Lead Project Manager</p>
          </div>
          <div className="col-span-1 flex flex-col ">
            <p className="text-xl">Mark Rhicky Raby</p>
            <p className="text-sm text-header-color">Assistant Project Manager</p>
          </div>
        </div>

        {/* carousel with framer motion */}
        <motion.div
          ref={carousel}
          className="cursor-grab overflow-hidden w-full mt-16"
        >
          <motion.div
            drag="x"
            dragConstraints={{
              right: 0,
              left: -carouselWidth,
            }}
            whileTap={{ cursor: 'grabbing' }}
            className="flex flex-nowrap w-max gap-7"
          >
            <div className="col-span-full flex flex-col w-56 hover:-translate-y-1 transition-transform">
              <p className="text-sm text-header-color">
                Front-end Developers &amp; Designers
              </p>
              <p className="text-xl">Gerald Chavez</p>
              <p className="text-xl">Danica Cabullo</p>
            </div>
            <div className="col-span-full flex flex-col w-56 hover:-translate-y-1 transition-transform">
              <p className="text-sm text-header-color">Back-end Developers</p>
              <p className="text-xl">Jacqueline Porral</p>
              <p className="text-xl">Gerald Chavez</p>
              <p className="text-xl">Demverleen Espinola</p>
            </div>
            <div className="col-span-full flex flex-col w-56 hover:-translate-y-1 transition-transform">
              <p className="text-sm text-header-color">
                Documentation &amp; Support
              </p>
              <p className="text-xl">Jessica Joy Gasupan</p>
              <p className="text-xl">Evehn Kadusale</p>
              <p className="text-xl">Hazel Jade Lobenaria</p>
              <p className="text-xl">Jhude Vergara</p>
              <p className="text-xl">Joko Gadingan</p>
            </div>
            <div className="col-span-full flex flex-col w-56 hover:-translate-y-1 transition-transform">
              <p className="text-sm text-header-color">
                Content Mangement &amp; Marketing
              </p>
              <p className="text-xl">Mark Neil Embile</p>
              <p className="text-xl">Isaac Gabrielle Domino</p>
              <p className="text-xl">Justine Consulta</p>
            </div>
            <div className="col-span-full flex flex-col w-56 hover:-translate-y-1 transition-transform">
              <p className="text-sm text-header-color">
                Quality Assurance &amp; Testing
              </p>
              <p className="text-xl">Gerald Chavez</p>
              <p className="text-xl">Gabrielle Napoto</p>
              <p className="text-xl">Khate Crystal Bautista</p>
              <p className="text-xl">Ivan Guillermo</p>
              <p className="text-xl">Leonard Leaño</p>
              <p className="text-xl">Rosemarie Bullo</p>
            </div>
          </motion.div>
        </motion.div>

        <p className="text-right mt-5 opacity-50 flex gap-3 justify-end items-center">
          <span>Swipe Right</span>
          <span className="text-yellow-500">
            <CgArrowRight size={20} />
          </span>
        </p>
      </motion.section>
    </>
  );
};

export default Page_Team;
