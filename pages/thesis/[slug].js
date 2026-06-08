import { AnimatePresence, motion } from "framer-motion";
import { CgChevronUp } from "react-icons/cg";
import { ArrowLeft } from "@geist-ui/icons";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import Head from "@/components/Head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { PortableText } from "@portabletext/react";
import { _Transition_Page } from "../../lib/animations";
import { client } from "../../lib/sanity";
import dayjs from "dayjs";
import { urlFor } from "../../lib/sanity";
import MaterialsList from "../../components/Thesis/MaterialsList";
import HeroCarousel from "../../components/Thesis/HeroCarousel";
import MemberStrip from "../../components/Thesis/MemberStrip";
import RightPanel from "../../components/Thesis/RightPanel";

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|[?&]v=)([^&?/\s]{11})/);
  return m ? m[1] : null;
}

const blockComponents = {
  types: {
    image: ({ value }) => (
      <div className="mx-auto w-[90%] my-[0.25rem]">
        <div className="overflow-hidden rounded-[8px]">
          <Image
            src={urlFor(value.asset).url()}
            width={800}
            height={500}
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
    normal: ({ children }) => <p className="text-[1rem] text-[#8C8C8C] leading-relaxed mb-[1rem] last:mb-0 font-normal">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#2F2F2F] pl-[1rem] my-[0.25rem] italic text-[#8C8C8C] leading-relaxed">{children}</blockquote>
    ),
  },
  marks: {
    em: ({ children }) => <em className="italic text-[#8C8C8C]">{children}</em>,
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    link: ({ children, value }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer"
        className="underline underline-offset-4 text-[#EFEFEF] hover:text-white transition-colors">
        {children}
      </a>
    ),
  },
};

const DEPT_LABEL = {
  CS: "Computer Science",
  IT: "Information Technology",
  IS: "Information Systems",
  EMC: "Entertainment & Multimedia Computing",
  Other: "General / Other",
};

export const getStaticPaths = async () => {
  const posts = await client.fetch("*[_type == \"thesis\"]{ \"slug\": slug.current }");
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const post = await client.fetch(
    `*[_type == "thesis" && slug.current == $slug]{
      _id, _createdAt, _type,
      "title": thesisTitle,
      "slug": slug.current,
      "headerImage": headerImage.asset->url,
      "images": thesisImages[].asset->url,
      "showcase": showcaseImages[].asset->url,
      "model3d": threeDModel.asset->url,
      youtubeLink,
      "authors": postAuthor[]->{
        fullName, pronouns,
        "authorPhoto": authorPhoto.asset->url,
        yearLevel, batchYear
      },
      "owners": ownersInformation,
      "members": thesisMembers[]{
        fullName, section, linkedIn, website,
        "photo": photo.asset->url
      },
      "materials": materials[]{ label, url, icon },
      academicYear, department, tags,
      "content": thesisContent,
      "description": pt::text(thesisContent)
    }[0]`,
    { slug }
  );
  if (!post) return { notFound: true };
  return { props: { post }, revalidate: 10 };
};

