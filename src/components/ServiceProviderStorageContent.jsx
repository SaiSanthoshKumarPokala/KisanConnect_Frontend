import { useState } from "react";
import { farmerStorageTheme as C } from "./farmerStorageTheme";
import ModuleHeader from "./ModuleHeader";
import AddModuleCard from "./AddModuleCard";
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

function StatusBadge({ status }) {
  const cfg = {
    available: { bg: C.availBg,  color: C.availText, border: "#2a5a2a", label: "Available" },
    limited:   { bg: C.amberDim, color: C.gold,       border: "#5a4a1a", label: "Limited Space" },
    full:      { bg: C.redDim,   color: C.redText,    border: "#5a2a2a", label: "Full" },
  }[status] || { bg: C.availBg, color: C.availText, border: "#2a5a2a", label: status };

  return (
    <span
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontSize: 10,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 4,
        letterSpacing: 0.6,
        textTransform: "uppercase",
      }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Farmer Application Row ───────────────────────────────────────────────────
function BookingRow({ booking, onDecide }) {
  const statusColors = {
    Pending:  { color: "#D4AF37", border: "rgba(212,175,55,0.4)",  bg: "rgba(212,175,55,0.08)" },
    Accepted: { color: "#4ade80", border: "rgba(74,222,128,0.4)",  bg: "rgba(74,222,128,0.08)" },
    Rejected: { color: "#f87171", border: "rgba(248,113,113,0.4)", bg: "rgba(248,113,113,0.08)" },
  };
  const sc = statusColors[booking.status] || statusColors.Pending;
  const initials = booking.farmerName
    ? booking.farmerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "FA";

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

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
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(212,175,55,0.2)",
            border: "1px solid rgba(212,175,55,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#D4AF37",
            fontSize: 11,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <p style={{ color: "#ffffff", fontWeight: 700, fontSize: 13, margin: 0 }}>{booking.farmerName}</p>
            <span
              style={{
                color: sc.color,
                border: `1px solid ${sc.border}`,
                background: sc.bg,
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: 99,
                flexShrink: 0,
              }}
            >
              {booking.status}
            </span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, margin: "2px 0 0" }}>
            {booking.farmerLocation} · {booking.farmerContact}
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: "4px 0 0" }}>
            🌾 {booking.cropName} · {booking.quantity}T · {fmt(booking.startDate)} → {fmt(booking.endDate)}
          </p>
        </div>
      </div>
      {booking.status === "Pending" && (
        <div style={{ display: "flex", gap: 8, marginLeft: 42 }}>
          <button
            onClick={() => onDecide(booking._id, "Accepted")}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "#16a34a", color: "#ffffff",
              border: "none", borderRadius: 8,
              padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}
          >
            <CheckCircleIcon style={{ width: 13, height: 13 }} /> Accept
          </button>
          <button
            onClick={() => onDecide(booking._id, "Rejected")}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "#dc2626", color: "#ffffff",
              border: "none", borderRadius: 8,
              padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}
          >
            <XCircleIcon style={{ width: 13, height: 13 }} /> Reject
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
    fillPct >= 100 ? C.redText : fillPct >= 70 ? C.gold : C.greenLight;

  // Derive display status
  const displayStatus =
    fillPct >= 100 ? "full" : fillPct >= 70 ? "limited" : "available";

  return (
    <div
      style={{
        background: C.bgCard,
        border: "1px solid #d4af37",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(212, 175, 55, 0.26), 0 12px 28px rgba(0, 0, 0, 0.42)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image area */}
      <div
        style={{
          height: 128,
          position: "relative",
          borderBottom: `1px solid ${C.border}`,
          background: "linear-gradient(135deg, #2a5a2a 0%, #081D0C 100%)",
          backgroundImage: storage.images && storage.images.length > 0 ? `url(${storage.images[0]})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.42) 100%)" }} />
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 1 }}>
          <StatusBadge status={displayStatus} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.goldLight, lineHeight: 1.3, marginBottom: 4 }}>
            {storage.name}
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
              <path d="M12 2C8.5 2 5.5 4.8 5.5 8.5C5.5 13.5 12 21 12 21S18.5 13.5 18.5 8.5C18.5 4.8 15.5 2 12 2Z" stroke={C.textMuted} strokeWidth="2" />
            </svg>
            {storage.location}
          </div>
        </div>

        {/* Price / available / capacity */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { val: `Rs.${storage.price}`, sub: "per day/ton" },
            { val: storage.availableNow !== undefined ? `${storage.availableNow}T` : `${storage.capacity}T`, sub: "available now" },
            { val: `${storage.capacity}T`, sub: "total cap." },
          ].map((s) => (
            <div key={s.sub} style={{ background: "#050505", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.goldLight }}>{s.val}</div>
              <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Capacity bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Capacity used</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: barColor }}>{fillPct}%</span>
          </div>
          <div style={{ background: "#050505", borderRadius: 4, height: 4, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ width: `${fillPct}%`, height: "100%", background: barColor, borderRadius: 4, transition: "width 0.4s ease" }} />
          </div>
        </div>

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
              padding: "9px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
              width: "100%",
            }}
          >
            {showBookings ? "Hide" : "View"} Farmer Applications
            <ChevronDownIcon style={{ width: 14, height: 14, transform: showBookings ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
          </button>
        ) : (
          <div style={{ width: "100%", textAlign: "center", padding: "8px", color: "rgba(255,255,255,0.3)", fontSize: 12, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}>
            No applications yet — farmers will apply soon
          </div>
        )}

        {/* Applications list */}
        {showBookings && bookings.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(212,175,55,0.2)", paddingTop: 12 }}>
            <p style={{ color: "#D4AF37", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>
              Farmer Applications
            </p>
            {bookings.map((b) => (
              <BookingRow key={b._id} booking={b} onDecide={onDecideBooking} />
            ))}
          </div>
        )}

        {/* ── Always-visible Edit / Delete buttons ── */}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button
            onClick={() => onEdit(storage)}
            style={{
              flex: 1, minHeight: 40,
              background: "#FFF085", color: "#111111",
              border: "none", borderRadius: 10,
              fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(storage._id)}
            style={{
              flex: 1, minHeight: 40,
              background: "#ef4444", color: "#ffffff",
              border: "none", borderRadius: 10,
              fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}
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
    <>
      <style>{`
        .kc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 18px;
        }
        @media (max-width: 600px) {
          .kc-grid { grid-template-columns: 1fr; }
          .kc-results-pad { padding: 16px 14px !important; }
        }
        @media (min-width: 601px) and (max-width: 1024px) {
          .kc-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <ModuleHeader
          title="My Storage"
          search={search}
          onSearchChange={setSearch}
          onOpenSidebar={onOpenSidebar}
        />

        <div
          className="kc-results-pad"
          style={{ flex: 1, padding: "24px", background: "#000000" }}
        >
          {storages.length === 0 ? (
            <div style={{ maxWidth: 400, margin: "0 auto" }}>
              <AddModuleCard
                onAdd={onOpenForm}
                title="Add Cold Storage"
                subtitle="Create your first cold storage listing"
              />
            </div>
          ) : filteredStorages.length === 0 ? (
            <div style={{ maxWidth: 400, margin: "0 auto", color: C.textMuted, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>No matching storages</div>
              <div style={{ fontSize: 14 }}>Try another search term or clear the search field.</div>
            </div>
          ) : (
            <div className="kc-grid">
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
    </>
  );
}
