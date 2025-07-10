import { useEffect, useState } from 'react';

import BlogCard from '../../components/card/Blog';
import Card from '../../components/card/Blog';
import CardSkeleton from '../../components/CardSkeleton';
import Head from 'next/head';
import TopGradient from '../../components/TopGradient';
import { _Transition_Page } from '../../components/_Animations';
import { motion } from 'framer-motion';
import { usePrefetcer } from '../../components/Prefetcher';

const BlogPage = (e) => {
  const { blogs } = usePrefetcer();
  const [blogList, setBlogList] = useState([]);

  useEffect(() => {
    setBlogList(blogs);
  }, [blogs]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <TopGradient colorLeft={'#fd0101'} colorRight={'#a50000'} />

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
          <p className="text-4xl font-semibold">Blog</p>
          <p className="text-lg font-semibold">
            See what CS students are up to in the BSCS Program
          </p>
        </div>

        <div className="flex flex-col gap-2 justify-center my-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {blogList.map((blog, index) => (
              <div key={index}>
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default BlogPage;
