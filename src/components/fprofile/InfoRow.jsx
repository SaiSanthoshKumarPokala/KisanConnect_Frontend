export default function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gold/15 bg-linear-to-r from-[#0a160d] via-[#060806] to-[#050505] px-4 py-4 shadow-[0_14px_28px_rgba(0,0,0,0.18)]">
      <div className="shrink-0 rounded-xl border border-gold/15 bg-linear-to-br from-gold/25 to-gold/10 p-2">
        <Icon className="size-5 text-gold" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.24em] text-gold/55">
          {label}
        </div>
        <div className="mt-1 truncate font-montserrat text-sm font-semibold text-white/90">
          {value || "Not added yet"}
        </div>
      </div>
    </div>
  );
}