import { MapPinIcon } from "@heroicons/react/24/solid";

function StatusBadge({ status }) {
  const configs = {
    available: "border-emerald-800/80 bg-[#1a3a1a] text-[#6db86d]",
    limited: "border-amber-800/80 bg-[#3a2a0a] text-[#c9a84c]",
    full: "border-red-800/80 bg-[#3a1a1a] text-[#c96a6a]",
  };

  const labels = {
    available: "Available",
    limited: "Limited Space",
    full: "Full",
  };

  const badgeClass = configs[status] || configs.available;
  const label = labels[status] || status;

  return (
    <span
      className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${badgeClass}`}
    >
      {label}
    </span>
  );
}

export default function FarmerStorageCard({ storage, onViewDetails }) {
  const displayStatus = storage.status || "available";

  return (
    <div className="group flex flex-col overflow-hidden rounded-[14px] border border-[#d4af37] bg-black shadow-[0_0_0_1px_rgba(212,175,55,0.26),0_12px_28px_rgba(0,0,0,0.42)] transition-all duration-200 hover:border-[#f1d86a] hover:bg-[#111111] hover:shadow-[0_0_0_1px_rgba(241,216,106,0.36),0_18px_40px_rgba(0,0,0,0.5),0_0_28px_rgba(212,175,55,0.16)]">
      {/* Storage Header Image */}
      <div
        className="relative flex h-32 items-center justify-center border-b border-[#c9a84c]/20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            storage.images && storage.images.length > 0
              ? `url("${storage.images[0]}")`
              : "linear-gradient(135deg, #2a5a2a 0%, #081D0C 100%)",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/40" />
        <div className="absolute top-3 left-3 z-10">
          <StatusBadge status={displayStatus} />
        </div>
      </div>

      {/* Details Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-montserrat text-[15px] font-bold leading-snug text-white">
            {storage.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-white/60">
            <MapPinIcon className="size-3.5 shrink-0 fill-[#c9a84c]" />
            <span className="truncate">{storage.location}</span>
          </div>
        </div>

        {/* Pricing Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-[#c9a84c]/20 bg-[#050505] px-1.5 py-2">
            <div className="font-montserrat text-sm font-bold text-white">
              ₹{storage.price}
            </div>
            <div className="mt-0.5 text-[9px] uppercase tracking-wider text-white/60">
              per day/ton
            </div>
          </div>
          <div className="rounded-lg border border-[#c9a84c]/20 bg-[#050505] px-1.5 py-2">
            <div className="font-montserrat text-sm font-bold text-white">
              {storage.capacity}T
            </div>
            <div className="mt-0.5 text-[9px] uppercase tracking-wider text-white/60">
              total cap.
            </div>
          </div>
          <div className="rounded-lg border border-[#c9a84c]/20 bg-[#050505] px-1.5 py-2">
            <div className="font-montserrat text-sm font-bold text-white">
              ₹{storage.price * storage.capacity}
            </div>
            <div className="mt-0.5 text-[9px] uppercase tracking-wider text-white/60">
              max/day
            </div>
          </div>
        </div>

        {/* Card Action */}
        <div className="mt-auto flex justify-end pt-1">
          <button
            type="button"
            onClick={() => onViewDetails(storage)}
            className="cursor-pointer rounded-lg bg-[#c9a84c] px-4 py-2 text-xs font-bold text-[#0a1a0c] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)]"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}