export default function InputField({ label, icon: Icon, children }) {
  return (
    <label className="flex flex-col items-start gap-1.5 font-montserrat">
      <span className="text-base font-bold text-gold">{label}</span>
      <div className="flex w-full items-center gap-2 rounded-[14px] border border-gold/20 bg-white px-4 py-3 shadow-inner">
        {Icon && <Icon className="size-5 shrink-0 fill-gold" aria-hidden="true" />}
        {children}
      </div>
    </label>
  );
}