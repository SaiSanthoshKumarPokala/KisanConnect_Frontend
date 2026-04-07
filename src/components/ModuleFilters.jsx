export default function ModuleFilters({ filters, activeFilter, setActiveFilter }) {
  return (
    <div
      className="kc-filters-pad w-full"
      style={{
        background: "#000000",
        borderTop: "1px solid rgba(212, 175, 55, 0.18)",
        borderBottom: "none",
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

    </div>
  );
}
