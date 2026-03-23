import Link from "next/link";
import dayjs from "dayjs";
import { useState } from "react";
import Image from "next/image";

const GalleryCard = ({ project }) => {
  const {
    _createdAt,
    projectDate,
    title,
    tags,
    slug,
    description,
    summary,
    personName,
    headerImage,
  } = project;

  const [isLoading, setIsLoading] = useState(false);

  // Fallback for image
  const displayImage = headerImage;

  // Description fallback
  const displayDescription = description || summary;

  return (
    <Link
      href={`/gallery/${slug}`}
      scroll={false}
      onClick={() => setIsLoading(true)}
      className="flex gap-0 relative group cursor-pointer w-full h-[168.75px]"
    >
      {/* Click-loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#181818]/80">
          <div className="w-6 h-6 border-2 border-[#EFEFEF]/80 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Project Image / Placeholder */}
      <div className="w-[300px] h-full shrink-0 overflow-hidden relative bg-[#252525]">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={title || "Project Image"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="300px"
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
      <div className="flex-1 flex flex-col pl-6 pr-4 py-3 transition-colors duration-200 group-hover:bg-white/[0.02] h-full overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[1.25rem] font-semibold tracking-normal text-[#EFEFEF] group-hover:text-white transition-colors leading-[1.3] line-clamp-1">
            {title || "Untitled Project"}
          </p>
        </div>

        <p className="text-[0.875rem] text-[#8C8C8C] mt-1 leading-[1.4] font-medium line-clamp-1">
          By {personName || "Unknown Author"} on {dayjs(projectDate || _createdAt).format("MMM DD, YYYY")}
        </p>

        {displayDescription &&
          (() => {
            const limit = 180;
            if (displayDescription.length <= limit)
              return (
                <p className="text-[1rem] text-[#8C8C8C] mt-2 leading-normal font-normal line-clamp-2">
                  {displayDescription}
                </p>
              );
            const trimmed = displayDescription.slice(0, limit);
            const lastSpace = trimmed.lastIndexOf(" ");
            return (
              <p className="text-[1rem] text-[#8C8C8C] mt-2 leading-normal font-normal line-clamp-2">
                {trimmed.slice(0, lastSpace)}...
              </p>
            );
          })()}

        {/* Tags Container pushed to the bottom */}
        <div className="flex flex-wrap gap-2 mt-auto">
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

export default GalleryCard;
