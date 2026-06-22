import { AnimatePresence, motion } from "framer-motion";
import { CgChevronUp } from "react-icons/cg";
import { ArrowLeft } from "@geist-ui/icons";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import Head from "@/components/Head";
import Image from "next/image";
import Link from "next/link";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { _Transition_Page } from "../../lib/animations";
import { client } from "../../lib/sanity";
import dayjs from "dayjs";
import { GALLERY_PATHS_QUERY, GALLERY_DETAIL_QUERY } from "../../lib/groq/gallery";

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const isYouTube = host === "youtube.com" || host === "www.youtube.com" || host === "youtu.be";
    if (!isYouTube) return null;

    if (host === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    const id = parsed.searchParams.get("v");
    if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    if (parsed.pathname.startsWith("/embed/")) {
      return `https://www.youtube-nocookie.com${parsed.pathname}`;
    }
  } catch {
    return null;
  }
  return null;
}

export const getStaticPaths = async () => {
  try {
    const projects = await client.fetch(GALLERY_PATHS_QUERY);
    return { paths: projects.map((p) => ({ params: { slug: p.slug } })), fallback: "blocking" };
  } catch (error) {
    console.error("[gallery] getStaticPaths error:", error);
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps = async ({ params }) => {
  try {
    const project = await client.fetch(GALLERY_DETAIL_QUERY, { slug: params.slug });
    if (!project) return { notFound: true };
    return { props: { project }, revalidate: 10 };
  } catch (error) {
    console.error("[gallery] getStaticProps error:", error);
    return { notFound: true };
  }
};

const GalleryProjectPage = ({ project }) => {
  const mainRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(project.youtubeEmbedLink);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => {
      const h = mainRef.current?.scrollHeight || 0;
      setScrollTop(window.scrollY > h * 0.15 && window.scrollY < h - 700);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Head
        title={`${project.title} | Gallery | Ingo`}
        description={`${project.title}${project.personName ? ` by ${project.personName}` : ""}`}
        ogImage={project.profilePicture}
        url={`/gallery/${project.slug}`}
      >
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
      </Head>

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
          {/* Sticky Back Button (Desktop) */}
          <div className="hidden lg:block absolute right-full top-0 h-full pr-[4rem] xl:pr-[6rem]">
            <div className="sticky top-[8rem]">
              <Link href="/gallery" scroll={false}>
                <Button className="bg-[#242424] hover:bg-[#2F2F2F] text-[#8C8C8C] hover:text-[#EFEFEF] border-none h-[40px] px-4 rounded-[4px] font-sans font-medium text-[0.9375rem] transition-colors flex items-center gap-[0.6rem] whitespace-nowrap">
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Back button (Mobile) */}
          <div className="lg:hidden mb-[2rem] flex justify-end">
            <Link href="/gallery" scroll={false}>
              <Button className="bg-[#242424] hover:bg-[#2F2F2F] text-[#8C8C8C] hover:text-[#EFEFEF] border-none h-[40px] px-4 rounded-[4px] font-sans font-medium text-[0.9375rem] transition-colors flex items-center gap-[0.6rem]">
                <ArrowLeft size={18} />
                <span>Back to Gallery</span>
              </Button>
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-[1.25rem] md:text-[1.5rem] lg:text-[2rem] text-[#ffffff] font-semibold tracking-normal leading-tight mb-[0.5rem]">
            {project.title}
          </h1>

          {/* Author & Date */}
          <div className="flex items-center gap-3 text-[0.8rem] md:text-[0.875rem] text-[#8C8C8C] mt-[1rem] mb-[1rem] md:mb-[1.5rem] font-normal">
            {project.profilePicture && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#2F2F2F] shrink-0">
                <Image
                  src={project.profilePicture}
                  alt={project.personName}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="32px"
                />
              </div>
            )}
            <span>{project.personName}</span>
            <span>•</span>
            <span>
              {dayjs(project.projectDate || project._createdAt).format("MMMM D, YYYY")}
            </span>
          </div>

          {/* YouTube Embed */}
          {embedUrl && (
            <div className="relative w-full overflow-hidden bg-[#242424] mb-[1rem] md:mb-[1.5rem]">
              {/* Dashed border overlay */}
              <div className="absolute inset-0 border border-[#5B5B5B] border-dashed pointer-events-none z-30" />

              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-[#FF5154] z-[40] transform -translate-x-[1px] -translate-y-[1px]" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#FF5154] z-[40] transform translate-x-[1px] -translate-y-[1px]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#FF5154] z-[40] transform -translate-x-[1px] translate-y-[1px]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#FF5154] z-[40] transform translate-x-[1px] translate-y-[1px]" />

              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`${embedUrl}?rel=0&modestbranding=1&enablejsapi=1`}
                  title={`${project.title} video`}
                  allow="autoplay; fullscreen; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mt-3 md:mt-4 mb-4 md:mb-6">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-[#333333] text-[#EFEFEF] text-[0.7rem] font-sans font-bold uppercase tracking-wider whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <hr className="border-[#2F2F2F] mb-[1.5rem] md:mb-[2.5rem]" />

          {/* External Links */}
          <p className="text-[1rem] md:text-[1.25rem] font-semibold tracking-normal text-[#EFEFEF] mb-[0.6rem]">Links</p>
          <div className="flex flex-wrap gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#242424] hover:bg-[#2F2F2F] text-[#8C8C8C] hover:text-[#EFEFEF] rounded-[4px] text-[0.875rem] font-sans font-medium transition-colors"
              >
                <SiGithub size={16} />
                <span>View GitHub</span>
              </a>
            )}
            {project.linkedinProfile && (
              <a
                href={project.linkedinProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#242424] hover:bg-[#2F2F2F] text-[#8C8C8C] hover:text-[#EFEFEF] rounded-[4px] text-[0.875rem] font-sans font-medium transition-colors"
              >
                <SiLinkedin size={16} />
                <span>LinkedIn Profile</span>
              </a>
            )}
          </div>

          {/* Fallback when no embed */}
          {!embedUrl && (
            <p className="text-[1rem] text-[#8C8C8C] leading-relaxed py-2 font-normal">
              No video output available for this project.
            </p>
          )}
        </div>
      </motion.main>

      {/* Scroll to top */}
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

export default GalleryProjectPage;
