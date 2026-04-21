import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function BookingRow({ booking, onDecide }) {
  const statusColors = {
    Pending:  { color: "#D4AF37", border: "rgba(212,175,55,0.4)",  bg: "rgba(212,175,55,0.08)" },
    Accepted: { color: "#4ade80", border: "rgba(74,222,128,0.4)",  bg: "rgba(74,222,128,0.08)" },
    Rejected: { color: "#f87171", border: "rgba(248,113,113,0.4)", bg: "rgba(248,113,113,0.08)" },
  };
  const sc = statusColors[booking.status] || statusColors.Pending;
  const initials = (booking.farmerName || "FA")
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div
      style={{
        background: sc.bg,
        border: `1px solid ${sc.border}`,
        borderRadius: 10,
        padding: "10px 12px",
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: booking.status === "Pending" ? 8 : 0 }}>
        <div
          style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#D4AF37", fontSize: 11, fontWeight: 800, flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <p style={{ color: "#ffffff", fontWeight: 700, fontSize: 13, margin: 0 }}>{booking.farmerName}</p>
            <span
              style={{
                color: sc.color, border: `1px solid ${sc.border}`, background: sc.bg,
                fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, flexShrink: 0,
              }}
            >
              {booking.status}
            </span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, margin: "2px 0 0" }}>
            {booking.farmerContact}
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: "4px 0 0" }}>
            🌾 {booking.cropName} · {booking.estimatedWeight} · {fmt(booking.pickupDate)}
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, margin: "2px 0 0" }}>
            {booking.pickupLocation} → {booking.dropLocation}
          </p>
        </div>
      </div>
      {booking.status === "Pending" && (
        <div style={{ display: "flex", gap: 8, marginLeft: 40 }}>
          <button
            onClick={() => onDecide(booking._id, "Accepted")}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "#16a34a", color: "#ffffff", border: "none",
              borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}
          >
            <CheckCircleIcon style={{ width: 13, height: 13 }} /> Accept
          </button>
          <button
            onClick={() => onDecide(booking._id, "Rejected")}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "#dc2626", color: "#ffffff", border: "none",
              borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}
          >
            <XCircleIcon style={{ width: 13, height: 13 }} /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

export default function TransportServiceCard({ item, onEdit, onDelete, onDecideBooking }) {
  const [showBookings, setShowBookings] = useState(false);
  const bookings = item.bookings || [];
  const pending  = bookings.filter((b) => b.status === "Pending").length;
  const accepted = bookings.filter((b) => b.status === "Accepted").length;

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-[18px] border bg-black font-montserrat"
      style={{
        borderColor: "#d4af37",
        boxShadow: "0 0 0 1px rgba(212, 175, 55, 0.26), 0 12px 28px rgba(0, 0, 0, 0.42)",
      }}
    >
      {/* Image */}
      <div
        className="relative h-40 border-b bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: item.image ? `url('${item.image}')` : "none",
          background: item.image ? undefined : "linear-gradient(135deg, #1a3a1a 0%, #050505 100%)",
          borderColor: "rgba(201, 168, 76, 0.2)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
        <div className="absolute left-3 top-3 z-[1] rounded-full border border-[#FFF085]/35 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#FFF085]">
          {item.category}
        </div>
        {/* Booked badge */}
        {item.bookedToday && (
          <div className="absolute right-3 top-3 z-[1] rounded-full border border-red-400/50 bg-red-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-red-400">
            Booked Today
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="mb-1 text-[15px] font-bold text-white">{item.name}</div>
          <div className="text-xs text-white/60">{item.route}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">Rs. {item.price}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Per Km</div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">{item.capacity}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Capacity</div>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-white/70">{item.description}</p>

        {/* Application summary pills */}
        {bookings.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 600, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", padding: "3px 10px", borderRadius: 99 }}>
              {pending} Pending
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.4)", color: "#4ade80", padding: "3px 10px", borderRadius: 99 }}>
              {accepted} Accepted
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", padding: "3px 10px", borderRadius: 99 }}>
              {bookings.length} total
            </span>
          </div>
        )}

        {/* Toggle applications */}
        {bookings.length > 0 ? (
          <button
            onClick={() => setShowBookings((v) => !v)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "linear-gradient(135deg, #D4AF37 0%, #FFF085 100%)",
              color: "#111111", border: "none", borderRadius: 10,
              padding: "9px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%",
            }}
          >
            {showBookings ? "Hide" : "View"} Farmer Applications
            <ChevronDownIcon style={{ width: 14, height: 14, transform: showBookings ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
          </button>
        ) : (
          <div style={{ width: "100%", textAlign: "center", padding: "8px", color: "rgba(255,255,255,0.3)", fontSize: 12, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}>
            No applications yet
          </div>
        )}

        {/* Applications list */}
        {showBookings && bookings.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(212,175,55,0.2)", paddingTop: 10 }}>
            <p style={{ color: "#D4AF37", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
              Farmer Applications
            </p>
            {bookings.map((b) => (
              <BookingRow key={b._id} booking={b} onDecide={onDecideBooking} />
            ))}
          </div>
        )}

        {/* ── Always-visible Edit / Delete buttons ── */}
        <div className="flex gap-3 mt-auto pt-1">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#FFF085] text-sm font-bold text-black shadow-lg shadow-black/30 transition hover:brightness-95"
          >
            <PencilIcon className="size-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(item._id || item.id)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-black/30 transition hover:bg-red-500"
          >
            <TrashIcon className="size-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
