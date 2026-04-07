import { useState } from "react";

function CategoryBadge({ category }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px]"
      style={{
        background: "rgba(0, 0, 0, 0.56)",
        borderColor: "rgba(255, 240, 133, 0.34)",
        color: "#FFF085",
      }}
    >
      {category}
    </span>
  );
}

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-[2px] text-[12px] text-gold">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? "opacity-100" : "opacity-20"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function RentalsCard({ item, onViewDetails }) {
  const [btnHover, setBtnHover] = useState(false);
  const ownerInitial = item?.owner?.charAt(0)?.toUpperCase() || "O";

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
          backgroundImage: `url(${item.image})`,
          borderColor: "rgba(201, 168, 76, 0.2)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/55" />
        <div className="absolute left-3 top-3 z-10">
          <CategoryBadge category={item.category} />
        </div>
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-[11px] text-white/80">
          <span className="text-gold">●</span>
          <span>{item.location}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <div className="mb-1 text-[15px] font-bold leading-tight text-white">{item.name}</div>
          <div className="text-xs text-white/60">Rs. {item.price} / day</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF085] to-[#D4AF37] text-[12px] font-extrabold text-black">
            {ownerInitial}
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.5px] text-white/50">Owner</div>
            <div className="text-[13px] font-semibold text-white/80">{item.owner}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">{item.horsepower} HP</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Power</div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">{item.rating}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Rating</div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">{item.availability}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Status</div>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <RatingStars rating={item.rating} />
              <div className="mt-1 text-[11px] text-white/50">{item.rating} out of 5 rating</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Status: </span>
              <span className={`text-[12px] font-black ${item.availability === "Booked" ? "text-red-400" : "text-green-400"}`}>
                {item.availability}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              onClick={() => onViewDetails && onViewDetails(item)}
              disabled={item.availability === "Booked"}
              style={{
                flex: 1,
                background: item.availability === "Booked" ? "transparent" : btnHover ? "#ffffff" : "#D4AF37",
                color: item.availability === "Booked" ? "rgba(255,255,255,0.5)" : "#0a1a0c",
                border: item.availability === "Booked" ? `1px solid rgba(212, 175, 55, 0.28)` : "none",
                padding: "9px 0",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: item.availability === "Booked" ? "not-allowed" : "pointer",
                transition: "background 0.18s, transform 0.18s ease, box-shadow 0.18s ease",
                letterSpacing: 0.2,
                whiteSpace: "nowrap",
                transform: btnHover ? "translateY(-1px)" : "translateY(0)",
                boxShadow: btnHover ? "0 10px 20px rgba(255, 240, 133, 0.18)" : "none",
              }}
            >
              {item.availability === "Booked" ? "Booked" : "Rent Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
