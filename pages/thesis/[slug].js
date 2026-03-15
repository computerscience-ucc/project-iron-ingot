import { AnimatePresence, motion } from "framer-motion";
import { CgChevronLeft, CgChevronUp } from "react-icons/cg";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { PortableText } from "@portabletext/react";
import { _Transition_Page } from "../../lib/animations";
import { client } from "../../lib/sanity";
import dayjs from "dayjs";
import urlBuilder from "@sanity/image-url";
import MaterialsList from "../../components/Thesis/MaterialsList";
import HeroCarousel from "../../components/Thesis/HeroCarousel";
import MemberStrip from "../../components/Thesis/MemberStrip";
import RightPanel from "../../components/Thesis/RightPanel";

const urlFor = (source) =>
  urlBuilder({ projectId: "gjvp776o", dataset: "production" }).image(source);

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|[?&]v=)([^&?/\s]{11})/);
  return m ? m[1] : null;
}

const blockComponents = {
  types: {
    image: ({ value }) => (
      <div className="relative w-full h-[300px] my-4">
        <Image src={urlFor(value.asset).url()} layout="fill" objectFit="contain" alt={value.alt || ""} />
      </div>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold mt-6 mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-5 mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mt-4 mb-1">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-bold mt-3 mb-1">{children}</h4>,
    normal: ({ children }) => <p className="leading-relaxed mb-3 text-gray-300">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-red-600 pl-4 my-4 italic text-gray-400">{children}</blockquote>
    ),
  },
  marks: {
    em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    link: ({ children, value }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer"
        className="underline underline-offset-4 text-blue-400 hover:text-blue-300 transition">
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
      "content": thesisContent
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
      <Head>
        <title>{post.title} | Ingo</title>
        <meta name="description" content={post.title} />
      </Head>
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
        className="min-h-screen pt-36 pb-24"
      >
        {/* ── Back + Title ── */}
        <div className="mb-8">
          <Link
            href="/thesis"
            scroll={false}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-400 transition mb-5">

            <CgChevronLeft size={18} />Back to Thesis

          </Link>

          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {post.academicYear && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-600/30 font-semibold">
                {post.academicYear}
              </span>
            )}
            {post.department && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                {DEPT_LABEL[post.department] || post.department}
              </span>
            )}
            {post._createdAt && (
              <span className="text-[11px] text-gray-600 ml-auto">
                {dayjs(post._createdAt).format("MMMM D, YYYY")}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white mb-4">
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {post.tags.map((tag, i) => (
                <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#1a1d24] text-gray-400 border border-white/5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Hero Carousel ── */}
        {hasCarousel && <HeroCarousel images={post.images || []} youtubeId={youtubeId} />}

        {/* ── Member Strip (new thesisMembers field) ── */}
        {post.members && post.members.length > 0 && (
          <MemberStrip members={post.members} />
        )}

        {/* Fallback: legacy ownerFullname list */}
        {(!post.members || post.members.length === 0) && post.owners?.ownerFullname?.length > 0 && (
          <div className="mb-8">
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1.5">Thesis Authors</p>
            <p className="text-sm text-gray-300">
              {post.owners.ownerSection && (
                <span className="text-red-400 mr-2">({post.owners.ownerSection})</span>
              )}
              {post.owners.ownerFullname.join(", ")}
            </p>
          </div>
        )}

        <hr className="border-white/5 mb-10" />

        {/* ── Two-column: Content | 3D Model or Showcase ── */}
        <div className={hasRightPanel ? "grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start" : ""}>
          {/* Left: Tabs + content */}
          <div className="flex flex-col gap-4">
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 bg-[#0a0c10] rounded-xl border border-white/5 w-fit">
              <button
                onClick={() => setLeftTab("abstract")}
                className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  leftTab === "abstract"
                    ? "bg-red-600/90 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Abstract
              </button>
              {post.materials && post.materials.length > 0 && (
                <button
                  onClick={() => setLeftTab("materials")}
                  className={`flex items-center gap-1.5 px-5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    leftTab === "materials"
                      ? "bg-red-600/90 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Materials
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10">{post.materials.length}</span>
                </button>
              )}
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
                >
                  {post.content ? (
                    <PortableText value={post.content} components={blockComponents} />
                  ) : (
                    <p className="text-gray-500 italic">No content available yet.</p>
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
                >
                  <MaterialsList materials={post.materials} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: 3D model, image showcase, or tab-switcher if both */}
          {hasRightPanel && (
            <RightPanel model3d={post.model3d} showcase={post.showcase} />
          )}
        </div>

        {/* ── Posted-by credit ── */}
        {post.authors && post.authors.length > 0 && (
          <div className="mt-12 pt-6 border-t border-white/5">
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Posted by</p>
            <p className="text-sm text-gray-400">
              {post.authors
                .map((a) => `${a.fullName?.firstName || ""} ${a.fullName?.lastName || ""}`.trim())
                .join(", ")}
            </p>
          </div>
        )}
      </motion.main>
      {/* Scroll-to-top FAB */}
      <AnimatePresence>
        {scrollTop && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={() => window.scroll({ top: 0, behavior: "smooth" })}
            className="fixed z-30 bottom-6 right-6 w-10 h-10 rounded-full bg-[#1a1d24] border border-white/10 hover:border-red-500/50 flex items-center justify-center text-gray-400 hover:text-white transition shadow-lg"
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
