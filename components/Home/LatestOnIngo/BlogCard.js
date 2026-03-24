import Image from "next/image";
import { ArrowRight } from "@geist-ui/icons";

export default function BlogCard({
  row,
  cardBaseClass,
  borderClass,
  setHoveredCard,
  isCursorHidden,
  gridOrder,
}) {
  return (
    <div
      className={`${cardBaseClass} ${borderClass} ${gridOrder || ""} ${isCursorHidden ? "cursor-none" : ""}`}
      onMouseEnter={() => setHoveredCard("blog")}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="p-4 md:p-6 lg:p-[1.8rem] pb-0 md:pb-0 text-left">
        <h3 className="text-xl md:text-2xl lg:text-[1.6rem] font-semibold text-white flex items-center gap-2 tracking-tight leading-none">
          {row.blogTitle} <ArrowRight size={18} className="md:size-[20px] lg:size-[24px]" />
        </h3>
        <p className="text-[#8C8C8C] text-sm md:text-[1rem] lg:text-[1.1rem] leading-tight mt-3 md:mt-4 font-normal">
          {row.blogDesc}
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center relative overflow-hidden pb-4 md:pb-6 lg:pb-[1.8rem] min-h-[200px] md:min-h-[250px] lg:min-h-0">
        <div className="relative w-[65%] h-[65%] md:w-[55%] md:h-[55%] lg:w-[60%] lg:h-[60%]">
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
