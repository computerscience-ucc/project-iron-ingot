import { MATERIAL_ICONS } from "./Constants";

const MaterialsList = ({ materials }) => {
  if (!materials || materials.length === 0) {
    return (
      <p className="text-[1rem] text-[#8C8C8C] leading-relaxed py-2 font-normal mb-6">No materials listed yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 mb-10">
      {materials.map((m, i) => (
        <a
          key={i}
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 px-4 py-3.5 rounded-[6px] bg-[#1A1A1A] border border-[#2F2F2F] hover:border-[#424242] hover:bg-[#1E1E1E] transition-all"
        >
          {/* Icon Box */}
          <div className="w-10 h-10 rounded-[4px] bg-[#242424] border border-[#2F2F2F] flex items-center justify-center text-[#8C8C8C] group-hover:text-[#EFEFEF] transition-colors shrink-0">
            <div className="scale-110">
              {MATERIAL_ICONS[m.icon] || MATERIAL_ICONS.other}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[1rem] font-semibold text-[#EFEFEF] leading-tight mb-0.5">
              {m.label}
            </p>
            <p className="text-[0.875rem] text-[#8C8C8C] truncate font-normal opacity-65 leading-tight">
              {m.url}
            </p>
          </div>

          {/* External Link Icon */}
          <svg
            className="w-5 h-5 text-[#8C8C8C] group-hover:text-[#EFEFEF] transition-colors shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ))}
    </div>
  );
};

export default MaterialsList;
