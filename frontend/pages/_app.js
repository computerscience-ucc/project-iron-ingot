import '../styles/globals.css';

import { AnimatePresence, motion } from 'framer-motion';

import Footer from '../components/Footer';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { PrefetcherWrapper } from '../components/Prefetcher';
import { ThemeProvider } from '@material-tailwind/react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <link rel="icon" href="/logo.svg" />
      </Head>

      <ThemeProvider>
        <PrefetcherWrapper>
          <>
            <div className="text-blue-grey-100 relative">
              <Navbar />
              <main className="min-h-screen flex justify-center overflow-x-hidden relative">
                <motion.div className="w-full relative max-w-4xl px-5 lg:px-0 ">
                  <AnimatePresence exitBeforeEnter>
                    <Component {...pageProps} key={router.route} />
                  </AnimatePresence>
                </motion.div>
              </main>
              <Footer />
            </div>
          </>
        </PrefetcherWrapper>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
