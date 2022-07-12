import { motion, AnimatePresence } from 'framer-motion';
import { _Transition_Page } from '../../components/_Animations';
import { useState } from 'react';
import Page_Council from './page/council';
import Page_MIS from './page/mis';
import Head from 'next/head';
import Page_Team from './page/team';
import TopGradient from '../../components/TopGradient';

const AboutPage = (e) => {
  const [selected, setSelected] = useState(1);

  return (
    <>
      <Head>
        <title>About | Ingo</title>
      </Head>

      <TopGradient colorLeft={'#DB2777'} colorRight={'#A21CAF'} />

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
        <div className="grid grid-cols-1 md:grid-cols-3 mt-14 justify-around gap-">
          <motion.div
            onClick={(e) => setSelected(1)}
            className={`cursor-pointer md:border-b-2 md:border-x-0 border-x-8 text-center p-3 w-full transition-colors ${
              selected == 1 ? 'border-primary' : 'border-gray-700'
            }`}
          >
            <p>Ingo Development Team</p>
          </motion.div>
          <motion.div
            onClick={(e) => setSelected(2)}
            className={`cursor-pointer md:border-b-2 md:border-x-0 border-x-8 text-center p-3 w-full transition-colors ${
              selected == 2 ? 'border-primary' : 'border-gray-700'
            }`}
          >
            <p>Computer Science Council</p>
          </motion.div>
          <motion.div
            onClick={(e) => setSelected(3)}
            className={`cursor-pointer md:border-b-2 md:border-x-0 border-x-8 text-center p-3 w-full transition-colors ${
              selected == 3 ? 'border-primary' : 'border-gray-700'
            }`}
          >
            <p>MIS</p>
          </motion.div>
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
