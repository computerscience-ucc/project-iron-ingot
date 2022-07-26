import {
  AiOutlineArrowDown,
  AiOutlineEye,
  AiOutlineInfoCircle,
  AiOutlineLink,
} from 'react-icons/ai';
import { useEffect, useState } from 'react';

import BlobBackgound from '../components/BlobBackground';
import BlogCard from '../components/card/Blog';
import BulletinCard from '../components/card/Bulletin';
import Head from 'next/head';
import Link from 'next/link';
import ThesisCard from '../components/card/Thesis';
import { _Transition_Page } from '../components/_Animations';
import { motion } from 'framer-motion';
import { usePrefetcer } from '../components/Prefetcher';

const Home = (e) => {
  const { blogs, bulletins, thesis } = usePrefetcer();

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    console.log();

    window.addEventListener('scroll', (e) => {
      if (window.scrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      return (e) => {
        window.removeEventListener('scroll', e);
      };
    });
  }, []);

  return (
    <>
      <Head>
        <title>Home | Ingo</title>
      </Head>

      {/* blob background */}
      <BlobBackgound />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        exit={{ opacity: 0 }}
        style={{
          background:
            'radial-gradient(circle, #1EAC75 0%,rgba(0,0,0,0) 60%, rgba(0,0,0,0) 100%)',
        }}
        className="absolute w-[800px] h-[800px] top-[100px] -left-[40vw] z-0 opacity-25"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        exit={{ opacity: 0 }}
        style={{
          background:
            'radial-gradient(circle, #7A1EAC 0%,rgba(0,0,0,0) 60%, rgba(0,0,0,0) 100%)',
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
                duration: 10,
                ease: 'linear',
                loop: Infinity,
              }}
              style={{
                backgroundSize: '1000px 1000px',

                backgroundColor: 'rgb(6, 182, 212)',
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
            See and learn what is happening in the CS Department
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
                loop: Infinity,
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
              <figure className="md:mb-4 text-yellow-600">
                <AiOutlineInfoCircle size={40} />
              </figure>
              <p className="text-xl text-left">
                Online Public Information Board
              </p>
              <p className="opacity-50">
                See what is happening in the CS department and learn more about
                the people who are working there
              </p>
            </div>
            <div className="flex flex-col items-start">
              <figure className="md:mb-4 text-yellow-600">
                <AiOutlineEye size={40} />
              </figure>
              <p className="text-xl text-left">
                Showcase what the seniors are doing
              </p>
              <p className="opacity-50">
                See what the seniors are doing in the CS department and learn
                from them too while building their own Thesis project
              </p>
            </div>
            <div className="flex flex-col items-start">
              <figure className="md:mb-4 text-yellow-600">
                <AiOutlineLink size={40} />
              </figure>
              <p className="text-xl text-left">Connect with other students</p>
              <p className="opacity-50">
                Connect with other students in the CS department and get to know
                them better
              </p>
            </div>
          </div>
        </div>

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
    </>
  );
};

export default Home;
