export default function ProfileStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-linear-to-br from-[#111d11] via-[#0b120b] to-[#070707] px-4 py-4 shadow-[0_16px_30px_rgba(0,0,0,0.22)]">
      <div className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.24em] text-gold/55">
        {label}
      </div>
      <div className="mt-2 font-montserrat text-base font-bold text-[#fff7be]">
        {value || "—"}
      </div>
    </div>
  );
}