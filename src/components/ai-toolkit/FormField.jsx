export default function FormField({ field, value, onChange }) {
  return (
    <label className="block rounded-[18px] border border-white/10 bg-[#050505] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <span className="mb-2 block font-montserrat text-sm font-bold text-gold md:text-base">
        {field.label}
      </span>
      <input
        type={field.type || "text"}
        required
        inputMode={field.type === "number" ? "decimal" : undefined}
        value={value}
        onChange={(event) => onChange(field.key, event.target.value)}
        placeholder={field.placeholder}
        className="w-full rounded-xl border border-white/20 bg-black px-4 py-3 font-montserrat text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] outline-none transition-all placeholder:text-white/40 focus:border-gold/50 [appearance:textfield] md:text-lg [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
      />
    </label>
  );
}