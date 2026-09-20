function VehicleBadge({ vehicleType }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#FFF085]/34 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#FFF085]">
      {vehicleType}
    </span>
  );
}

export default function TransportCard({ vehicle, onViewDetails }) {
  const ownerInitial = vehicle?.owner?.charAt(0)?.toUpperCase() || "O";
  const subtitle = vehicle.description || "Dependable transport support for farm pickup and delivery routes.";
  const isBooked = vehicle.availability === "Booked";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[#d4af37] bg-black font-montserrat shadow-[0_0_0_1px_rgba(212,175,55,0.26),0_12px_28px_rgba(0,0,0,0.42)] transition-all duration-200 hover:-translate-y-1">
      {/* Banner / Image Area */}
      <div
        className="relative h-36 border-b border-[#c9a84c]/20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${vehicle.image})`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/60" />
        <div className="absolute top-3 left-3 z-10">
          <VehicleBadge vehicleType={vehicle.vehicleType} />
        </div>
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-[11px] text-white/80">
          <span className="text-[#d4af37]">•</span>
          <span>{vehicle.location}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[15px] font-bold leading-tight text-white">{vehicle.name}</div>
            <div className="mt-1 line-clamp-2 text-[11px] font-medium leading-5 text-white/55">{subtitle}</div>
          </div>
        </div>

        {/* Operator Profile Row */}
        <div className="flex items-center gap-3 rounded-xl border border-[#d4af37]/20 bg-[#050505] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#FFF085] to-gold text-[12px] font-extrabold text-black">
            {ownerInitial}
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.5px] text-white/50">Operator</div>
            <div className="text-[13px] font-semibold text-white/80">{vehicle.owner}</div>
          </div>
        </div>

        {/* 2-Column Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-[#d4af37]/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-[16px] font-black leading-none text-[#FFF085]">
              {String(vehicle.price).replace("Rs. ", "₹")}
            </div>
            <div className="mt-1 text-[9px] text-white/45">per km</div>
          </div>
          <div className="rounded-lg border border-[#d4af37]/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-[15px] font-black leading-none text-white">
              {vehicle.capacity || "—"}
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Capacity</div>
          </div>
        </div>

        {/* Booking CTA */}
        <div className="mt-auto flex flex-col gap-3">
          <button
            type="button"
            onClick={() => !isBooked && onViewDetails && onViewDetails(vehicle)}
            disabled={isBooked}
            className={`w-full whitespace-nowrap rounded-lg py-2.25 text-xs font-bold tracking-[0.2px] transition-all duration-180 ease-out ${
              isBooked
                ? "cursor-not-allowed border border-[#d4af37]/[0.28] bg-transparent text-white/50"
                : "cursor-pointer border-none bg-gold text-[#0a1a0c] hover:-translate-y-px hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)]"
            }`}
          >
            {isBooked ? "Booked" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}