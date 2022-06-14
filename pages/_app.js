import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center px-5 md:px-0 min-h-screen">
        <div className=" w-full max-w-2xl">
          <AnimatePresence exitBeforeEnter>
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default MyApp;
