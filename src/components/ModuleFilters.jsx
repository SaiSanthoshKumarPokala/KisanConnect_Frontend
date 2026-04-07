export default function ModuleFilters({ filters, activeFilter, setActiveFilter, showBooked, setShowBooked }) {
  const bookedToggleVisible = typeof showBooked === "boolean" && typeof setShowBooked === "function";

  return (
    <div
      className="kc-filters-pad w-full"
      style={{
        background: "#000000",
        borderTop: "1px solid rgba(212, 175, 55, 0.18)",
        borderBottom: "1px solid rgba(212, 175, 55, 0.28)",
        padding: "11px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        overflowX: "auto",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "fit-content",
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.18)",
          padding: 4,
          display: "flex",
          gap: 4,
          backdropFilter: "blur(12px)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        {filters && filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Montserrat', sans-serif",
              color: activeFilter === f ? "#111111" : "#FFF085",
              background: activeFilter === f
                ? "linear-gradient(135deg, #D4AF37 0%, #FFF085 100%)"
                : "transparent",
              transition: "all 0.18s ease",
              whiteSpace: "nowrap",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {bookedToggleVisible && (
        <div style={{ flexShrink: 0 }}>
          <button
            onClick={() => setShowBooked(!showBooked)}
            style={{
              border: showBooked ? "1px solid #D4AF37" : "1px solid rgba(212, 175, 55, 0.3)",
              borderRadius: 999,
              padding: "8px 20px",
              background: showBooked ? "rgba(212, 175, 55, 0.15)" : "rgba(255,255,255,0.05)",
              color: showBooked ? "#FFF085" : "#ffffff",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Montserrat', sans-serif",
              cursor: "pointer",
              transition: "all 0.18s ease",
              boxShadow: showBooked ? "0 0 12px rgba(212, 175, 55, 0.2) inset" : "none",
            }}
          >
            {showBooked ? "Show All" : "Booked"}
          </button>
        </div>
      )}
    </div>
  );
}
