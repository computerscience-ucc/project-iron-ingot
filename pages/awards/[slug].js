import { AnimatePresence, motion } from 'framer-motion';
import {
  Breadcrumbs,
  Chip,
  IconButton,
  Tooltip,
} from '@material-tailwind/react';
import { CgChevronLeft, CgChevronUp } from 'react-icons/cg';
import { useEffect, useRef, useState } from 'react';
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa6";

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { _Transition_Page } from '../../components/_Animations';
import { client } from '../../components/Prefetcher';
import dayjs from 'dayjs';
import urlBuilder from '@sanity/image-url';
import AwardsCarousel from '../../components/AwardsCarousel'

//Hardcoded sample images
import img1 from '../.././public/awardsSampleImages/img1.jpg';
import img2 from '../.././public/awardsSampleImages/img2.jpg';
import img3 from '../.././public/awardsSampleImages/img3.jpg';
import img4 from '../.././public/awardsSampleImages/img4.jpg';
import img5 from '../.././public/awardsSampleImages/img5.jpg';
import img6 from '../.././public/awardsSampleImages/img6.jpg';

//Sample images for gallery carousel
const images = [img1, img2, img3, img4, img5, img6];

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
          alt={value.alt}
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
      <em className="text-header-color  font-bold">{children}</em>
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
  const thesisPosts = await client.fetch(
    `*[_type == "thesis"]{  
      "slug": slug.current,
    }`
  );
  const paths = thesisPosts.map((post) => ({
    params: { slug: post.slug },
  }));
  return {
    paths,
    fallback: 'blocking', // enable incremental static regeneration
  };
};

export const getStaticProps = async (e) => {
  const { slug } = e.params;
  const thesisPost = await client.fetch(
    `*[_type == "thesis" && slug.current == "${slug}"]{
      _id,
      _createdAt,
      _updatedAt,
      _type,
      "title": thesisTitle,
      "headerImage": headerImage.asset -> url,
      "slug": slug.current,
      "content": thesisContent,
      "authors": postAuthor[] -> {fullName, pronouns, "authorPhoto": authorPhoto.asset -> url, yearLevel, batchYear},
      tags,
      "owners": ownersInformation
    }`
  );
  return {
    props: {
      thesisPost: thesisPost[0],
    },
    revalidate: 10,
  };
};

const ThesisPage = ({ thesisPost }) => {
  const [post, setPost] = useState(thesisPost);
  const mainDocument = useRef(null);
  const [scrollToTopButtonShown, setScrollToTopButtonShown] = useState(false);

  useEffect(
    (e) => {
      setPost(thesisPost);
    },
    [thesisPost]
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
        <title>{post ? `${post.title} | Ingo` : 'thesis'}</title>
      </Head>

      <motion.main
        ref={mainDocument}
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen py-36"
      >
        {/* header image background */}
        {/* title */}
        <div className="flex flex-col gap-5">
          <div className="hidden md:block">
            <Breadcrumbs className="bg-transparent px-0 ">
              <Link href="/">
                <a className="text-grey-600 hover:text-header-color transition font-bold">
                  Home
                </a>
              </Link>
              <Link href="/awards">
                <a className="text-grey-600 hover:text-header-color transition font-bold">
                  Awards
                </a>
              </Link>
              <a className="text-grey-600 hover:text-header-color transition font-bold">
                {post.title}
              </a>
            </Breadcrumbs>
          </div>
          <Link href="/awards" scroll={false}>
            <p className="text-3xl md:text-4xl lg:text-6xl font-bold flex flex-col md:flex-row gap-2 cursor-pointer transition hover:-translate-x-3">
              <>
                <span className="flex items-center">
                  <CgChevronLeft size={30} />
                </span>
                <span>{post.title}</span>
              </>
            </p>
          </Link>
          <div className="flex lg:flex-row gap-3 lg:gap-7 lg:items-center lg:justify-between">
            <p>Posted on: {dayjs(post._updatedAt).format('MMMM D, YYYY')}</p>
          </div>
          <div className="flex text-mds items-center gap-2">
              <p>Share Via: </p>
              <FaFacebook className="text-white hover:text-header-color hover:cursor-pointer " />
              <FaLinkedin className="text-white hover:text-header-color hover:cursor-pointer "/>
              <FaSquareXTwitter className="text-white hover:text-header-color hover:cursor-pointer "/>
          </div>
            
          {post.headerImage && (
            <div className="relative w-full max-w-2xl h-[200px] lg:h-[300px] -z-50 overflow-hidden mx-auto rounded-xl mb-16">
              <Image
                src={post?.headerImage}
                className="w-full h-full object-cover"
                layout="fill"
                alt = "header"
              />
            </div>
          )}
        </div>

        {/* content */}
        <div className='flex flex-col mb-10'>
          <p className='text-2xl font-extrabold mb-4'>Award Details</p>
          <div>
          {/* Sample Content (Hardcoded) */}
            <div className=" flex gap-3 mb-5">
              <p > Awarded On: </p>
              <p>August 29, 2025</p>
            </div>
            <div className=" flex gap-3 mb-5">
              <p > Awarded By: </p>
              <p>Ingo Innovation council</p>
            </div>
            <div className=" flex gap-3 mb-5">
              <p > Presented At: </p>
              <p>ITechtivity</p>
            </div>
            
          </div>
            <div className=" flex  gap-3 mb-5 text-justify">
              <p>Description: </p>
              <div className='flex flex-col gap-3'>
                <PortableText value={post.content} components={blockComponents} />
                <div>
                  <button className='flex gap-5 items-center border border-white rounded-md p-2 hover:bg-header-color hover:border-header-color active:bg-red-900 hover:text-black'>
                    <FaDownload/>
                    <p>Download Certificate</p>
                  </button>
                </div>
                </div>
            </div>
        </div>
        
         
        <div className='flex flex-col mb-10'>
          <p className='text-2xl font-extrabold mb-4'>Recipients Information</p>
          {/* Sample Content (Hardcoded) */}
          <div className=" flex gap-3 mb-3">
              <p > Recipient/s: </p>
              <p>Angela Santos</p>
          </div>
          <div className=" flex gap-3 mb-3">
              <p > Role:</p>
              <p>Innovator</p>
          </div>
          <div className=" flex gap-3 mb-3">
              <p > Organization:</p>
              <p>CyKlas Organization</p>
          </div>
          <div className=" flex gap-3 mb-3">
              <p > Recognition:</p>
              <p>Awarded for outstanding contributions 
             in advancing web-based e-learning.</p>
          </div>
        </div>

        <div className='flex flex-col mb-10'>
          <p className='text-2xl font-extrabold mb-4'>Image Gallery</p>
          <div>
            <AwardsCarousel className='mx-auto' images = {images}/>
          </div>
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

export default ThesisPage;
