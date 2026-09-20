import { useState } from "react";
import ModuleHeader from "../ModuleHeader";
import AddModuleCard from "../AddModuleCard";
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

function StatusBadge({ status }) {
  const cfg = {
    available: { bg: "bg-[#1a3a1a]",  color: "text-[#6db86d]", border: "border-[#2a5a2a]", label: "Available" },
    limited:   { bg: "bg-[#3a2a0a]",  color: "text-[#c9a84c]", border: "border-[#5a4a1a]", label: "Limited Space" },
    full:      { bg: "bg-[#3a1a1a]",  color: "text-[#c96a6a]", border: "border-[#5a2a2a]", label: "Full" },
  }[status] || { bg: "bg-[#1a3a1a]", color: "text-[#6db86d]", border: "border-[#2a5a2a]", label: status };

  return (
    <span
      className={`rounded-sm border px-2 py-0.75 text-[10px] font-semibold uppercase tracking-[0.6px] ${cfg.bg} ${cfg.color} ${cfg.border}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Farmer Application Row ───────────────────────────────────────────────────
function BookingRow({ booking, onDecide }) {
  const statusColors = {
    Pending:  { color: "text-[#D4AF37]", border: "border-[#D4AF37]/40",  bg: "bg-[#D4AF37]/[0.08]" },
    Accepted: { color: "text-[#4ade80]", border: "border-[#4ade80]/40",  bg: "bg-[#4ade80]/[0.08]" },
    Rejected: { color: "text-[#f87171]", border: "border-[#f87171]/40", bg: "bg-[#f87171]/[0.08]" },
  };
  const sc = statusColors[booking.status] || statusColors.Pending;
  const initials = booking.farmerName
    ? booking.farmerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "FA";

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div
      className={`mb-2 rounded-[10px] border p-[10px_12px] ${sc.bg} ${sc.border}`}
    >
      <div className="mb-1.5 flex items-start gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/20 text-[11px] font-extrabold text-gold">
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
            {booking.farmerLocation} · {booking.farmerContact}
          </p>
          <p className="mt-1 text-xs text-white/60">
            🌾 {booking.cropName} · {booking.quantity}T · {fmt(booking.startDate)} → {fmt(booking.endDate)}
          </p>
        </div>
      </div>
      {booking.status === "Pending" && (
        <div className="ml-10.5 flex gap-2">
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

// ─── Storage Card ─────────────────────────────────────────────────────────────
function StorageCard({ storage, onEdit, onDelete, onDecideBooking }) {
  const [showBookings, setShowBookings] = useState(false);

  const bookings = storage.bookings || [];
  const pending  = bookings.filter((b) => b.status === "Pending").length;
  const accepted = bookings.filter((b) => b.status === "Accepted").length;

  const fillPct = storage.capacity > 0
    ? Math.round(((storage.capacity - (storage.availableNow ?? storage.capacity)) / storage.capacity) * 100)
    : 0;

  const barColor =
    fillPct >= 100 ? "#c96a6a" : fillPct >= 70 ? "#c9a84c" : "#6db86d";

  // Derive display status
  const displayStatus =
    fillPct >= 100 ? "full" : fillPct >= 70 ? "limited" : "available";

  return (
    <div className="flex flex-col overflow-hidden rounded-[14px] border border-[#d4af37] bg-black shadow-[0_0_0_1px_rgba(212,175,55,0.26),0_12px_28px_rgba(0,0,0,0.42)]">
      {/* Image area */}
      <div
        className="relative h-32 border-b border-[#c9a84c]/20 bg-cover bg-center"
        style={{
          backgroundImage: storage.images && storage.images.length > 0 ? `url(${storage.images[0]})` : "linear-gradient(135deg, #2a5a2a 0%, #081D0C 100%)",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/18 to-black/42" />
        <div className="absolute top-3 left-3 z-1">
          <StatusBadge status={displayStatus} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-[16px_18px]">
        <div>
          <div className="mb-1 text-[15px] font-bold leading-[1.3] text-[#FFF085]">
            {storage.name}
          </div>
          <div className="flex items-center gap-1 text-xs text-white/50">
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
              <path d="M12 2C8.5 2 5.5 4.8 5.5 8.5C5.5 13.5 12 21 12 21S18.5 13.5 18.5 8.5C18.5 4.8 15.5 2 12 2Z" stroke="currentColor" strokeWidth="2" />
            </svg>
            {storage.location}
          </div>
        </div>

        {/* Price / available / capacity */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: `Rs.${storage.price}`, sub: "per day/ton" },
            { val: storage.availableNow !== undefined ? `${storage.availableNow}T` : `${storage.capacity}T`, sub: "available now" },
            { val: `${storage.capacity}T`, sub: "total cap." },
          ].map((s) => (
            <div key={s.sub} className="rounded-lg border border-[#c9a84c]/20 bg-[#050505] p-[9px_6px] text-center">
              <div className="text-sm font-bold text-[#FFF085]">{s.val}</div>
              <div className="mt-0.5 text-[9px] uppercase tracking-[0.5px] text-white/50">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Capacity bar */}
        <div>
          <div className="mb-1.25 flex justify-between">
            <span className="text-[10px] uppercase tracking-[0.5px] text-white/50">Capacity used</span>
            <span className="text-[10px] font-bold" style={{ color: barColor }}>{fillPct}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-sm border border-[#c9a84c]/20 bg-[#050505]">
            <div
              className="h-full rounded-sm transition-[width] duration-400 ease-out"
              style={{ width: `${fillPct}%`, backgroundColor: barColor }}
            />
          </div>
        </div>

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
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border-none bg-linear-to-br from-gold to-[#FFF085] p-[9px_12px] text-xs font-bold text-[#111111] transition hover:brightness-105"
          >
            {showBookings ? "Hide" : "View"} Farmer Applications
            <ChevronDownIcon className={`size-3.5 transition-transform duration-200 ${showBookings ? "rotate-180" : "rotate-0"}`} />
          </button>
        ) : (
          <div className="w-full rounded-[10px] border border-white/10 p-2 text-center text-xs text-white/30">
            No applications yet — farmers will apply soon
          </div>
        )}

        {/* Applications list */}
        {showBookings && bookings.length > 0 && (
          <div className="border-t border-gold/20 pt-3">
            <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[2px] text-gold">
              Farmer Applications
            </p>
            {bookings.map((b) => (
              <BookingRow key={b._id} booking={b} onDecide={onDecideBooking} />
            ))}
          </div>
        )}

        {/* ── Always-visible Edit / Delete buttons ── */}
        <div className="mt-1 flex gap-2.5">
          <button
            type="button"
            onClick={() => onEdit(storage)}
            className="flex min-h-10 flex-1 cursor-pointer items-center justify-center rounded-[10px] border-none bg-[#FFF085] text-[13px] font-bold text-[#111111] transition hover:brightness-95"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(storage._id)}
            className="flex min-h-10 flex-1 cursor-pointer items-center justify-center rounded-[10px] border-none bg-[#ef4444] text-[13px] font-bold text-white transition hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ServiceProviderStorageContent({
  storages = [],
  onOpenForm,
  onEdit,
  onDelete,
  onDecideBooking,
  onOpenSidebar,
}) {
  const [search, setSearch] = useState("");

  const filteredStorages = storages.filter((storage) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      storage.name.toLowerCase().includes(query) ||
      storage.location.toLowerCase().includes(query)
    );
  });

  return (
    <main className="flex flex-1 flex-col font-montserrat min-w-0">
      <ModuleHeader
        title="My Storage"
        search={search}
        onSearchChange={setSearch}
        onOpenSidebar={onOpenSidebar}
      />

      <div className="flex-1 bg-black p-4 sm:p-6">
        {storages.length === 0 ? (
          <div className="mx-auto max-w-100">
            <AddModuleCard
              onAdd={onOpenForm}
              title="Add Cold Storage"
              subtitle="Create your first cold storage listing"
            />
          </div>
        ) : filteredStorages.length === 0 ? (
          <div className="mx-auto max-w-100 text-center text-white/50">
            <div className="mb-2.5 text-lg font-bold text-white">No matching storages</div>
            <div className="text-sm">Try another search term or clear the search field.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(290px,1fr))]">
            {filteredStorages.map((storage) => (
              <StorageCard
                key={storage._id || storage.id}
                storage={storage}
                onEdit={onEdit}
                onDelete={onDelete}
                onDecideBooking={onDecideBooking}
              />
            ))}
            <AddModuleCard
              onAdd={onOpenForm}
              title="Add Cold Storage"
              subtitle="Create one more cold storage listing"
            />
          </div>
        )}
      </div>
    </main>
  );
}