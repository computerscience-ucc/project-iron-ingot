import { motion } from 'framer-motion';
import MemberCarousel from './MemberCarousel';
import PersonCard from './PersonCard';
import NameOnlyList from './NameOnlyList';

const cardPop = {
  initial: { opacity: 0, scale: 0.85, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const anyPhoto = (arr) => arr?.some((m) => !!m.photo) ?? false;

const DepartmentSection = ({ dept, onPersonClick, CAROUSEL_THRESHOLD }) => {
  const count = dept.members?.length || 0;
  const hasPhotos = anyPhoto(dept.members);
  const isCarousel = hasPhotos && count >= CAROUSEL_THRESHOLD;

  return (
    <motion.div
      variants={cardPop}
      className="w-full bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-header-color/20 transition-colors"
    >
      {/* dept header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-header-color to-button-color" />
        <p className="text-base font-semibold text-header-color">{dept.departmentName}</p>
        <span className="text-xs text-white/30 ml-auto">{count} members</span>
      </div>

      {isCarousel ? (
        <MemberCarousel members={dept.members} onPersonClick={onPersonClick} />
      ) : hasPhotos ? (
        <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-wrap justify-center gap-6">
          {dept.members?.map((m, i) => (
            <PersonCard
              key={i}
              name={m.name}
              subtitle={m.role || 'Member'}
              photo={m.photo}
              onClick={onPersonClick ? () => onPersonClick({ name: m.name, photo: m.photo, subtitle: m.role || 'Member' }) : undefined}
            />
          ))}
        </motion.div>
      ) : (
        <NameOnlyList items={dept.members?.map((m) => ({ name: m.name, subtitle: m.role || 'Member' })) || []} />
      )}
    </motion.div>
  );
};

export default DepartmentSection;
