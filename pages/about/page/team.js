import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { _Transition_Page } from '../../../components/_Animations';

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
            <p className="text-sm  text-primary">
              Lead Project Developer &amp; Creative Director
            </p>
            <p className="text-xl">Gerald Chavez</p>
          </div>
          <div className="col-span-1 flex flex-col ">
            <p className="text-sm  text-primary">Lead Project Manager</p>
            <p className="text-xl">Jacqueline Porral</p>
          </div>
          <div className="col-span-1 flex flex-col ">
            <p className="text-sm  text-primary">Assitant Project Manager</p>
            <p className="text-xl">Mark Rhicky Raby</p>
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
            {/* <div className="col-span-full flex flex-col w-56 hover:-translate-y-1 transition-transform">
              <p className="text-sm  text-primary ">
                Project Management
              </p>
              <p className="text-xl">Jacqueline Porral</p>
              <p className="text-xl">Mark Rhicky Raby</p>
            </div>
            <div className="col-span-full flex flex-col w-56 hover:-translate-y-1 transition-transform">
              <p className="text-sm  text-primary ">
                Lead Project Developer &amp; Creative Director
              </p>
              <p className="text-xl">Gerald Chavez</p>
            </div> */}
            <div className="col-span-full flex flex-col w-56 hover:-translate-y-1 transition-transform">
              <p className="text-sm  text-primary ">
                Front-end Developers &amp; Designers
              </p>
              <p className="text-xl">Gerald Chavez</p>
              <p className="text-xl">Danica Cabullo</p>
            </div>
            <div className="col-span-full flex flex-col w-56 hover:-translate-y-1 transition-transform">
              <p className="text-sm  text-primary ">Back-end Developers</p>
              <p className="text-xl">Jacqueline Porral</p>
              <p className="text-xl">Gerald Chavez</p>
              <p className="text-xl">Demverleen Espinola</p>
            </div>
            <div className="col-span-full flex flex-col w-56 hover:-translate-y-1 transition-transform">
              <p className="text-sm  text-primary ">
                Documentation &amp; Support
              </p>
              <p className="text-xl">Jessica Joy Gasupan</p>
              <p className="text-xl">Evehn</p>
              <p className="text-xl">Hazel Jade</p>
              <p className="text-xl">Jhude</p>
              <p className="text-xl">Joko Gadingan</p>
            </div>
            <div className="col-span-full flex flex-col w-56 hover:-translate-y-1 transition-transform">
              <p className="text-sm  text-primary ">
                Content Mangement &amp; Marketing
              </p>
              <p className="text-xl">Mark Neil Embile</p>
              <p className="text-xl">Isaac Gabrielle Domino</p>
              <p className="text-xl">Justine</p>
            </div>
            <div className="col-span-full flex flex-col w-56 hover:-translate-y-1 transition-transform">
              <p className="text-sm  text-primary ">
                Quality Assurance &amp; Testing
              </p>
              <p className="text-xl">Gerald Chavez</p>
              <p className="text-xl">Gabrielle Napoto</p>
              <p className="text-xl">Khate Crystal Bautista</p>
              <p className="text-xl">Ivan</p>
              <p className="text-xl">Leonard</p>
              <p className="text-xl">Rosemarie</p>
            </div>
          </motion.div>
        </motion.div>

        <p className="text-right mt-5 opacity-50">Swipe Right</p>
      </motion.section>
    </>
  );
};

export default Page_Team;
