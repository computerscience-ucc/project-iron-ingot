import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@material-tailwind/react';
import Head from 'next/head';
import Page_Council from './page/council';
import Page_MIS from './page/mis';
import Page_Team from './page/team';
import TopGradient from '../../components/TopGradient';
import { _Transition_Page } from '../../components/_Animations';
import { useState } from 'react';

const AboutPage = (e) => {
  const [selected, setSelected] = useState(1);

  return (
    <>
      <TopGradient colorLeft={'#DB2777'} colorRight={'#A21CAF'} />

      <Head>
        <title>Blog | Ingo</title>
      </Head>

      <motion.main
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-36 z-10 min-h-screen"
      >
        <div className="flex flex-col gap-2 justify-center mt-16">
          <p className="text-4xl font-semibold">About</p>
          <p className="text-lg font-semibold">See who we are and what we do</p>
        </div>

        {/* tabs */}
        <div className="flex flex-col md:flex-row gap-4 mt-16">
          <Button
            className={`${
              selected === 1 ? 'bg-button-color text-button-texts-color' : 'bg-transparent text-header-color'
            }`}
            onClick={() => setSelected(1)}
            //color={`${selected == 1 && 'red'}`}
            variant={`${selected == 1 ? 'filled' : 'text'}`}
            fullWidth
          >
            Development Team
          </Button>
          <Button
            className={`${
              selected === 2 ? 'bg-button-color text-button-texts-color' : 'bg-transparent text-header-color'
            }`}
            onClick={() => setSelected(2)}
            //color={`${selected == 2 && 'red'}`}
            variant={`${selected == 2 ? 'filled' : 'text'}`}
            fullWidth
          >
            Computer Science Council
          </Button>
          <Button
            className={`${
              selected === 3 ? 'bg-button-color text-button-texts-color' : 'bg-transparent text-header-color'
            }`}
            onClick={() => setSelected(3)}
            //color={`${selected == 3 && 'red'}`}
            variant={`${selected == 3 ? 'filled' : 'text'}`}
            fullWidth
          >
            MIS - ACES
          </Button>
        </div>

        {/* content */}
        <div className="mt-16">
          <AnimatePresence exitBeforeEnter>
            <div key={selected}>
              {(selected == 1 && <Page_Team />) ||
                (selected == 2 && <Page_Council />) ||
                (selected == 3 && <Page_MIS />)}
            </div>
          </AnimatePresence>
        </div>
      </motion.main>
    </>
  );
};

export default AboutPage;
