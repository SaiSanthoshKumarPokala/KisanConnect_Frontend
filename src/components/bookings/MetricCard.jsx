export default function MetricCard({ label, value, accent = "text-amber-200" }) {
  return (
    <div className="rounded-[18px] border border-gold/20 bg-[#050505] p-4 shadow-[0_12px_24px_rgba(0,0,0,0.24)]">
      <div className={`font-montserrat text-[24px] font-black ${accent}`}>{value}</div>
      <div className="mt-1 font-montserrat text-[11px] uppercase tracking-[0.4px] text-white/45">
        {label}
      </div>
    </div>
  );
}