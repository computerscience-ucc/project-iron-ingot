import Image from "next/image";

export default function ArticleCard({
  row,
  cardBaseClass,
  borderClass,
  setHoveredCard,
  isCursorHidden,
}) {
  return (
    <div
      className={`${cardBaseClass} ${borderClass} ${isCursorHidden ? "cursor-none" : ""}`}
      onMouseEnter={() => setHoveredCard("article")}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="p-6 pb-8 md:p-[1.8rem] md:pb-8 text-left">
        <h3 className="text-2xl md:text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-2">
          {row.articleTitle}
        </h3>
        <p className="text-[#8C8C8C] text-[1.1rem] leading-tight font-normal">
          {row.articleAuthor}
        </p>
      </div>

      <div
        className={`flex-1 relative overflow-hidden border-t border-[#2A2A2A] ${row.articleBg || "bg-[#242424]"}`}
      >
        {row.articleImage && (
          <Image
            src={row.articleImage}
            alt={row.articleTitle}
            fill
            className="object-cover opacity-80"
          />
        )}
        <div className="absolute bottom-6 left-6 z-10 flex flex-wrap gap-2">
          {row.articleTags &&
            row.articleTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.8rem] font-sans font-medium uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
