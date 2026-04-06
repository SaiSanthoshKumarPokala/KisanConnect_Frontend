import { MapPinIcon } from "@heroicons/react/24/outline";

export default function ModuleFilters({ filters, activeFilter, setActiveFilter, state, setState, hideStateDropdown = false }) {
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
        gap: 7,
        overflowX: "auto",
        flexShrink: 0,
      }}
    >
      {filters && filters.map((f) => (
        <button
          key={f}
          onClick={() => setActiveFilter(f)}
          style={{
            padding: "6px 15px",
            border: "none",
            background: "transparent",
            color: activeFilter === f ? "#D4AF37" : "#ffffff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
            fontFamily: "'Montserrat', sans-serif",
            transition: "all 0.15s",
            borderBottom: "2px solid transparent",
            borderRadius: 0,
            flexShrink: 0,
          }}
        >
          {f}
        </button>
      ))}

      {!hideStateDropdown && (
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div className="flex flex-row gap-2 items-center bg-[#050505] border border-gold/40 w-auto px-3 py-1 rounded-xl text-white font-montserrat">
            <MapPinIcon className="size-4 stroke-2 stroke-gold" />
            <select
              name="state"
              className="focus:outline-0 w-full font-bold bg-transparent text-white text-xs cursor-pointer"
              value={state}
              onChange={(e) => setState && setState(e.target.value)}
            >
              <option value="select">State</option>
              <option value="telangana" className="bg-[#050505] text-white">Telangana</option>
              <option value="andhra pradesh" className="bg-[#050505] text-white">Andhra Pradesh</option>
              <option value="maharashtra" className="bg-[#050505] text-white">Maharashtra</option>
              <option value="karnataka" className="bg-[#050505] text-white">Karnataka</option>
              <option value="kerala" className="bg-[#050505] text-white">Kerala</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
