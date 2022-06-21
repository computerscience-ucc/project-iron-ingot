import Card from '../components/Card';
import { useState } from 'react';
import { AnimateSharedLayout, motion } from 'framer-motion';
import { _Transition_Page } from '../components/_Animations';
import Head from 'next/head';

const Home = (e) => {
  return (
    <>
      <Head>
        <title>Home | Ingo</title>
      </Head>
      <motion.section
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-36"
      >
        {/* landing */}
        <div className="flex flex-col gap-2 justify-center mt-16">
          <p className="text-6xl font-semibold">Ingo</p>
          <p className="text-lg font-semibold text-accent">
            Your CS Information Board on the Go
          </p>
          <div className="btn btn-primary w-fit px-10 mt-16">
            See what&apos;s new on the board
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default Home;
