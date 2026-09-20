function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#FFF085]/34 bg-black/[0.56] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#FFF085]">
      {category}
    </span>
  );
}

export default function RentalsCard({ item, onViewDetails }) {
  // Use ownerName populated from backend — never show raw _id
  const ownerName    = item.ownerName || "Owner";
  const ownerInitial = ownerName.charAt(0).toUpperCase();
  const subtitle     = item.description || "Reliable equipment support for everyday field work.";
  const isBooked     = item.availability === "Booked";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[#d4af37] bg-black font-montserrat shadow-[0_0_0_1px_rgba(212,175,55,0.26),0_12px_28px_rgba(0,0,0,0.42)] transition-all duration-200 hover:-translate-y-1">
      {/* Image */}
      <div
        className="relative h-36 border-b border-[#c9a84c]/20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: item.image
            ? `url("${item.image}")`
            : "linear-gradient(135deg, #1a3a1a 0%, #050505 100%)",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/55" />
        <div className="absolute left-3 top-3 z-10">
          <CategoryBadge category={item.category} />
        </div>
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-[11px] text-white/80">
          <span className="text-[#d4af37]">•</span>
          <span>{item.location}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Name + description */}
        <div>
          <div className="text-[15px] font-bold leading-tight text-white">{item.name}</div>
          <div className="mt-1 line-clamp-2 text-[11px] font-medium leading-5 text-white/55">{subtitle}</div>
        </div>

        {/* Owner row */}
        <div className="flex items-center gap-3 rounded-xl border border-[#d4af37]/20 bg-[#050505] px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#FFF085] to-gold text-[12px] font-extrabold text-black">
            {ownerInitial}
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.5px] text-white/50">Owner</div>
            <div className="text-[13px] font-semibold text-white/80">{ownerName}</div>
          </div>
        </div>

        {/* Price + Status — 2 columns, no reviews */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-[#d4af37]/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-[16px] font-black leading-none text-[#FFF085]">₹{item.price}</div>
            <div className="mt-1 text-[9px] text-white/45">per day</div>
          </div>
          <div className="rounded-lg border border-[#d4af37]/20 bg-[#050505] px-2 py-3 text-center">
            <div className={`text-[15px] font-black leading-none ${isBooked ? "text-red-400" : "text-green-400"}`}>
              {isBooked ? "Booked" : "Available"}
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Status</div>
          </div>
        </div>

        {/* Rent Now */}
        <div className="mt-auto">
          <button
            type="button"
            onClick={() => !isBooked && onViewDetails && onViewDetails(item)}
            disabled={isBooked}
            className={`w-full whitespace-nowrap rounded-lg py-2.25 text-xs font-bold tracking-[0.2px] transition-all duration-180 ease-out ${
              isBooked
                ? "cursor-not-allowed border border-[#d4af37]/[0.28] bg-transparent text-white/50"
                : "cursor-pointer border-none bg-gold text-[#0a1a0c] hover:-translate-y-px hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)]"
            }`}
          >
            {isBooked ? "Currently Booked" : "Rent Now"}
          </button>
        </div>
      </div>
    </div>
  );
}