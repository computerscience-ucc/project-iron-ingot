import ThesisCard from '../Card/Thesis';

const DeptSection = ({ dept, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">{dept}</h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((thesisItem, i) => (
          <ThesisCard thesis={thesisItem} key={i} />
        ))}
      </div>
    </div>
  );
};

export default DeptSection;
