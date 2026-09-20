import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddModuleCard({
  onAdd,
  title,
  subtitle,
  minHeight = 300,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onAdd}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onAdd?.();
        }
      }}
      style={{ minHeight }}
      className="group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[14px] border border-dashed border-[#c9a84c]/40 bg-transparent p-10 text-center font-montserrat transition-all duration-200 hover:border-solid hover:border-[#FFF085] hover:bg-[#FFF085]/8 hover:shadow-[0_0_0_1px_rgba(241,216,106,0.36),0_18px_40px_rgba(0,0,0,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <div className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-[#FFF085] to-gold text-[#111111] shadow-md transition-transform duration-200 group-hover:scale-105">
        <PlusIcon className="size-12 stroke-[2.5]" aria-hidden="true" />
      </div>

      <div>
        <div className="mb-2 text-lg font-bold text-[#FFF085]">
          {title}
        </div>
        <div className="text-sm font-normal text-white/60">
          {subtitle}
        </div>
      </div>
    </div>
  );
}