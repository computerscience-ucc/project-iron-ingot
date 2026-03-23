import Link from "next/link";
import dayjs from "dayjs";
import { useState } from "react";
import Image from "next/image";

const BlogCard = ({ blog }) => {
  const { _createdAt, authors, title, tags, slug, headerImage, owners } = blog;

  const [isLoading, setIsLoading] = useState(false);

  // Author string fallback
  const displayAuthors =
    owners ||
    authors
      ?.map((a) =>
        `${a.fullName?.firstName || ""} ${a.fullName?.lastName || ""}`.trim(),
      )
      .join(", ") ||
    "Unknown Author";

  return (
    <Link
      href={`/blog/${slug}`}
      scroll={false}
      onClick={() => setIsLoading(true)}
      className="flex flex-col lg:flex-row gap-0 relative group cursor-pointer w-full min-h-fit lg:h-[168.75px] pb-0 lg:pb-0 overflow-hidden"
    >
      {/* Click-loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#181818]/80">
          <div className="w-6 h-6 border-2 border-[#EFEFEF]/80 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Project Image / Placeholder */}
      <div className="w-full lg:w-[300px] shrink-0 overflow-hidden relative bg-[#252525] aspect-video self-start lg:self-auto">
        {headerImage ? (
          <Image
            src={headerImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 300px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#333333]">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col px-0 lg:pl-6 lg:pr-4 pt-4 pb-0 lg:py-3 transition-colors duration-200 group-hover:bg-white/[0.02] min-h-fit">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[1rem] md:text-[1.25rem] font-semibold tracking-normal text-[#EFEFEF] group-hover:text-white transition-colors leading-[1.3] line-clamp-1">
            {title || "Untitled Post"}
          </p>
        </div>

        <p className="text-[0.75rem] md:text-[0.875rem] text-[#8C8C8C] mt-1 leading-[1.4] font-medium line-clamp-1">
          By {displayAuthors} on {dayjs(_createdAt).format("MMM DD, YYYY")}
        </p>

        {/* Tags Container pushed to the bottom on desktop, spaced on mobile */}
        <div className="flex flex-wrap overflow-hidden gap-2 mt-4 lg:mt-auto h-[26px]">
          {tags &&
            tags.length > 0 &&
            tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.8rem] font-sans font-medium uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          {tags && tags.length > 4 && (
            <span className="px-2 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.8rem] font-sans font-medium uppercase tracking-wide">
              +{tags.length - 4} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
