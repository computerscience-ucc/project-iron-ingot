const NameOnlyList = ({ items }) => (
  <div className="flex flex-wrap justify-center gap-3 max-w-3xl m-auto">
    {items.map((item, i) => (
      <div key={i} className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center w-full md:w-auto md:min-w-[130px]">
        <p className="text-md font-semibold text-white leading-tight">{item.name}</p>
        {item.subtitle && <p className="text-[11px] text-header-color mt-0.5 leading-tight">{item.subtitle}</p>}
      </div>
    ))}
  </div>
);

export default NameOnlyList;
