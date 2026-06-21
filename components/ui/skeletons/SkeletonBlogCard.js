import SkeletonBox from "../SkeletonBox";

export default function SkeletonBlogCard() {
  return (
    <div className="flex flex-col gap-0 w-full min-h-fit overflow-hidden">
      <div className="w-full shrink-0 relative bg-[#252525] aspect-video">
        <SkeletonBox width="100%" height="100%" borderRadius="0" />
      </div>
      <div className="flex-1 flex flex-col pt-0 px-5 pb-3 items-start min-h-fit">
        <div className="flex items-start justify-between gap-4 mt-4 w-full">
          <SkeletonBox width="70%" height="1.2rem" borderRadius="4px" />
        </div>
        <div className="mt-2 w-full">
          <SkeletonBox width="40%" height="0.8rem" borderRadius="4px" />
        </div>
        <div className="flex flex-wrap gap-2 mt-auto pt-4">
          <SkeletonBox width="3rem" height="1.4rem" borderRadius="2px" />
          <SkeletonBox width="4rem" height="1.4rem" borderRadius="2px" />
          <SkeletonBox width="3.5rem" height="1.4rem" borderRadius="2px" />
        </div>
      </div>
    </div>
  );
}
