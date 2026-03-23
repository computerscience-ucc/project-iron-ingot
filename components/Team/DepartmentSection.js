import { motion } from "framer-motion";
import OfficerCard from "../Home/MeetCouncil/OfficerCard";

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const DepartmentSection = ({ dept, onPersonClick }) => {

  return (
    <motion.div
      className="flex flex-col w-full"
    >
      {/* dept header */}
      <h3 className="text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-[1.2rem]">
        {dept.departmentName}
      </h3>

      <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[1.5rem] gap-y-[2.5rem]">
        {dept.members?.map((m, i) => (
          <OfficerCard
            key={i}
            name={m.name}
            role={m.role || "Member"}
            photo={m.photo || "/mascot/grad-bot.png"}
            imageClassName={m.photo ? "object-cover" : "object-contain p-[3rem] opacity-30"}
            className="w-full"
            onClick={onPersonClick ? () => onPersonClick({ name: m.name, photo: m.photo, subtitle: m.role || "Member" }) : undefined}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default DepartmentSection;
