import Image from "next/image";
import { ArrowRight } from "@geist-ui/icons";

export default function BlogCard({
  row,
  cardBaseClass,
  borderClass,
  setHoveredCard,
  isCursorHidden,
}) {
  return (
    <div
      className={`${cardBaseClass} ${borderClass} ${isCursorHidden ? "cursor-none" : ""}`}
      onMouseEnter={() => setHoveredCard("blog")}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="p-6 md:p-[1.8rem] pb-0 md:pb-0 text-left">
        <h3 className="text-2xl md:text-[1.6rem] font-semibold text-white flex items-center gap-2 tracking-tight leading-none">
          {row.blogTitle} <ArrowRight size={24} />
        </h3>
        <p className="text-[#8C8C8C] text-[1.1rem] leading-tight mt-4 font-normal">
          {row.blogDesc}
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center relative overflow-hidden pb-6 md:pb-[1.8rem] min-h-[250px] md:min-h-0">
        <div className="relative w-[80%] h-[80%] md:w-[60%] md:h-[60%]">
          <Image
            src={row.blogImage}
            alt={row.blogAlt}
            fill
            className="object-contain"
            priority={row.id === 1}
          />
        </div>
      </div>
    </div>
  );
}
