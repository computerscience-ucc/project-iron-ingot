import { AnimatePresence, motion } from "framer-motion";
import {
  Breadcrumbs,
  Chip,
  IconButton,
  Tooltip
} from "@material-tailwind/react";
import { CgChevronLeft, CgChevronUp } from "react-icons/cg";
import { useEffect, useRef, useState } from "react";

import Head from "../../components/Head";
import TopGradient from "../../components/TopGradient";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { _Transition_Page } from "../../lib/animations";
import { client, urlFor } from "../../lib/sanity";
import dayjs from "dayjs";
import { AWARDS_DETAIL_QUERY } from "../../lib/groq/awards";

const blockComponents = {
  types: {
    image: ({ value }) => (
      <div className="relative w-full h-[300px]">
        <Image
          className="w-full h-full"
          src={urlFor(value.asset).url()}
          fill
          style={{ objectFit: "contain" }}
          sizes="100vw"
          alt={value.alt}
        />
      </div>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-bold">{children}</h4>,
    h5: ({ children }) => <h5 className="text-lg font-bold">{children}</h5>,
    h6: ({ children }) => <h6 className="text-md font-bold">{children}</h6>,
    p: ({ children }) => <p className="">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="text-base p-10 relative">
        <span className="absolute text-white text-6xl left-2 top-2">&ldquo;</span>
        {children}
      </blockquote>
    ),
    span: ({ children }) => <span className="text-light">{children}</span>,
  },
  marks: {
    em: ({ children }) => <em className="text-header-color font-bold">{children}</em>,
    link: ({ children, value }) => (
      <a href={value.href} className="underline underline-offset-4 cursor-pointer text-blue-400">
        {children}
      </a>
    ),
  },
};

export const getServerSideProps = async (context) => {
  try {
    const { slug } = context.params;
    const awardPost = await client.fetch(AWARDS_DETAIL_QUERY, { slug });
    if (!awardPost) return { notFound: true };
    return { props: { awardPost } };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { notFound: true };
  }
};

const AwardPage = ({ awardPost }) => {
  const [scrollToTopButtonShown, setScrollToTopButtonShown] = useState(false);
  const mainDocument = useRef(null);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return null;
      const date = dayjs(dateString);
      return date.isValid() ? date.format("MMMM DD, YYYY") : null;
    } catch {
      return null;
    }
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollToTopButtonShown(
        window.scrollY > mainDocument.current?.scrollHeight * 0.2 &&
          window.scrollY < mainDocument.current?.scrollHeight - 700
      );
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!awardPost) return null;

  const { title, headerImage, content, category, recipients, tags, dateAwarded, description, slug } = awardPost;
  const displayDate = formatDate(dateAwarded);

  return (
    <>
      <Head
        title={`${title || "Award"} | Ingo`}
        description={description || `Award details for ${title || "BSCS recognition"}`}
        url={`/awards/${slug}`}
      />
      <motion.main
        {..._Transition_Page}
        className="min-h-screen py-36 text-white relative"
        ref={mainDocument}
      >
        <TopGradient colorLeft={"#fd0101"} colorRight={"#a50000"} />

        <div className="container mx-auto px-5">
          <div className="flex flex-col gap-7">
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-7 lg:items-center lg:justify-between">
              {displayDate && <p className="text-white/80">{displayDate}</p>}
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 5).map((tag, index) => (
                    <Chip key={index} className="bg-[#010409] text-white border-white/20" value={tag} />
                  ))}
                  {tags.length > 5 && <span className="text-white/60 text-sm px-2 py-1">+{tags.length - 5} more</span>}
                </div>
              )}
            </div>

            <Link href="/awards" scroll={false}>
              <h1 className="text-2xl md:text-3xl lg:text-6xl font-bold flex flex-col md:flex-row gap-2 cursor-pointer transition hover:-translate-x-3">
                <span className="flex items-center"><CgChevronLeft size={30} /></span>
                <span>{title}</span>
              </h1>
            </Link>

            <div className="hidden md:block">
              <Breadcrumbs className="bg-transparent px-0">
                <Link href="/" className="text-white/60 hover:text-white transition font-bold">Home</Link>
                <Link href="/awards" className="text-white/60 hover:text-white transition font-bold">Awards</Link>
                <a className="text-white/60 hover:text-white transition font-bold">{title}</a>
              </Breadcrumbs>
            </div>

            <div className="flex flex-col gap-2">
              {category && <p className="text-white/80"><span className="text-white">Category:</span> {category}</p>}
              {description && <p className="text-white/80 text-lg max-w-3xl">{description}</p>}
            </div>
          </div>
        </div>

        {headerImage && (
          <div className="w-full h-[50vh] relative mt-10">
            <div className="w-full h-full bg-cover bg-center rounded-lg mx-5" style={{ backgroundImage: `url(${headerImage})` }} />
          </div>
        )}

        <div className="container mx-auto px-5 py-10">
          <div className="w-full max-w-4xl mx-auto">
            {recipients && recipients.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-5">Recipients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recipients.slice(0, 9).map((recipient, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                      {recipient?.recipientPhoto && (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                          <Image
                            src={recipient.recipientPhoto}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="48px"
                            alt={`${recipient.fullName} photo`}
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-semibold truncate">{recipient.fullName}</h4>
                        <p className="text-sm text-white/60 truncate">
                          {[recipient.yearLevel, recipient.batchYear ? `Batch ${recipient.batchYear}` : ""].filter(Boolean).join(" - ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {recipients.length > 9 && (
                  <p className="text-white/60 text-sm mt-4 text-center">And {recipients.length - 9} more recipients...</p>
                )}
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              {content ? (
                <PortableText value={content} components={blockComponents} />
              ) : (
                <div className="text-center py-10 text-white/60"><p>Content not available for this award.</p></div>
              )}
            </div>
          </div>
        </div>

        <Link href="/awards" className="fixed z-30 top-5 left-5 md:top-10 md:left-10">
          <Tooltip content="Back to Awards" placement="right">
            <IconButton className="bg-grey-800"><CgChevronLeft size={25} /></IconButton>
          </Tooltip>
        </Link>

        <AnimatePresence>
          {scrollToTopButtonShown && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: "circOut" } }}
              exit={{ opacity: 0, x: 10, transition: { duration: 0.3, ease: "circIn" } }}
              className="fixed z-30 bottom-5 right-5 md:bottom-10 md:right-10"
              onClick={() => window.scroll({ top: 0, behavior: "smooth" })}
            >
              <Tooltip content="Scroll to top" placement="left">
                <IconButton className="bg-grey-800"><CgChevronUp size={25} /></IconButton>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </>
  );
};

export default AwardPage;
