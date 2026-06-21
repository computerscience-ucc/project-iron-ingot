import SkeletonBox from "../SkeletonBox";

export default function SkeletonOfficerCard({ className = "" }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <SkeletonBox
        width="100%"
        aspectRatio="1/1"
        borderRadius="8px"
        className="max-w-[12rem]"
      />
      <div className="flex flex-col items-center mt-3 gap-1 w-full">
        <SkeletonBox width="60%" height="1rem" borderRadius="4px" />
        <SkeletonBox width="40%" height="0.75rem" borderRadius="4px" />
      </div>
    </div>
  );
}
