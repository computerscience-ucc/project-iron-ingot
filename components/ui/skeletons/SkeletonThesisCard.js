import SkeletonBox from "../SkeletonBox";

export default function SkeletonThesisCard() {
  return (
    <div className="flex flex-col lg:flex-row gap-0 w-full min-h-fit lg:h-[168.75px] pb-0 lg:pb-0 overflow-hidden">
      <div className="w-full lg:w-[300px] shrink-0 relative bg-[#252525] aspect-video self-start lg:self-auto">
        <SkeletonBox width="100%" height="100%" borderRadius="0" />
      </div>
      <div className="flex-1 flex flex-col px-0 lg:pl-6 lg:pr-4 pt-4 pb-0 lg:py-3 min-h-fit">
        <div className="flex items-start justify-between gap-4">
          <SkeletonBox width="60%" height="1.2rem" borderRadius="4px" />
        </div>
        <div className="mt-2 w-full">
          <SkeletonBox width="45%" height="0.8rem" borderRadius="4px" />
        </div>
        <div className="mt-2 w-full space-y-1.5">
          <SkeletonBox width="100%" height="0.75rem" borderRadius="4px" />
          <SkeletonBox width="80%" height="0.75rem" borderRadius="4px" />
        </div>
        <div className="flex flex-wrap overflow-hidden gap-2 mt-4 lg:mt-auto h-[26px]">
          <SkeletonBox width="4rem" height="1.4rem" borderRadius="2px" />
          <SkeletonBox width="3rem" height="1.4rem" borderRadius="2px" />
          <SkeletonBox width="3.5rem" height="1.4rem" borderRadius="2px" />
        </div>
      </div>
    </div>
  );
}