const ThesisPage = ({ post }) => {
  const mainRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(false);
  const [leftTab, setLeftTab] = useState("abstract");

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => {
      const h = mainRef.current?.scrollHeight || 0;
      setScrollTop(window.scrollY > h * 0.15 && window.scrollY < h - 700);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!post) return null;

  const youtubeId = getYouTubeId(post.youtubeLink);
  const hasCarousel = (post.images && post.images.length > 0) || !!youtubeId;
  const hasModel    = !!post.model3d;
  const hasShowcase  = !!(post.showcase && post.showcase.length > 0);
  const hasRightPanel = hasModel || hasShowcase;

  return (
    <>
      <Head
        title={`${post.title} | Ingo`}
        description={post.description || post.title}
        ogImage={post.headerImage}
        url={`/thesis/${post.slug}`}
      />
      {/* Load Google model-viewer script only when needed */}
      {hasModel && (
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          strategy="lazyOnload"
        />
      )}
      <motion.main
        ref={mainRef}
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-[1100px] w-[90%] mx-auto pt-[2rem] md:pt-[3rem] lg:pt-[4rem] pb-[6rem] md:pb-[8rem] lg:pb-[12rem] z-10 min-h-screen relative flex justify-center"
      >
        {/* Content Column */}
        <div className="w-full max-w-[800px] relative">
          {/* Sticky Sidebar (Desktop) */}
          <div className="hidden lg:block absolute right-full top-0 h-full pr-[4rem] xl:pr-[6rem]">
            <div className="sticky top-[8rem]">
              <Link href="/thesis" scroll={false}>
                <Button className="bg-[#242424] hover:bg-[#2F2F2F] text-[#8C8C8C] hover:text-[#EFEFEF] border-none h-[40px] px-4 rounded-[4px] font-sans font-medium text-[0.9375rem] transition-colors flex items-center gap-[0.6rem] whitespace-nowrap">
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </Button>
              </Link>
            </div>
          </div>
          {/* Back button (Mobile view) */}
          <div className="lg:hidden mb-[2rem] flex justify-end">
            <Link href="/thesis" scroll={false}>
              <Button className="bg-[#242424] hover:bg-[#2F2F2F] text-[#8C8C8C] hover:text-[#EFEFEF] border-none h-[40px] px-4 rounded-[4px] font-sans font-medium text-[0.9375rem] transition-colors flex items-center gap-[0.6rem]">
                <ArrowLeft size={18} />
                <span>Back to Thesis</span>
              </Button>
            </Link>
          </div>

          <h1 className="text-[1.25rem] md:text-[1.5rem] lg:text-[2rem] text-[#ffffff] font-semibold tracking-normal leading-tight mb-[0.5rem]">
            {post.title}
          </h1>

          <div className="flex items-center gap-2 text-[0.8rem] md:text-[0.875rem] text-[#8C8C8C] mb-[1rem] md:mb-[1.5rem] font-normal flex-wrap">
            <span>
              {post.authors
                ?.map((a) => `${a.fullName?.firstName || ""} ${a.fullName?.lastName || ""}`.trim())
                .join(", ") || "BSCS Council"}
            </span>
            <span>•</span>
            <span>{dayjs(post._createdAt).format("MMMM D, YYYY")}</span>
          </div>

          {/* ── Hero Carousel ── */}
          {hasCarousel && <HeroCarousel images={post.images || []} youtubeId={youtubeId} />}

          {/* ── Meta & Tags (Bottom of Project) ── */}
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mt-3 md:mt-4 mb-4 md:mb-6">
            {post.academicYear && (
              <span className="shrink-0 px-2.5 py-1 bg-[#F02E31] text-[#EFEFEF] text-[0.75rem] font-sans font-bold uppercase tracking-wider">
                {post.academicYear}
              </span>
            )}
            {post.department && (
              <span className="px-2.5 py-1 bg-[#333333] text-[#EFEFEF] text-[0.75rem] font-sans font-bold uppercase tracking-wider">
                {DEPT_LABEL[post.department] || post.department}
              </span>
            )}
            {post.tags && post.tags.length > 0 &&
            post.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-[#333333] text-[#EFEFEF] text-[0.7rem] font-sans font-bold uppercase tracking-wider whitespace-nowrap"
              >
                {tag}
              </span>
            ))
            }
          </div>

          {/* ── Member Strip (new thesisMembers field) ── */}
          {post.members && post.members.length > 0 && (
            <MemberStrip members={post.members} />
          )}

          {/* Fallback: legacy ownerFullname list */}
          {(!post.members || post.members.length === 0) && post.owners?.ownerFullname?.length > 0 && (
            <div className="mb-[2rem] pt-[0.5rem]">
              <p className="text-[0.8rem] md:text-[0.875rem] text-[#707070] font-medium mb-[0.4rem]">Thesis Authors</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {post.owners.ownerSection && (
                  <span className="text-[1rem] text-[#8C8C8C] font-normal">({post.owners.ownerSection})</span>
                )}
                <p className="text-[1rem] text-[#8C8C8C] font-normal leading-relaxed">
                  {post.owners.ownerFullname.join(", ")}
                </p>
              </div>
            </div>
          )}

          <hr className="border-[#2F2F2F] mb-[1.5rem] md:mb-[2.5rem]" />

          {/* ── Content Section ── */}
          <div className="flex flex-col gap-0">
            {/* Main content: Tabs + info */}
            <div className="flex flex-col gap-[1rem]">
              {/* Tab switcher */}
              <div className="flex items-center bg-[#202020] rounded-[6px] p-1 gap-1 h-fit w-fit relative mb-2">
                <button
                  onClick={() => setLeftTab("abstract")}
                  className={`relative px-3 md:px-5 py-1.5 rounded-[4px] text-[0.8rem] md:text-[0.875rem] transition-colors ${
                    leftTab === "abstract" ? "text-white" : "text-[#8C8C8C] hover:text-[#EFEFEF]"
                  }`}
                >
                  {leftTab === "abstract" && (
                    <motion.div
                      layoutId="activeThesisTab"
                      className="absolute inset-0 bg-[#333333] rounded-[4px] z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 font-medium">Abstract</span>
                </button>

                <button
                  onClick={() => setLeftTab("materials")}
                  className={`flex items-center gap-1.5 relative px-3 md:px-5 py-1.5 rounded-[4px] text-[0.8rem] md:text-[0.875rem] transition-colors ${
                    leftTab === "materials" ? "text-white" : "text-[#8C8C8C] hover:text-[#EFEFEF]"
                  }`}
                >
                  {leftTab === "materials" && (
                    <motion.div
                      layoutId="activeThesisTab"
                      className="absolute inset-0 bg-[#333333] rounded-[4px] z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 font-medium">Materials</span>
                </button>
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {leftTab === "abstract" && (
                  <motion.div
                    key="abstract"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="max-w-[1000px]"
                  >
                    {post.content ? (
                      <PortableText value={post.content} components={blockComponents} />
                    ) : (
                      <p className="text-[1rem] text-[#8C8C8C] leading-relaxed py-2 font-normal">No content available yet.</p>
                    )}
                  </motion.div>
                )}
                {leftTab === "materials" && (
                  <motion.div
                    key="materials"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="max-w-[1000px]"
                  >
                    <MaterialsList materials={post.materials} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RightPanel (now at the bottom): 3D model or image showcase */}
            {hasRightPanel && (
              <div className="w-full max-w-[1000px] -mt-4">
                <RightPanel model3d={post.model3d} showcase={post.showcase} />
              </div>
            )}
          </div>

        </div>
      </motion.main>
      {/* Scroll-to-top FAB */}
      <AnimatePresence>
        {scrollTop && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
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

export default ThesisPage;
