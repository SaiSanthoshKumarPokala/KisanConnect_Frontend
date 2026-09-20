import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function BookingRow({ booking, onDecide }) {
  const statusColors = {
    Pending:  { color: "text-[#D4AF37]", border: "border-[#D4AF37]/40",  bg: "bg-[#D4AF37]/[0.08]" },
    Accepted: { color: "text-[#4ade80]", border: "border-[#4ade80]/40",  bg: "bg-[#4ade80]/[0.08]" },
    Rejected: { color: "text-[#f87171]", border: "border-[#f87171]/40", bg: "bg-[#f87171]/[0.08]" },
  };
  const sc = statusColors[booking.status] || statusColors.Pending;
  const initials = (booking.farmerName || "FA")
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div
      className={`mb-2 rounded-[10px] border p-[10px_12px] ${sc.bg} ${sc.border}`}
    >
      <div className={`flex items-start gap-2.5 ${booking.status === "Pending" ? "mb-2" : "mb-0"}`}>
        <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/20 text-[11px] font-extrabold text-gold">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="m-0 text-[13px] font-bold text-white">{booking.farmerName}</p>
            <span
              className={`shrink-0 rounded-full border px-1.75 py-0.5 text-[10px] font-bold ${sc.color} ${sc.border} ${sc.bg}`}
            >
              {booking.status}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-white/50">
            {booking.farmerContact}
          </p>
          <p className="mt-1 text-xs text-white/60">
            📅 {fmt(booking.startDate)} → {fmt(booking.endDate)}
          </p>
          {booking.deliveryAddress && (
            <p className="mt-0.5 text-[11px] text-white/45">
              📍 {booking.deliveryAddress}
            </p>
          )}
        </div>
      </div>
      {booking.status === "Pending" && (
        <div className="ml-10 flex gap-2">
          <button
            type="button"
            onClick={() => onDecide(booking._id, "Accepted")}
            className="flex cursor-pointer items-center gap-1 rounded-lg border-none bg-[#16a34a] px-3 py-1.5 text-[11px] font-bold text-white transition hover:brightness-110"
          >
            <CheckCircleIcon className="size-3.25" /> Accept
          </button>
          <button
            type="button"
            onClick={() => onDecide(booking._id, "Rejected")}
            className="flex cursor-pointer items-center gap-1 rounded-lg border-none bg-[#dc2626] px-3 py-1.5 text-[11px] font-bold text-white transition hover:brightness-110"
          >
            <XCircleIcon className="size-3.25" /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

export default function RentalsServiceCard({ item, onEdit, onDelete, onDecideBooking }) {
  const [showBookings, setShowBookings] = useState(false);
  const bookings = item.bookings || [];
  const pending  = bookings.filter((b) => b.status === "Pending").length;
  const accepted = bookings.filter((b) => b.status === "Accepted").length;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[#d4af37] bg-black font-montserrat shadow-[0_0_0_1px_rgba(212,175,55,0.26),0_12px_28px_rgba(0,0,0,0.42)]">
      {/* Image */}
      <div
        className="relative h-40 border-b border-[#c9a84c]/20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: item.image ? `url("${item.image}")` : "linear-gradient(135deg, #1a3a1a 0%, #050505 100%)",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/10 to-black/60" />
        <div className="absolute left-3 top-3 z-1 rounded-full border border-[#FFF085]/35 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#FFF085]">
          {item.category}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="mb-1 text-[15px] font-bold text-white">{item.name}</div>
          <div className="text-xs text-white/60">{item.location}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-[#d4af37]/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">Rs. {item.price}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Per Day</div>
          </div>
          <div className="rounded-lg border border-[#d4af37]/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">{item.category}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Category</div>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-white/70">{item.description}</p>

        {/* Application summary pills */}
        {bookings.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.75 text-[11px] font-semibold text-gold">
              {pending} Pending
            </span>
            <span className="rounded-full border border-[#4ade80]/40 bg-[#4ade80]/10 px-2.5 py-0.75 text-[11px] font-semibold text-[#4ade80]">
              {accepted} Accepted
            </span>
            <span className="rounded-full border border-white/10 px-2.5 py-0.75 text-[11px] text-white/40">
              {bookings.length} total
            </span>
          </div>
        )}

        {/* Toggle applications */}
        {bookings.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowBookings((v) => !v)}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border-none bg-linear-to-br from-gold to-[#FFF085] px-3 py-2.25 text-xs font-bold text-[#111111] transition hover:brightness-105"
          >
            {showBookings ? "Hide" : "View"} Farmer Applications
            <ChevronDownIcon className={`size-3.5 transition-transform duration-200 ${showBookings ? "rotate-180" : "rotate-0"}`} />
          </button>
        ) : (
          <div className="w-full rounded-[10px] border border-white/10 p-2 text-center text-xs text-white/30">
            No applications yet
          </div>
        )}

        {/* Applications list */}
        {showBookings && bookings.length > 0 && (
          <div className="border-t border-gold/20 pt-2.5">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[2px] text-gold">
              Farmer Applications
            </p>
            {bookings.map((b) => (
              <BookingRow key={b._id} booking={b} onDecide={onDecideBooking} />
            ))}
          </div>
        )}

        {/* Always-visible Edit / Delete buttons */}
        <div className="mt-auto flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FFF085] text-sm font-bold text-black shadow-lg shadow-black/30 transition hover:brightness-95"
          >
            <PencilIcon className="size-4" /> Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(item._id || item.id)}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-black/30 transition hover:bg-red-500"
          >
            <TrashIcon className="size-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}