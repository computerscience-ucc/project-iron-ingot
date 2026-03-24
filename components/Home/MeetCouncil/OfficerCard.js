import Image from "next/image";

export default function OfficerCard({ name, role, photo, className, imageClassName, onClick }) {
  return (
    <div
      className={`flex flex-col ${className || "min-w-[8.5rem] w-[8.5rem] md:min-w-[11.5rem] md:w-[11.5rem] lg:min-w-[25rem] lg:w-[25rem]"} ${onClick ? "cursor-pointer group" : ""}`}
      onClick={onClick}
    >
      <div className="relative w-full aspect-square bg-[#242424] border border-dashed border-[#8E8E8E] flex items-center justify-center mb-2.5 md:mb-3.5 lg:mb-[1.2rem] overflow-hidden">
        {/* Corner alignment markers */}
        <div className="absolute top-[-1px] left-[-1px] w-[6px] md:w-[8px] h-[6px] md:h-[8px] bg-[#FF5154] z-10"></div>
        <div className="absolute top-[-1px] right-[-1px] w-[6px] md:w-[8px] h-[6px] md:h-[8px] bg-[#FF5154] z-10"></div>
        <div className="absolute bottom-[-1px] left-[-1px] w-[6px] md:w-[8px] h-[6px] md:h-[8px] bg-[#FF5154] z-10"></div>
        <div className="absolute bottom-[-1px] right-[-1px] w-[6px] md:w-[8px] h-[6px] md:h-[8px] bg-[#FF5154] z-10"></div>
        {photo && (
          <Image
            src={photo}
            alt={name}
            fill
            className={imageClassName || "object-cover"}
          />
        )}
      </div>

      <div className="flex flex-col items-start gap-0.5 md:gap-1">
        <h4 className="text-base md:text-lg lg:text-[1.25rem] font-semibold text-white tracking-wide leading-[1.2] text-left">
          {name}
        </h4>
        <p className="text-[#8C8C8C] text-[0.8rem] md:text-sm lg:text-[0.9rem] leading-relaxed font-normal text-left">
          {role}
        </p>
      </div>
    </div>
  );
}
