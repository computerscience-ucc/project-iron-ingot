import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { PrefetcherWrapper } from '../components/Prefetcher';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Blog | Ingo</title>
      </Head>

      <Navbar />
      <PrefetcherWrapper>
        <main className="flex flex-col items-center px-5 md:px-0 min-h-screen">
          <div className=" w-full max-w-2xl">
            <AnimatePresence exitBeforeEnter>
              <Component {...pageProps} key={router.route} />
            </AnimatePresence>
          </div>
        </main>
      </PrefetcherWrapper>
      <Footer />
    </>
  );
}

export default MyApp;
