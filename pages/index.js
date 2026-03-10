import {
  AiOutlineArrowDown,
  AiOutlineEye,
  AiOutlineInfoCircle,
  AiOutlineLink,
  AiOutlineArrowUp,
} from 'react-icons/ai';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import { useCallback, useEffect, useRef, useState } from 'react';

import BlobBackground from '../components/BlobBackground';
import BlogCard from '../components/card/Blog';
import BulletinCard from '../components/card/Bulletin';
import Head from '../components/Head';
import Link from 'next/link';
import ThesisCard from '../components/card/Thesis';
import { _Transition_Page } from '../components/_Animations';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrefetcher } from '../components/Prefetcher';

// ─── Awards Carousel ──────────────────────────────────────────────────────────
const AwardsCarousel = ({ awards }) => {
  const items = awards?.filter((a) => a.headerImage) || [];
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const go = useCallback((d) => {
    if (items.length < 2) return;
    setDir(d);
    setIdx((i) => (i + d + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length < 2) return;
    timerRef.current = setInterval(() => go(1), 3500);
    return () => clearInterval(timerRef.current);
  }, [paused, items.length, go]);

  if (items.length === 0) return null;

  const current = items[idx];

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="flex flex-col gap-2 justify-center mb-32 mt-10">
      <div className="flex items-end justify-between mb-10">
        <p className="text-3xl font-semibold text-left md:text-center">
          Awards &amp; Achievements
        </p>
        <Link href="/awards">
          <a className="text-sm text-red-400 hover:text-red-300 transition hidden md:block">
            View all →
          </a>
        </Link>
      </div>

      <div
        className="relative w-full rounded-2xl overflow-hidden bg-[#0e1015] border border-white/5 shadow-xl"
        style={{ height: '480px' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              src={current.headerImage}
              alt={current.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {current.academicYear && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-600/80 text-white font-semibold">
                    {current.academicYear}
                  </span>
                )}
                {current.category && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300">
                    {current.category}
                  </span>
                )}
              </div>
              <p className="text-xl md:text-2xl font-bold text-white leading-snug">{current.title}</p>
              {current.description && (
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{current.description}</p>
              )}
              <Link href="/awards">
                <a className="inline-block mt-3 text-xs text-red-400 hover:text-red-300 transition font-semibold">
                  See all awards →
                </a>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next */}
        {items.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition"
              aria-label="Previous"
            >
              <CgChevronLeft size={22} />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition"
              aria-label="Next"
            >
              <CgChevronRight size={22} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {items.length > 1 && (
          <div className="absolute top-4 right-4 z-10 flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? 'bg-white w-5' : 'bg-white/30 w-1.5 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        <span className="absolute top-4 left-4 z-10 text-[11px] px-2 py-0.5 rounded-full bg-black/60 text-gray-300">
          {idx + 1} / {items.length}
        </span>
      </div>
    </div>
  );
};

const Home = () => {
  const { blogs, bulletins, thesis, awards } = usePrefetcher();

  const [isVisible, setIsVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head 
        title="Home | Ingo"
        description="Your CS Information Board on the Go. Stay updated with BSCS program news, blogs, bulletins, and thesis projects."
        url="/"
      />

      {/* blob background */}
      <BlobBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        style={{
          background:
            'radial-gradient(circle, #731010 0%,rgba(0,0,0,0) 60%, rgba(0,0,0,0) 100%)',
        }}
        className="absolute w-[800px] h-[800px] top-[100px] -left-[40vw] z-0 opacity-25"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        style={{
          background:
            'radial-gradient(circle, #a80000 0%,rgba(0,0,0,0) 60%, rgba(0,0,0,0) 100%)',
        }}
        className="absolute w-[800px] h-[800px] -top-[200px] left-[40vw] z-0 opacity-25"
      />

      <motion.section
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative"
      >
        {/* landing */}
        <div className="flex flex-col gap-2 justify-center pt-16 text-center min-h-screen relative">
          <p className="text-6xl font-bold mb-2 text-transparent">
            <motion.span
              animate={{
                backgroundPosition: [
                  '0% 0%',
                  '100% 0%',
                  '100% 100%',
                  '0% 100%',
                  '0% 0%',
                ],
              }}
              transition={{
                duration: 5,
                ease: 'linear',
                repeat: Infinity,
              }}
              style={{
                backgroundSize: '1000px 1000px',

                //backgroundColor: 'rgb(6, 182, 212)',
                backgroundColor: 'rgb(212, 6, 100)',
                backgroundImage:
                  'radial-gradient(at 0% 100%, rgb(244, 63, 94) 0, transparent 50%), radial-gradient(at 90% 0%, rgb(16, 185, 129) 0, transparent 50%), radial-gradient(at 100% 100%, rgb(217, 70, 239) 0, transparent 50%), radial-gradient(at 0% 0%, rgb(249, 115, 22) 0, transparent 58%)',
              }}
              className="bg-clip-text bg-transparent"
            >
              ingo
            </motion.span>
          </p>
          <p className="text-lg font-semibold text-gray-500">
            Your CS <span className="text-pink-600 font-bold">In</span>formation
            Board on the <span className="text-pink-600 font-bold">Go</span>
          </p>
          <p className="text-lg font-semibold text-gray-500">
            See and learn what is happening in the BSCS Program
          </p>

          <Link href={'/bulletin'}>
            <motion.div
              animate={{
                backgroundPosition: [
                  '0% 0%',
                  '100% 0%',
                  '100% 100%',
                  '0% 100%',
                  '0% 0%',
                ],
              }}
              transition={{
                duration: 5,
                ease: 'linear',
                repeat: Infinity,
              }}
              style={{
                backgroundSize: '1000px 1000px',
                backgroundColor: 'rgb(6, 182, 212)',
                backgroundImage:
                  'radial-gradient(at 17% 56%, rgb(244, 63, 94) 0, transparent 92%), radial-gradient(at 73% 7%, rgb(251, 146, 60) 0, transparent 45%), radial-gradient(at 73% 93%, rgb(185, 28, 28) 0, transparent 77%)',
              }}
              className="hover:scale-110 duration-200 text-primary-content w-fit px-10 py-3 rounded-lg cursor-pointer mt-16 self-center border-0"
            >
              See what&apos;s new on the board
            </motion.div>
          </Link>

          {/* arrow down */}
          <motion.div
            className="self-center absolute bottom-7"
            animate={{
              opacity: isVisible ? 1 : 0,
            }}
          >
            <motion.div
              animate={{
                opacity: [0, 1, 0],
                translateY: [0, 10, 10],
                transition: {
                  duration: 1,
                  ease: 'easeInOut',
                  repeat: Infinity,
                },
              }}
              className="self-center mt-16"
            >
              <AiOutlineArrowDown size={30} />
            </motion.div>
          </motion.div>
        </div>

        {/* offers */}
        <div className="flex flex-col gap-2 justify-center mb-64 mt-10">
          <p className="text-3xl font-semibold mb-10 text-left md:text-center">
            See what Ingo has to offer
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col items-start">
              <figure className="md:mb-4 text-red-600">
                <AiOutlineInfoCircle size={40} />
              </figure>
              <p className="text-xl text-left">
                Online Public Information Board
              </p>
              <p className="opacity-50">
                See what is happening in the BSCS Program and learn more about
                the people who are working there
              </p>
            </div>
            <div className="flex flex-col items-start">
              <figure className="md:mb-4 text-red-600">
                <AiOutlineEye size={40} />
              </figure>
              <p className="text-xl text-left">
                Showcase what the seniors are doing
              </p>
              <p className="opacity-50">
                See what the seniors are doing in the BSCS Program and learn
                from them too while building their own Thesis project
              </p>
            </div>
            <div className="flex flex-col items-start">
              <figure className="md:mb-4 text-red-600">
                <AiOutlineLink size={40} />
              </figure>
              <p className="text-xl text-left">Connect with other students</p>
              <p className="opacity-50">
                Connect with other students in the BSCS Program and get to know
                them better
              </p>
            </div>
          </div>
        </div>

        {/* awards carousel */}
        <AwardsCarousel awards={awards} />

        {/* latest blog */}
        <div className="flex flex-col gap-2 justify-center mb-32 mt-10">
          <p className="text-3xl font-semibold mb-10 text-left md:text-center">
            Latest blog posts
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* display the 2 latest blog post */}
            {blogs &&
              blogs
                .slice(0, 2)
                .map((blog, i) => <BlogCard blog={blog} key={i} />)}
          </div>
        </div>

        {/* latest bulletin */}
        <div className="flex flex-col gap-2 justify-center mb-32 mt-10">
          <p className="text-3xl font-semibold mb-10 text-left md:text-center">
            Latest bulletin posts
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* display the 2 latest blog post */}
            {bulletins &&
              bulletins
                .slice(0, 2)
                .map((blog, i) => <BulletinCard bulletin={blog} key={i} />)}
          </div>
        </div>

        {/* latest thesis */}
        <div className="flex flex-col gap-2 justify-center mb-64 mt-10">
          <p className="text-3xl font-semibold mb-10 text-left md:text-center">
            Latest thesis projects
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* display the 2 latest blog post */}
            {thesis &&
              thesis
                .slice(0, 2)
                .map((blog, i) => <ThesisCard thesis={blog} key={i} />)}
          </div>
        </div>
      </motion.section>

      {/* Scroll-to-top FAB — bottom left */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed z-30 bottom-6 left-6 w-10 h-10 rounded-full bg-[#1a1d24] border border-white/10 hover:border-red-500/50 flex items-center justify-center text-gray-400 hover:text-white transition shadow-lg"
            aria-label="Scroll to top"
          >
            <AiOutlineArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;
