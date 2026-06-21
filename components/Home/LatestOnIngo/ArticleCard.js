import Image from "next/image";
import { motion } from "motion/react";

export default function ArticleCard({
  row,
  cardBaseClass,
  borderClass,
  setHoveredCard,
  isCursorHidden,
  gridOrder,
  cardIndex,
}) {
  // If it's the Bulletin card (index 3), use 9.png as explicitly requested.
  // Otherwise, alternate based on index.
  let placeholderImage = `/placeholders/${(cardIndex % 9) + 1}.png`;
  if (cardIndex === 1) placeholderImage = "/placeholders/1.png";
  if (cardIndex === 3) placeholderImage = "/placeholders/9.png";

  return (
    <div
      className={`${cardBaseClass} ${borderClass} ${gridOrder || ""} ${isCursorHidden ? "cursor-none" : ""}`}
      onMouseEnter={() => setHoveredCard("article")}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <motion.div
        key={row.articleTitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="p-4 pb-6 md:p-6 md:pb-8 lg:p-[1.8rem] lg:pb-8 text-left"
      >
        <h3 className="text-xl md:text-2xl lg:text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-2">
          {row.articleTitle}
        </h3>
        <p className="text-[#8C8C8C] text-sm md:text-[1rem] lg:text-[1.1rem] leading-tight font-normal">
          {row.articleAuthor}
        </p>
      </motion.div>

      <div
        className={`flex-1 relative overflow-hidden border-t border-[#2A2A2A] min-h-[200px] md:min-h-[250px] lg:min-h-0 ${row.articleBg || "bg-[#242424]"}`}
      >
        <Image
          src={row.articleImage || placeholderImage}
          alt={row.articleTitle}
          fill
          className="object-cover"
          sizes="(max-width: 1440px) 100vw, 800px"
        />

        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10 flex flex-wrap gap-2">
          {row.articleTags &&
            row.articleTags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 md:px-2 bg-[#333333] text-[#EFEFEF] text-[0.6rem] md:text-[0.7rem] lg:text-[0.8rem] font-sans font-medium uppercase tracking-wide whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-t from-[#121212]/40 via-[#121212]/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
