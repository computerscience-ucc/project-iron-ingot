import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';
import { PrefetcherWrapper } from '../components/Prefetcher';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Blog | Ingo</title>
      </Head>

      <PrefetcherWrapper>
        <Navbar />
        <main className="flex flex-col items-center px-5 md:px-0 min-h-screen relative mb-16">
          <div className=" w-full max-w-3xl relative">
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
