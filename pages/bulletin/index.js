import { useEffect, useState } from 'react';

import BulletinCard from '../../components/card/Bulletin';
import Head from '../../components/Head';
import TopGradient from '../../components/TopGradient';
import { _Transition_Page } from '../../components/_Animations';
import { motion } from 'framer-motion';
import { usePrefetcer } from '../../components/Prefetcher';

const Bulletin = (e) => {
  const { bulletins } = usePrefetcer();
  const [bulletinList, setBulletinList] = useState([]);

  useEffect(() => {
    setBulletinList(bulletins);
  }, [bulletins]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <TopGradient colorLeft={'#fd0101'} colorRight={'#a50000'} />
      <Head 
        title="Bulletin | Ingo"
        description="Official BSCS program bulletins, announcements, and important updates from the Computer Science department."
        url="/bulletin"
      />

      <motion.main
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-36 z-10"
      >
        <div className="flex flex-col gap-2 justify-center mt-16">
          <p className="text-4xl font-semibold">Bulletin</p>
          <p className="text-lg font-semibold">
            See what professors are up to in the BSCS Program
          </p>
        </div>

        <div className="flex flex-col gap-2 justify-center my-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bulletinList.map((bulletin, index) => (
              <div key={index}>
                <BulletinCard bulletin={bulletin} />
              </div>
            ))}
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default Bulletin;
