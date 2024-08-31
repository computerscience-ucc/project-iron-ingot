import { useEffect, useState } from 'react';

import Head from 'next/head';
import ThesisCard from '../../components/card/Thesis';
import TopGradient from '../../components/TopGradient';
import { _Transition_Page } from '../../components/_Animations';
import { motion } from 'framer-motion';
import { usePrefetcer } from '../../components/Prefetcher';

const Thesis = (e) => {
  const { thesis } = usePrefetcer();
  const [thesisList, setThesisList] = useState([]);

  useEffect(() => {
    setThesisList(thesis);
  }, [thesis]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <TopGradient colorLeft={'#180ea4'} colorRight={'#E22837'} />
      <Head>
        <title>Thesis | Ingo</title>
      </Head>

      <motion.main
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-36 z-10"
      >
        <div className="flex flex-col gap-2 justify-center mt-16">
          <p className="text-4xl font-semibold">Thesis</p>
          <p className="text-lg font-semibold">
            See what graduating and graduate CS students made their projects
          </p>
        </div>

        <div className="flex flex-col gap-2 justify-center my-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {thesisList.length > 0 &&
              thesisList.map((thesis, index) => (
                <div key={index}>
                  <ThesisCard thesis={thesis} />
                </div>
              ))}

            {thesisList.length < 1 && (
              <div className="flex flex-col gap-2 justify-center">
                <p className="text-lg font-semibold">
                  No thesis was uploaded yet. Check back later!
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default Thesis;
