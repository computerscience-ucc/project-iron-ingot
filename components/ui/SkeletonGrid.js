import { motion } from "motion/react";
import SkeletonBlogCard from "./skeletons/SkeletonBlogCard";
import SkeletonThesisCard from "./skeletons/SkeletonThesisCard";
import SkeletonGalleryCard from "./skeletons/SkeletonGalleryCard";
import SkeletonOfficerCard from "./skeletons/SkeletonOfficerCard";

const cardComponents = {
  blog: SkeletonBlogCard,
  thesis: SkeletonThesisCard,
  gallery: SkeletonGalleryCard,
  officer: SkeletonOfficerCard,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function SkeletonGrid({
  cardType = "blog",
  count = 6,
  className = "",
  gridClassName = "",
}) {
  const CardComponent = cardComponents[cardType] || SkeletonBlogCard;

  const isOfficer = cardType === "officer";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <div
        className={
          gridClassName ||
          (isOfficer
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[1.5rem] gap-y-[2rem]"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6")
        }
      >
        {Array.from({ length: count }).map((_, i) => (
          <motion.div key={i} variants={itemVariants}>
            <CardComponent />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
