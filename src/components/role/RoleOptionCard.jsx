export default function RoleOptionCard({ option, isSelected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => onSelect(option)}
      className={`flex w-full cursor-pointer flex-col items-center justify-between rounded-3xl border p-6 text-center font-montserrat transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold md:min-h-90 md:w-90 ${
        isSelected
          ? "border-gold bg-black shadow-[0_16px_38px_rgba(212,175,55,0.18)]"
          : "border-white/20 bg-black/45 hover:border-gold/40 hover:bg-black/55"
      }`}
    >
      <img
        src={option.image}
        alt={option.label}
        className="h-36 w-auto object-contain"
      />
      <div className="mt-6 flex flex-col items-center gap-3">
        <h2 className="text-2xl font-extrabold text-gold">{option.label}</h2>
        <p className="text-sm font-normal leading-7 text-white/75">{option.desc}</p>
      </div>
    </button>
  );
}