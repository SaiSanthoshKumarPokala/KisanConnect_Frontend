import { useState } from "react";

function VehicleBadge({ vehicleType }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px]"
      style={{
        background: "rgba(0, 0, 0, 0.6)",
        borderColor: "rgba(255, 240, 133, 0.34)",
        color: "#FFF085",
      }}
    >
      {vehicleType}
    </span>
  );
}

export default function TransportCard({ vehicle, onViewDetails }) {
  const [btnHover, setBtnHover] = useState(false);
  const ownerInitial = vehicle?.owner?.charAt(0)?.toUpperCase() || "O";
  const reviewCount = vehicle?.reviewCount || "2,000";
  const subtitle = vehicle.description || "Dependable transport support for farm pickup and delivery routes.";

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-[18px] border bg-black font-montserrat transition-all duration-200 hover:-translate-y-1"
      style={{
        borderColor: "#d4af37",
        boxShadow:
          "0 0 0 1px rgba(212, 175, 55, 0.26), 0 12px 28px rgba(0, 0, 0, 0.42)",
      }}
    >
      <div
        className="relative h-36 border-b bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${vehicle.image})`,
          borderColor: "rgba(201, 168, 76, 0.2)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
        <div className="absolute left-3 top-3 z-10">
          <VehicleBadge vehicleType={vehicle.vehicleType} />
        </div>
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-[11px] text-white/80">
          <span className="text-gold">•</span>
          <span>{vehicle.location}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[15px] font-bold leading-tight text-white">{vehicle.name}</div>
            <div className="mt-1 line-clamp-2 text-[11px] font-medium leading-5 text-white/55">{subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-[12px] border border-gold/20 bg-[#050505] px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF085] to-[#D4AF37] text-[12px] font-extrabold text-black">
            {ownerInitial}
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.5px] text-white/50">Operator</div>
            <div className="text-[13px] font-semibold text-white/80">{vehicle.owner}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-[16px] font-black leading-none text-[#FFF085]">
              {String(vehicle.price).replace("Rs. ", "₹")}
            </div>
            <div className="mt-1 text-[9px] text-white/45">per km</div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-[15px] font-black leading-none text-white">
              {vehicle.capacity || "—"}
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Capacity</div>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <button
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            onClick={() => onViewDetails && onViewDetails(vehicle)}
            disabled={vehicle.availability === "Booked"}
            style={{
              width: "100%",
              background: vehicle.availability === "Booked" ? "transparent" : btnHover ? "#ffffff" : "#D4AF37",
              color: vehicle.availability === "Booked" ? "rgba(255,255,255,0.5)" : "#0a1a0c",
              border: vehicle.availability === "Booked" ? "1px solid rgba(212, 175, 55, 0.28)" : "none",
              padding: "9px 0",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: vehicle.availability === "Booked" ? "not-allowed" : "pointer",
              transition: "background 0.18s, transform 0.18s ease, box-shadow 0.18s ease",
              letterSpacing: 0.2,
              whiteSpace: "nowrap",
              transform: btnHover ? "translateY(-1px)" : "translateY(0)",
              boxShadow: btnHover ? "0 10px 20px rgba(255, 240, 133, 0.18)" : "none",
            }}
          >
            {vehicle.availability === "Booked" ? "Booked" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
