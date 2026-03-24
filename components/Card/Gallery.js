import Link from "next/link";
import dayjs from "dayjs";
import { useState } from "react";
import Image from "next/image";

const GALLERY_PLACEHOLDER_COUNT = 5;

const GalleryCard = ({ project, index = 0 }) => {
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

  const placeholderImage = `/placeholders/gallery/${(index % GALLERY_PLACEHOLDER_COUNT) + 1}.png`;

  const [isLoading, setIsLoading] = useState(false);

  // Fallback for image
  const displayImage = headerImage;

  // Description fallback
  const displayDescription = description || summary;

  // Year for badge
  const displayYear = projectDate ? new Date(projectDate).getFullYear().toString() : null;

  return (
    <Link
      href={`/gallery/${slug}`}
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
        {displayImage ? (
          <Image
            src={displayImage}
            alt={title || "Project Image"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 300px"
          />
        ) : (
          <Image
            src={placeholderImage}
            alt="Project Placeholder"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 300px"
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col px-0 lg:pl-6 lg:pr-4 pt-4 pb-0 lg:py-3 transition-colors duration-200 group-hover:bg-white/[0.02] min-h-fit">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[1rem] md:text-[1.25rem] font-semibold tracking-normal text-[#EFEFEF] group-hover:text-white transition-colors leading-[1.3] line-clamp-1">
            {title || "Untitled Project"}
          </p>
        </div>

        <p className="text-[0.75rem] md:text-[0.875rem] text-[#8C8C8C] mt-1 leading-[1.4] font-medium line-clamp-1">
          By {personName || "Unknown Author"} on {dayjs(projectDate || _createdAt).format("MMM DD, YYYY")}
        </p>

        {displayDescription &&
          (() => {
            const limit = 180;
            if (displayDescription.length <= limit)
              return (
                <p className="text-[0.875rem] md:text-[1rem] text-[#8C8C8C] mt-1.5 md:mt-2 leading-normal font-normal line-clamp-2">
                  {displayDescription}
                </p>
              );
            const trimmed = displayDescription.slice(0, limit);
            const lastSpace = trimmed.lastIndexOf(" ");
            return (
              <p className="text-[0.875rem] md:text-[1rem] text-[#8C8C8C] mt-1.5 md:mt-2 leading-normal font-normal line-clamp-2">
                {trimmed.slice(0, lastSpace)}...
              </p>
            );
          })()}

        {/* Tags Container pushed to the bottom on desktop, spaced on mobile */}
        <div className="flex flex-wrap overflow-hidden gap-2 mt-4 lg:mt-auto h-[26px]">
          {displayYear && (
            <span className="shrink-0 px-2 py-0.5 bg-[#F02E31] text-[#EFEFEF] text-[0.8rem] font-sans font-medium tracking-wide whitespace-nowrap">
              {displayYear}
            </span>
          )}
          {tags &&
            tags.length > 0 &&
            tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.8rem] font-sans font-medium uppercase tracking-wide whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          {tags && tags.length > 4 && (
            <span className="px-2 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.8rem] font-sans font-medium uppercase tracking-wide whitespace-nowrap">
              +{tags.length - 4} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GalleryCard;
