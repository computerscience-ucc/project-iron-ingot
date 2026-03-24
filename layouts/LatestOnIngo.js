import Link from "next/link";
import { useMotionValue, useSpring } from "motion/react";
import { useState, useEffect } from "react";
import BlogCard from "../components/Home/LatestOnIngo/BlogCard";
import ArticleCard from "../components/Home/LatestOnIngo/ArticleCard";
import LatestOnCursor from "../components/Home/LatestOnIngo/LatestOnCursor";

export default function LatestOnIngo({ blog, thesis, bulletin }) {
  const [hoveredCard, setHoveredCard] = useState(null); // 'blog' | 'article' | null
  const [isCursorHidden, setIsCursorHidden] = useState(false);

  useEffect(() => {
    let timer;
    if (hoveredCard) {
      timer = setTimeout(() => setIsCursorHidden(true), 150);
    } else {
      setIsCursorHidden(false);
    }
    return () => clearTimeout(timer);
  }, [hoveredCard]);

  // Shared cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const rows = [
    {
      id: 1,
      articleHref: `/blog/${blog?.slug || ""}`,
      blogHref: "/blog",
      blogImage: "/mascot/vibe-bot.png",
      blogAlt: "Vibe Bot",
      blogTitle: "Blog",
      blogDesc:
        "Explore expert articles, technical tutorials, and the latest trends in the ever-evolving field of computer science.",
      articleTitle: blog?.title || "Introduction to Computer Science Program",
      articleAuthor: `By ${blog?.authors?.[0]?.fullName?.firstName || "Ingo"} ${blog?.authors?.[0]?.fullName?.lastName || ""} on ${formatDate(blog?._createdAt) || "Jul 29, 2022"}`,
      articleTags: blog?.tags?.slice(0, 3) || ["COMPUTER NETWORKS"],
      articleBg: "bg-[#242424]",
      articleImage: blog?.headerImage || null,
    },
    {
      id: 2,
      articleHref: `/thesis/${thesis?.slug || ""}`,
      blogHref: "/thesis",
      blogImage: "/mascot/thesis-bot.png",
      blogAlt: "Thesis Bot",
      blogTitle: "Thesis Showcase",
      blogDesc:
        "Explore the latest senior research projects and innovations from our BSCS candidates.",
      articleTitle: thesis?.title || "CyKlas",
      articleAuthor: `By ${thesis?.authors?.map((m) => `${m.fullName.firstName} ${m.fullName.lastName}`).join(", ") || "BSCS Candidates"} on ${formatDate(thesis?._createdAt) || "Jul 27, 2022"}`,
      articleTags: thesis?.tags?.slice(0, 3) || [
        "WEBSITE",
        "E-LEARNING",
        "EDUCATION",
      ],
      articleBg: "bg-[#181818]",
      articleImage: thesis?.headerImage || null,
    },
    {
      id: 3,
      articleHref: `/bulletin/${bulletin?.slug || ""}`,
      blogHref: "/bulletin",
      blogImage: "/mascot/bulletin-bot.png",
      blogAlt: "Bulletin Bot",
      blogTitle: "Bulletin Board",
      blogDesc:
        "Stay updated with important announcements, academic schedules, and program notices.",
      articleTitle: bulletin?.title || "MARK YOUR DATES! AUGUST 9 2024",
      articleAuthor: `By ${bulletin?.authors?.[0]?.fullName?.firstName || "Ingo"} ${bulletin?.authors?.[0]?.fullName?.lastName || ""} on ${formatDate(bulletin?._createdAt) || "Aug 05, 2024"}`,
      articleTags: bulletin?.tags?.slice(0, 3) || ["RESUMPTION OF CLASSES"],
      articleBg: "bg-[#242424]",
      articleImage: bulletin?.headerImage || null,
    },
  ];

  return (
    <div id="latest" className="w-full font-sans bg-[#181818] relative overflow-hidden">
      {/* Shared Custom Cursor */}
      <LatestOnCursor
        hoveredCard={hoveredCard}
        springX={springX}
        springY={springY}
      />

      {/* Header Section */}
      <section className="relative w-full py-8 md:py-10 lg:py-[3.4rem] flex justify-center items-center px-4 md:px-0 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-[2.2rem] font-bold text-white flex items-center justify-center gap-[0.5rem] lg:gap-[0.8rem] leading-[1.1] tracking-[0.34%] flex-wrap">
          Latest on
          <span className="font-minecraft text-[#FF5154] font-normal inline-block translate-y-[0.28rem] lg:translate-y-[0.38rem]">
            Ingo
          </span>
        </h2>
      </section>

      {rows.map((row, idx) => {
        const isEven = idx % 2 === 1;
        const cardBaseClass =
          "bg-[#181818] border-y border-dashed border-[#474747] flex flex-col relative z-20 -my-px";

        return (
          <div
            key={row.id}
            className={`w-full border-b border-dashed border-[#2A2A2A] transition-colors ${
              idx === 0 ? "border-t border-dashed border-[#2A2A2A]" : "-mt-px"
            }`}
          >
            <div className="relative section-container grid grid-cols-1 lg:grid-cols-[12rem_1fr_1fr_12rem]">
              {/* Left Side Gutter (Stripe visible on large screens) */}
              <div className="hidden lg:block border-l border-r border-dashed border-[#2A2A2A] relative z-0 overflow-hidden min-h-[480px]">
                <div className="stripe-banner absolute inset-0"></div>
              </div>

              {/* Central Cards - Alternating Order */}
              {isEven ? (
                <>
                  <Link href={row.articleHref} className="contents">
                    <ArticleCard
                      row={row}
                      cardIndex={row.id}
                      cardBaseClass={cardBaseClass}
                      borderClass={`border-x border-b ${idx === rows.length - 1 ? "" : "lg:border-b-0"}`}
                      setHoveredCard={setHoveredCard}
                      isCursorHidden={isCursorHidden}
                      gridOrder="order-2 lg:order-none"
                    />
                  </Link>
                  <Link href={row.blogHref} className="contents">
                    <BlogCard
                      row={row}
                      cardBaseClass={cardBaseClass}
                      borderClass={`border-x lg:border-l-0 border-b ${idx === rows.length - 1 ? "" : "lg:border-b-0"}`}
                      setHoveredCard={setHoveredCard}
                      isCursorHidden={isCursorHidden}
                      gridOrder="order-1 lg:order-none"
                    />
                  </Link>
                </>
              ) : (
                <>
                  <Link href={row.blogHref} className="contents">
                    <BlogCard
                      row={row}
                      cardBaseClass={cardBaseClass}
                      borderClass={`border-x border-b ${idx === rows.length - 1 ? "" : "lg:border-b-0"}`}
                      setHoveredCard={setHoveredCard}
                      isCursorHidden={isCursorHidden}
                      gridOrder="order-none"
                    />
                  </Link>
                  <Link href={row.articleHref} className="contents">
                    <ArticleCard
                      row={row}
                      cardIndex={row.id}
                      cardBaseClass={cardBaseClass}
                      borderClass={`border-x lg:border-l-0 border-b ${idx === rows.length - 1 ? "" : "lg:border-b-0"}`}
                      setHoveredCard={setHoveredCard}
                      isCursorHidden={isCursorHidden}
                      gridOrder="order-none"
                    />
                  </Link>
                </>
              )}

              {/* Right Side Gutter (Stripe visible on large screens) */}
              <div className="hidden lg:block border-l border-r border-dashed border-[#2A2A2A] relative z-0 overflow-hidden">
                <div className="stripe-banner absolute inset-0"></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
