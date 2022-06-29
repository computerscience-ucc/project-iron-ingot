import { motion, AnimatePresence } from 'framer-motion';
import { _Transition_Page } from '../../components/_Animations';
import { useState } from 'react';
import Page_Council from './page/council';
import Page_MIS from './page/mis';
import Head from 'next/head';
import Page_Team from './page/team';

const AboutPage = (e) => {
  const [selected, setSelected] = useState(1);

  return (
    <>
      <Head>
        <title>About | Ingo</title>
      </Head>

      <motion.section
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-36"
      >
        <div className="mt-16">
          <p className="text-4xl font-semibold">About</p>
          <p className="text-lg font-semibold">See who we are and what we do</p>
        </div>

        {/* selector */}
        <div className="flex flex-col md:flex-row mt-14 justify-around gap-2 w-full ">
          <div
            onClick={(e) => setSelected(1)}
            className={`cursor-pointer text-center p-3 w-full transition-colors rounded-lg ${
              selected == 1 && 'bg-base-300'
            }`}
          >
            <p>Ingo Development Team</p>
          </div>
          <div
            onClick={(e) => setSelected(2)}
            className={`cursor-pointer text-center p-3 w-full transition-colors rounded-lg ${
              selected == 2 && 'bg-base-300'
            }`}
          >
            <p>Computer Science Council</p>
          </div>
          <div
            onClick={(e) => setSelected(3)}
            className={`cursor-pointer text-center p-3 w-full transition-colors rounded-lg ${
              selected == 3 && 'bg-base-300'
            }`}
          >
            <p>MIS</p>
          </div>
        </div>

        {/* content */}
        <div className="mt-16">
          <AnimatePresence>
            {(selected == 1 && <Page_Team />) ||
              (selected == 2 && <Page_Council />) ||
              (selected == 3 && <Page_MIS />)}
          </AnimatePresence>
        </div>
      </motion.section>
    </>
  );
};

export default AboutPage;
