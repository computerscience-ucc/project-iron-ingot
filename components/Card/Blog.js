import Link from "next/link";
import dayjs from "dayjs";
import { useState } from "react";
import Image from "next/image";

const BLOG_PLACEHOLDER_COUNT = 6;

const BlogCard = ({ blog, index }) => {
  const { _id, _createdAt, authors, title, tags, slug, headerImage, owners } = blog;

  const placeholderImage = `/placeholders/blog/${(index % BLOG_PLACEHOLDER_COUNT) + 1}.png`;

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
      className="flex flex-col gap-0 relative group cursor-pointer w-full min-h-fit overflow-hidden"
    >
      {/* Click-loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#181818]/80">
          <div className="w-6 h-6 border-2 border-[#EFEFEF]/80 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Project Image / Placeholder */}
      <div className="w-full shrink-0 overflow-hidden relative bg-[#252525] aspect-video">
        {headerImage ? (
          <Image
            src={headerImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1440px) 100vw, 400px"
          />
        ) : (
          <Image
            src={placeholderImage}
            alt="Post Placeholder"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1440px) 100vw, 400px"
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-0 px-5 pb-3 items-start transition-colors duration-200 group-hover:bg-white/[0.01] min-h-fit">
        <div className="flex items-start justify-between gap-4 mt-4">
          <p className="text-[1rem] md:text-[1.25rem] font-semibold tracking-normal text-[#EFEFEF] group-hover:text-white transition-colors leading-[1.3] line-clamp-1">
            {title || "Untitled Post"}
          </p>
        </div>

        <p className="text-[0.75rem] md:text-[0.875rem] text-[#8C8C8C] mt-1.5 leading-[1.4] font-medium line-clamp-1">
          By {displayAuthors} on {dayjs(_createdAt).format("MMM DD, YYYY")}
        </p>

        {/* Tags Container pushed to the bottom on desktop, spaced on mobile */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4">
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
