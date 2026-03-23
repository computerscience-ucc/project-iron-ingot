import { AnimatePresence, motion } from "framer-motion";
import { CgChevronUp } from "react-icons/cg";
import { ArrowLeft } from "@geist-ui/icons";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { _Transition_Page } from "../../lib/animations";
import { client } from "../../lib/sanity";
import dayjs from "dayjs";
import urlBuilder from "@sanity/image-url";

const urlFor = (source) =>
  urlBuilder({
    projectId: "gjvp776o",
    dataset: "production",
  }).image(source);

const blockComponents = {
  types: {
    image: ({ value }) => (
      <div className="mx-auto w-[90%] my-[0.25rem]">
        <div className="overflow-hidden rounded-[8px]">
          <img
            src={urlFor(value.asset).url()}
            className="w-full h-auto"
            alt={value.alt || ""}
          />
        </div>
        {value.caption && (
          <p className="text-[0.875rem] text-[#8C8C8C] mt-[0.3rem] italic leading-tight text-center">
            {value.caption}
          </p>
        )}
      </div>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-[2rem] text-[#ffffff] font-semibold mt-[0.5rem] mb-[0.25rem] leading-tight">{children}</h1>,
    h2: ({ children }) => <h2 className="text-[1.5rem] text-[#ffffff] font-semibold mt-[0.5rem] mb-[0.25rem] leading-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="text-[1.25rem] text-[#ffffff] font-semibold mt-[0.5rem] mb-[0.25rem] leading-tight">{children}</h3>,
    h4: ({ children }) => <h4 className="text-[1.125rem] text-[#ffffff] font-semibold mt-[0.5rem] mb-[0.25rem] leading-tight">{children}</h4>,
    h5: ({ children }) => <h5 className="text-[1rem] text-[#ffffff] font-semibold mt-[0.5rem] mb-[0.25rem] leading-tight">{children}</h5>,
    h6: ({ children }) => <h6 className="text-[0.875rem] text-[#ffffff] font-semibold mt-[0.5rem] mb-[0.25rem] leading-tight">{children}</h6>,
    normal: ({ children }) => <p className="text-[1rem] text-[#8C8C8C] leading-relaxed mb-[0.25rem] font-normal">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#2F2F2F] pl-[1rem] my-[0.25rem] italic text-[#8C8C8C] leading-relaxed relative">
        {children}
      </blockquote>
    ),
    span: ({ children }) => <span className="font-normal">{children}</span>,
  },
  marks: {
    em: ({ children }) => (
      <em className="italic text-[#8C8C8C]">{children}</em>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),
    link: ({ children, value }) => (
      <a
        href={value.href}
        className="underline underline-offset-4 text-[#EFEFEF] hover:text-white transition-colors cursor-pointer"
        target="_blank"
        rel="noopener noreferrer"
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
    fallback: "blocking", // enable incremental static regeneration
  };
};

export const getStaticProps = async (context) => {
  const { slug } = context.params;
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

  useEffect(() => {
    setPost(bulletinPost);
  }, [bulletinPost]);

  // scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      // show scroll to top button if user has scrolled down by 20% to 80% of the page
      const h = mainDocument.current?.scrollHeight || 0;
      setScrollToTopButtonShown(
        window.scrollY > h * 0.2 && window.scrollY < h - 700
      );
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{post ? `${post.title} | Ingo` : "Bulletin"}</title>
      </Head>
      <motion.main
        ref={mainDocument}
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-[1100px] w-[90%] mx-auto pt-[4rem] pb-[12rem] z-10 min-h-screen relative flex justify-center"
      >
        {/* Content Column */}
        <div className="w-full max-w-[800px] relative">
          {/* Sticky Sidebar (Desktop) */}
          <div className="hidden lg:block absolute right-full top-0 h-full pr-[4rem] xl:pr-[6rem]">
            <div className="sticky top-[8rem]">
              <Link href="/bulletin" scroll={false}>
                <Button className="bg-[#242424] hover:bg-[#2F2F2F] text-[#8C8C8C] hover:text-[#EFEFEF] border-none h-[40px] px-4 rounded-[4px] font-sans font-medium text-[0.9375rem] transition-colors flex items-center gap-[0.6rem] whitespace-nowrap">
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </Button>
              </Link>
            </div>
          </div>
          {/* Back button (Mobile view) */}
          <div className="lg:hidden mb-[3.5rem] flex justify-end">
            <Link href="/bulletin" scroll={false}>
              <Button className="bg-[#242424] hover:bg-[#2F2F2F] text-[#8C8C8C] hover:text-[#EFEFEF] border-none h-[40px] px-4 rounded-[4px] font-sans font-medium text-[0.9375rem] transition-colors flex items-center gap-[0.6rem]">
                <ArrowLeft size={18} />
                <span>Back to Bulletin</span>
              </Button>
            </Link>
          </div>

          <h1 className="text-[2rem] text-[#ffffff] font-semibold tracking-normal leading-tight mb-[0.5rem]">
            {post?.title}
          </h1>

          <div className="flex items-center gap-2 text-[0.875rem] text-[#8C8C8C] mb-[1.5rem] font-normal">
            <span>
              {post?.authors
                ?.map((a) => `${a.fullName?.firstName || ""} ${a.fullName?.lastName || ""}`.trim())
                .join(", ") || "BSCS Council"}
            </span>
            {post?._updatedAt && (
              <>
                <span>•</span>
                <span>{dayjs(post._updatedAt).format("MMMM D, YYYY")}</span>
              </>
            )}
          </div>

          {/* Tags */}
          {post?.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-[0.5rem]">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.8rem] font-sans font-medium uppercase tracking-wide whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <hr className="border-[#2F2F2F] my-[1.5rem]" />

          {/* content */}
          <div className="flex flex-col gap-[1.5rem]">
            {post?.content && (
              <PortableText value={post.content} components={blockComponents} />
            )}
          </div>
        </div>
      </motion.main>

      {/* scroll to top button */}
      <AnimatePresence>
        {scrollToTopButtonShown && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: "circOut" } }}
            exit={{ opacity: 0, x: 10, transition: { duration: 0.3, ease: "circIn" } }}
            onClick={() => window.scroll({ top: 0, behavior: "smooth" })}
            className="fixed z-30 bottom-6 right-6 w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2F2F2F] hover:border-[#EA2B2E] flex items-center justify-center text-[#8C8C8C] hover:text-white transition-colors shadow-lg"
            aria-label="Scroll to top"
          >
            <CgChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default BulletinPage;
