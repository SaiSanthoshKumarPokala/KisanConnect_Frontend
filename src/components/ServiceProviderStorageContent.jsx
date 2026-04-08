import { useState } from "react";
import { farmerStorageTheme as C } from "./farmerStorageTheme";
import ModuleHeader from "./ModuleHeader";
import AddModuleCard from "./AddModuleCard";

function StatusBadge({ status }) {
  const cfg = {
    available: { bg: C.availBg, color: C.availText, border: "#2a5a2a", label: "Available" },
    limited: { bg: C.amberDim, color: C.gold, border: "#5a4a1a", label: "Limited Space" },
    full: { bg: C.redDim, color: C.redText, border: "#5a2a2a", label: "Full" },
  }[status];

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

function StorageCard({ storage, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);

  const fillPct = storage.capacity > 0
    ? Math.round(((storage.capacity - storage.available) / storage.capacity) * 100)
    : 0;

  const barColor =
    storage.status === "full"
      ? C.redText
      : storage.status === "limited"
        ? C.gold
        : C.greenLight;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.bgCardHover : C.bgCard,
        border: `1px solid ${hovered ? "#f1d86a" : "#d4af37"}`,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 0 0 1px rgba(241, 216, 106, 0.36), 0 18px 40px rgba(0, 0, 0, 0.5), 0 0 28px rgba(212, 175, 55, 0.16)"
          : "0 0 0 1px rgba(212, 175, 55, 0.26), 0 12px 28px rgba(0, 0, 0, 0.42)",
        transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hovered ? "rgba(0,0,0,0.4)" : "transparent",
          backdropFilter: hovered ? "blur(4px)" : "none",
          WebkitBackdropFilter: hovered ? "blur(4px)" : "none",
          opacity: hovered ? 1 : 0,
          transition: "all 0.2s ease-in-out",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <div style={{ display: "flex", gap: 12, width: "100%", justifyContent: "center", transform: hovered ? "translateY(0)" : "translateY(10px)", transition: "transform 0.3s ease-out" }}>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(storage); }}
            style={{
              flex: 1,
              minHeight: 40,
              background: "#FFF085",
              color: "#111111",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(storage.id); }}
            style={{
              flex: 1,
              minHeight: 40,
              background: "#ef4444",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            Delete
          </button>
        </div>
      </div>

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
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.42) 100%)",
          }}
        />

        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 1 }}>
          <StatusBadge status={storage.status} />
        </div>
      </div>

      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { val: `Rs.${storage.price}`, sub: "per day/ton" },
            { val: storage.available > 0 ? `${storage.available}T` : "-", sub: "available" },
            { val: `${storage.capacity}T`, sub: "total cap." },
          ].map((s) => (
            <div
              key={s.sub}
              style={{
                background: "#050505",
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "9px 6px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: C.goldLight }}>{s.val}</div>
              <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Capacity used</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: barColor }}>{fillPct}%</span>
          </div>
          <div style={{ background: "#050505", borderRadius: 4, height: 4, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ width: `${fillPct}%`, height: "100%", background: barColor, borderRadius: 4, transition: "width 0.4s ease" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceProviderStorageContent({
  storages = [],
  onOpenForm,
  onEdit,
  onDelete,
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
          style={{
            flex: 1,
            padding: "24px",
            background: "#081D0C",
          }}
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
                  key={storage.id}
                  storage={storage}
                  onEdit={onEdit}
                  onDelete={onDelete}
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
