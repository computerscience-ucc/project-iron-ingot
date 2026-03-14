import { MATERIAL_ICONS } from './Constants';

const MaterialsList = ({ materials }) => {
  if (!materials || materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-600 gap-2">
        <svg className="w-8 h-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <p className="text-sm">No materials listed yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {materials.map((m, i) => (
        <a
          key={i}
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-red-500/40 hover:bg-white/[0.06] transition-all"
        >
          <div className="w-9 h-9 rounded-lg bg-red-600/10 flex items-center justify-center text-red-400 group-hover:bg-red-600/20 transition-colors shrink-0 self-center">
            {MATERIAL_ICONS[m.icon] || MATERIAL_ICONS.other}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white group-hover:text-red-300 transition-colors leading-tight">{m.label}</p>
            <p className="text-[11px] text-gray-600 truncate mt-0.5">{m.url}</p>
          </div>
          <svg className="w-4 h-4 text-gray-600 group-hover:text-red-400 transition-colors shrink-0 self-center" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ))}
    </div>
  );
};

export default MaterialsList;
