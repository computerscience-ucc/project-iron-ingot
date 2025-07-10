import { AnimatePresence, motion } from 'framer-motion';
import {
  Breadcrumbs,
  Chip,
  IconButton,
  Tooltip,
} from '@material-tailwind/react';
import { CgChevronLeft, CgChevronUp } from 'react-icons/cg';
import { useEffect, useRef, useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { _Transition_Page } from '../../components/_Animations';
import { client } from '../../components/Prefetcher';
import dayjs from 'dayjs';
import urlBuilder from '@sanity/image-url';

const urlFor = (source) =>
  urlBuilder({
    projectId: 'gjvp776o',
    dataset: 'production',
  }).image(source);

const blockComponents = {
  types: {
    image: ({ value }) => (
      <div className="relative w-full h-[300px]">
        <Image
          className="w-full h-full"
          src={urlFor(value.asset).url()}
          layout="fill"
          objectFit="contain"
          alt= {value.alt}
        />
      </div>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bo ld">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-bold">{children}</h4>,
    h5: ({ children }) => <h5 className="text-lg font-bold">{children}</h5>,
    h6: ({ children }) => <h6 className="text-md font-bold">{children}</h6>,
    p: ({ children }) => <p className="">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="text-base p-10 relative ">
        <span className="absolute text-white text-6xl left-2 top-2">
          &ldquo;
        </span>
        {children}
      </blockquote>
    ),
    span: ({ children }) => <span className="text-light">{children}</span>,
    image: ({ node }) => (
      <Image src={urlFor(node.asset)} alt={node.alt} className="w-full" layout = "fill" />
    ),
  },
  marks: {
    em: ({ children }) => (
      <em className="text-header-color-400  font-bold">{children}</em>
    ),
    link: ({ children, value }) => (
      <a
        href={value.href}
        className="underline underline-offset-4 cursor-pointer text-blue-400"
      >
        {children}
      </a>
    ),
  },
};

export const getStaticPaths = async () => {
  const bulletinPosts = await client.fetch(
    `*[_type == "bulletin"]{  
      "slug": slug.current,
    }`
  );
  const paths = bulletinPosts.map((post) => ({
    params: { slug: post.slug },
  }));
  return {
    paths,
    fallback: 'blocking', // enable incremental static regeneration
  };
};

export const getStaticProps = async (e) => {
  const { slug } = e.params;
  const bulletinPost = await client.fetch(
    `*[_type == "bulletin" && slug.current == "${slug}"]{
      _id,
      _createdAt,
      _updatedAt,
      "title": bulletinTitle,
      "slug": slug.current,
      "content": bulletinContent,
      "authors": bulletinAuthor[] -> {fullName, pronouns, "authorPhoto": authorPhoto.asset -> url, yearLevel, batchYear},
      tags
    }`
  );
  return {
    props: {
      bulletinPost: bulletinPost[0],
    },
    revalidate: 10,
  };
};

const BulletinPage = ({ bulletinPost }) => {
  const [post, setPost] = useState(bulletinPost);
  const mainDocument = useRef(null);
  const [scrollToTopButtonShown, setScrollToTopButtonShown] = useState(false);

  useEffect(
    (e) => {
      setPost(bulletinPost);
    },
    [bulletinPost]
  );

  // scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // listen for scroll events
  useEffect(() => {
    window.addEventListener('scroll', (e) => {
      // show scroll to top button if user has scrolled down by 20% to 80% of the page
      setScrollToTopButtonShown(
        window.scrollY > mainDocument.current?.scrollHeight * 0.2 &&
          window.scrollY < mainDocument.current?.scrollHeight - 700
      );
    });

    return () => {
      window.removeEventListener('scroll', () => {});
    };
  }, []);

  return (
    <>
      <Head>
        <title>{post ? `${post.title} | Ingo` : 'Bulletin'}</title>
      </Head>

      <motion.main
        ref={mainDocument}
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen py-36"
      >
        {/* title */}
        <div className="flex flex-col gap-7">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-7 lg:items-center lg:justify-between">
            <p>{dayjs(post._updatedAt).format('MMMM D, YYYY')}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <Chip className="bg-[#010409]" key={i} value={tag} />
              ))}
            </div>
          </div>
          <Link href="/bulletin" scroll={false}>
            <p className="text-3xl md:text-4xl lg:text-6xl font-bold flex flex-col md:flex-row gap-2 cursor-pointer transition hover:-translate-x-3">
              <>
                <span className="flex items-center">
                  <CgChevronLeft size={30} />
                </span>
                <span>{post.title}</span>
              </>
            </p>
          </Link>
          <div className="hidden md:block">
            <Breadcrumbs className="bg-transparent px-0 ">
              <Link href="/">
                <a className="text-grey-600 hover:text-header-color transition font-bold">
                  Home
                </a>
              </Link>
              <Link href="/bulletin">
                <a className="text-grey-600 hover:text-header-color transition font-bold">
                  Bulletin
                </a>
              </Link>
              <a className="text-grey-600 hover:text-header-color transition font-bold">
                {post.title}
              </a>
            </Breadcrumbs>
          </div>
          <p className="flex flex-col">
            Posted by:{' '}
            {post.authors &&
              post.authors.map((author, i) => (
                <p key={i} className="text-header-color transition font-bold">
                  {author.fullName.firstName} {author.fullName.lastName} (
                  {author.pronouns})
                  {author.batchYear && author.yearLevel && (
                    <span>
                      {' '}
                      / {author.batchYear} {author.yearLevel}
                    </span>
                  )}
                </p>
              ))}
          </p>
        </div>

        <hr className="mb-16 mt-5 opacity-50" />

        {/* content */}
        <div className=" flex flex-col gap-5">
          <PortableText value={post.content} components={blockComponents} />
        </div>

        {/* scroll to top button */}
        <AnimatePresence>
          {scrollToTopButtonShown && (
            <motion.div
              initial={{
                opacity: 0,
                x: 10,
              }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, ease: 'circOut' },
              }}
              exit={{
                opacity: 0,
                x: 10,
                transition: { duration: 0.3, ease: 'circIn' },
              }}
              className="fixed z-30 bottom-5 right-5 md:bottom-10 md:right-10"
              onClick={() => window.scroll({ top: 0, behavior: 'smooth' })}
            >
              <Tooltip content="Scroll to top" placement="left">
                <IconButton className="bg-grey-800">
                  <CgChevronUp size={25} />
                </IconButton>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </>
  );
};

export default BulletinPage;
