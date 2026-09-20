export default function ModuleFilters({ filters, activeFilter, setActiveFilter }) {
  return (
    <div className="kc-filters-pad flex w-full shrink-0 items-center justify-between gap-4 overflow-x-auto border-t border-gold/18 bg-black px-6 py-2.75">
      <div className="flex w-fit shrink-0 gap-1 rounded-full border border-white/18 bg-white/8 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
        {filters &&
          filters.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`cursor-pointer whitespace-nowrap rounded-full border-none px-4 py-2 font-montserrat text-[13px] font-bold transition-all duration-180 ease-out ${
                  isActive
                    ? "bg-linear-to-br from-gold to-[#FFF085] text-[#111111]"
                    : "bg-transparent text-[#FFF085] hover:text-white"
                }`}
              >
                {f}
              </button>
            );
          })}
      </div>
    </div>
  );
}