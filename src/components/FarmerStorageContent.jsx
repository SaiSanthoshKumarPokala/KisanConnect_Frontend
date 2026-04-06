import { useState } from "react";
import { farmerStorageTheme as C } from "./farmerStorageTheme";
import ModuleHeader from "./ModuleHeader";
import ModuleFilters from "./ModuleFilters";

function Stars({ rating }) {
  return (
    <span style={{ color: C.gold, fontSize: 12, letterSpacing: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ opacity: i <= Math.round(rating) ? 1 : 0.2 }}>*</span>
      ))}
    </span>
  );
}

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

function StorageCard({ storage, onViewDetails }) {
  const [hovered, setHovered] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const fillPct = storage.capacity > 0
    ? Math.round(((storage.capacity - storage.available) / storage.capacity) * 100)
    : 100;

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
      }}
    >
      <div
        style={{
          height: 128,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${C.border}`,
          backgroundImage: `url(${storage.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.42) 100%)" }} />
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 1 }}>
          <StatusBadge status={storage.status} />
        </div>
        <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", alignItems: "center", gap: 4, color: C.textSub, fontSize: 11, zIndex: 1 }}>
          <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
            <path d="M12 2C8.5 2 5.5 4.8 5.5 8.5C5.5 13.5 12 21 12 21S18.5 13.5 18.5 8.5C18.5 4.8 15.5 2 12 2Z" fill={C.gold} opacity="0.7" />
            <circle cx="12" cy="8.5" r="2" fill="#081D0C" />
          </svg>
          {storage.distance} away
        </div>
      </div>

      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <div>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: C.goldLight, lineHeight: 1.3, marginBottom: 4 }}>
            {storage.name}
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
              <path d="M12 2C8.5 2 5.5 4.8 5.5 8.5C5.5 13.5 12 21 12 21S18.5 13.5 18.5 8.5C18.5 4.8 15.5 2 12 2Z" stroke={C.textMuted} strokeWidth="2" />
            </svg>
            {storage.location}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #FFF085 0%, #D4AF37 100%)", color: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
            {storage.owner?.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Owner</div>
            <div style={{ fontSize: 13, color: C.textSub, fontWeight: 600, lineHeight: 1.2 }}>{storage.owner}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { val: `Rs.${storage.price}`, sub: "per day/ton" },
            { val: storage.available > 0 ? `${storage.available}T` : "-", sub: "available" },
            { val: `${storage.capacity}T`, sub: "total cap." },
          ].map((s) => (
            <div key={s.sub} style={{ background: "#050505", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 6px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 700, color: C.goldLight }}>{s.val}</div>
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 2 }}>
          <div>
            <Stars rating={storage.rating} />
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
              {storage.rating} reviews: {storage.reviews}
            </div>
          </div>

          <button
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            onClick={() => onViewDetails(storage)}
            disabled={storage.status === "full"}
            style={{
              background: storage.status === "full" ? "transparent" : btnHover ? "#ffffff" : C.gold,
              color: storage.status === "full" ? C.textMuted : "#0a1a0c",
              border: storage.status === "full" ? `1px solid ${C.border}` : "none",
              padding: "9px 18px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: storage.status === "full" ? "not-allowed" : "pointer",
              transition: "background 0.18s, transform 0.18s ease, box-shadow 0.18s ease",
              letterSpacing: 0.2,
              whiteSpace: "nowrap",
              transform: btnHover ? "translateY(-1px)" : "translateY(0)",
              boxShadow: btnHover ? "0 10px 20px rgba(255, 240, 133, 0.18)" : "none",
            }}
          >
            {storage.status === "full" ? "Storage Full" : "View Details ->"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "#050505",
  border: "1px solid rgba(212, 175, 55, 0.22)",
  borderRadius: 12,
  padding: "12px 14px",
  color: "#ffffff",
  fontSize: 13,
  outline: "none",
  fontFamily: "'Montserrat', sans-serif",
};

export default function FarmerStorageContent({
  storages,
  search,
  setSearch,
  activeFilter,
  setActiveFilter,
  sortBy,
  setSortBy,
  onOpenSidebar,
}) {
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [bookHover, setBookHover] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState("about");
  const [bookingForm, setBookingForm] = useState({
    startDate: "",
    endDate: "",
    cropName: "",
    estimatedWeight: "",
    storageDays: "",
    transportMode: "",
    pickupLocation: "",
    contactNumber: "",
    specialHandling: "",
    notes: "",
  });
  const filters = ["All", "Available", "Nearby (<10 km)", "Low Price", "High Capacity", "Top Rated"];

  const resetBookingForm = () => {
    setBookingForm({
      startDate: "",
      endDate: "",
      cropName: "",
      estimatedWeight: "",
      storageDays: "",
      transportMode: "",
      pickupLocation: "",
      contactNumber: "",
      specialHandling: "",
      notes: "",
    });
  };

  const handleBookingInput = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = () => {
    const requiredFields = [
      bookingForm.startDate,
      bookingForm.endDate,
      bookingForm.cropName,
      bookingForm.estimatedWeight,
      bookingForm.storageDays,
      bookingForm.transportMode,
      bookingForm.pickupLocation,
      bookingForm.contactNumber,
    ];

    if (requiredFields.some((value) => !String(value).trim())) {
      window.alert("Please fill in all required booking details.");
      return;
    }

    window.alert(`Booking request sent successfully to ${selectedStorage.owner} for ${selectedStorage.name}.`);
    setActiveDetailTab("about");
    resetBookingForm();
    setSelectedStorage(null);
  };

  const filtered = storages
    .filter((s) => {
      if (activeFilter === "Available") return s.status === "available";
      if (activeFilter === "Nearby (<10 km)") return parseFloat(s.distance) < 10;
      if (activeFilter === "Low Price") return s.price <= 10;
      if (activeFilter === "High Capacity") return s.capacity >= 1000;
      if (activeFilter === "Top Rated") return s.rating >= 4.5;
      return true;
    })
    .filter(
      (s) =>
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <>
      <style>{`
        input::placeholder { color: rgba(255, 255, 255, 0.58) !important; }
        textarea::placeholder { color: rgba(255, 255, 255, 0.58) !important; }
        .kc-search-input::placeholder { color: rgba(17, 17, 17, 0.55) !important; }
        select option { background: #050505; color: #ffffff; }
        .kc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 18px; }
        @media (max-width: 600px) {
          .kc-grid { grid-template-columns: 1fr; }
          .kc-header-pad { padding: 12px 14px !important; }
          .kc-filters-pad { padding: 10px 14px !important; }
          .kc-results-pad { padding: 16px 14px !important; }
        }
        @media (min-width: 601px) and (max-width: 1024px) {
          .kc-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .kc-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.76);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 300;
        }
        .kc-modal-panel {
          width: min(1080px, 100%);
          max-height: min(90vh, 980px);
          overflow-y: auto;
          background: #000000;
          border: 1px solid rgba(212, 175, 55, 0.32);
          border-radius: 22px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
        }
        .kc-modal-grid { display: grid; grid-template-columns: 1.15fr 1fr; }
        .kc-gallery-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .kc-booking-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 860px) {
          .kc-modal-grid { grid-template-columns: 1fr; }
          .kc-booking-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <ModuleHeader title="Cold Storage" search={search} onSearchChange={setSearch} onOpenSidebar={onOpenSidebar} />
        <ModuleFilters filters={filters} activeFilter={activeFilter} setActiveFilter={setActiveFilter} hideStateDropdown={true} />

        <div className="kc-results-pad" style={{ flex: 1, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 700, color: C.goldLight }}>
              {filtered.length} storage{filtered.length !== 1 ? "s" : ""} found
            </span>
            <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 10 }}>
              - {activeFilter === "Low Price"
                ? "sorted by price"
                : activeFilter === "Top Rated"
                  ? "sorted by rating"
                  : activeFilter === "Nearby (<10 km)"
                    ? "sorted by distance"
                    : activeFilter === "High Capacity"
                      ? "filtered by high capacity"
                      : activeFilter === "Available"
                        ? "showing available only"
                        : `sorted by ${sortBy}`}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" style={{ margin: "0 auto 14px", display: "block", opacity: 0.2 }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={C.textMuted} strokeWidth="1.5" />
              </svg>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: C.textSub, fontWeight: 600 }}>No storages found</div>
              <div style={{ fontSize: 13, color: C.textMuted, marginTop: 6 }}>Try adjusting your filters or search</div>
            </div>
          ) : (
            <div className="kc-grid">
              {filtered.map((s) => (
                <StorageCard
                  key={s.id}
                  storage={s}
                  onViewDetails={(storage) => {
                    setSelectedStorage(storage);
                    setActiveImage(storage.gallery?.[0] || storage.image);
                    setActiveDetailTab("about");
                    resetBookingForm();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedStorage && (
        <div className="kc-modal-overlay" onClick={() => setSelectedStorage(null)}>
          <div className="kc-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 14px 0 14px", gap: 12 }}>
              <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: "fit-content",
                    maxWidth: "100%",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    padding: 4,
                    display: "flex",
                    gap: 4,
                    backdropFilter: "blur(12px)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  {[
                    { id: "about", label: "About Cold Storage" },
                    { id: "book", label: "Book Now" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDetailTab(tab.id)}
                      style={{
                        border: "none",
                        borderRadius: 999,
                        padding: "10px 16px",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 700,
                        color: activeDetailTab === tab.id ? "#111111" : "#FFF085",
                        background: activeDetailTab === tab.id
                          ? "linear-gradient(135deg, #D4AF37 0%, #FFF085 100%)"
                          : "transparent",
                        transition: "all 0.18s ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedStorage(null)}
                style={{
                  border: "none",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                x
              </button>
            </div>

            <div
              className="kc-modal-grid"
              style={{
                gridTemplateColumns: activeDetailTab === "book" ? "1fr" : undefined,
              }}
            >
              {activeDetailTab === "about" && (
              <div style={{ padding: 20, paddingTop: 8, borderRight: "1px solid rgba(212, 175, 55, 0.18)" }}>
                <div
                  style={{
                    position: "relative",
                    height: 290,
                    borderRadius: 18,
                    overflow: "hidden",
                    backgroundImage: `url(${activeImage || selectedStorage.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginBottom: 14,
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.45) 100%)" }} />
                  <div style={{ position: "absolute", left: 16, bottom: 16 }}>
                    <StatusBadge status={selectedStorage.status} />
                  </div>
                </div>

                <div className="kc-gallery-row">
                  {(selectedStorage.gallery || [selectedStorage.image]).map((image, index) => (
                    <button
                      key={`${selectedStorage.id}-${index}`}
                      onClick={() => setActiveImage(image)}
                      style={{
                        border: activeImage === image ? "2px solid #E7C957" : "1px solid rgba(212, 175, 55, 0.18)",
                        borderRadius: 14,
                        overflow: "hidden",
                        padding: 0,
                        background: "#050505",
                        cursor: "pointer",
                        height: 92,
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url(${image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 16,
                    background: "#081D0C",
                    border: "1px solid rgba(212, 175, 55, 0.18)",
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div style={{ color: "#E7C957", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                    About This Storage
                  </div>
                  <div style={{ color: C.textSub, fontSize: 14, lineHeight: 1.7 }}>
                    {selectedStorage.description}
                  </div>
                </div>
              </div>
              )}

              <div
                style={{
                  padding: 24,
                  paddingTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  alignItems: activeDetailTab === "book" ? "center" : "stretch",
                }}
              >
                {activeDetailTab === "about" && (
                  <>
                    <div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 26, fontWeight: 800, color: "#E7C957", lineHeight: 1.15 }}>
                    {selectedStorage.name}
                  </div>
                  <div style={{ marginTop: 8, color: C.textSub, fontSize: 14 }}>
                    {selectedStorage.location} - {selectedStorage.distance} away
                  </div>
                    </div>

                    <div
                  style={{
                    background: "#081D0C",
                    border: "1px solid rgba(212, 175, 55, 0.18)",
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      paddingBottom: 14,
                      marginBottom: 14,
                      borderBottom: "1px solid rgba(212, 175, 55, 0.12)",
                    }}
                  >
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #FFF085 0%, #D4AF37 100%)",
                        color: "#111111",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 18,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {selectedStorage.owner?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.6 }}>
                        Owner
                      </div>
                      <div style={{ color: "#ffffff", fontSize: 16, fontWeight: 700, marginTop: 2 }}>
                        {selectedStorage.owner}
                      </div>
                    </div>
                  </div>

                  {[
                    { label: "Price", value: `Rs.${selectedStorage.price} per day/ton` },
                    { label: "Available", value: `${selectedStorage.available}T` },
                    { label: "Total Capacity", value: `${selectedStorage.capacity}T` },
                    { label: "Established", value: selectedStorage.established },
                    { label: "Hours", value: selectedStorage.operatingHours },
                  ].map((item, index, arr) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                        padding: "10px 0",
                        borderBottom: index !== arr.length - 1 ? "1px solid rgba(212, 175, 55, 0.12)" : "none",
                      }}
                    >
                      <div style={{ fontSize: 12, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {item.label}
                      </div>
                      <div style={{ color: "#ffffff", fontSize: 14, fontWeight: 600, textAlign: "right" }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                    </div>
                  </>
                )}

                {activeDetailTab === "about" && (
                  <div
                    style={{
                      background: "#081D0C",
                      border: "1px solid rgba(212, 175, 55, 0.18)",
                      borderRadius: 16,
                      padding: 16,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ color: "#ffffff", fontWeight: 700, fontSize: 16 }}>Rating and Storage Info</div>
                      <StatusBadge status={selectedStorage.status} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <Stars rating={selectedStorage.rating} />
                      <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 14 }}>{selectedStorage.rating}</span>
                      <span style={{ color: C.textMuted, fontSize: 13 }}>from {selectedStorage.reviews} reviews</span>
                    </div>
                    <div style={{ color: C.textSub, fontSize: 14, lineHeight: 1.6 }}>
                      Best suited for: {selectedStorage.produce}
                    </div>
                  </div>
                )}

                {activeDetailTab === "book" && (
                  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <div
                      style={{
                        width: "min(760px, 100%)",
                        background: "linear-gradient(180deg, rgba(16, 31, 21, 0.96) 0%, rgba(7, 13, 9, 0.98) 100%)",
                        border: "1px solid rgba(212, 175, 55, 0.24)",
                        borderRadius: 24,
                        padding: 24,
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
                      }}
                    >
                    <div>
                      <div style={{ color: "#FFF085", fontSize: 18, fontWeight: 800 }}>
                        Booking Details
                      </div>
                      <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>
                        Add the crop, schedule, and handling details before sending the request.
                      </div>
                    </div>

                    <div className="kc-booking-grid">
                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Start Date</span>
                        <input type="date" value={bookingForm.startDate} onChange={(e) => handleBookingInput("startDate", e.target.value)} style={inputStyle} />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>End Date</span>
                        <input type="date" value={bookingForm.endDate} onChange={(e) => handleBookingInput("endDate", e.target.value)} style={inputStyle} />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Crop Name</span>
                        <input type="text" placeholder="Tomato, grapes, chilli..." value={bookingForm.cropName} onChange={(e) => handleBookingInput("cropName", e.target.value)} style={inputStyle} />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Crop Weight Estimate</span>
                        <input type="text" placeholder="Ex: 1200 kg or 12T" value={bookingForm.estimatedWeight} onChange={(e) => handleBookingInput("estimatedWeight", e.target.value)} style={inputStyle} />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>No. of Days</span>
                        <input type="number" min="1" placeholder="Storage duration" value={bookingForm.storageDays} onChange={(e) => handleBookingInput("storageDays", e.target.value)} style={inputStyle} />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Transport Mode</span>
                        <select value={bookingForm.transportMode} onChange={(e) => handleBookingInput("transportMode", e.target.value)} style={inputStyle}>
                          <option value="">Select transport</option>
                          <option value="Mini Truck">Mini Truck</option>
                          <option value="Pickup Van">Pickup Van</option>
                          <option value="Tractor Trolley">Tractor Trolley</option>
                          <option value="Reefer Vehicle">Reefer Vehicle</option>
                          <option value="Self Delivery">Self Delivery</option>
                        </select>
                      </label>
                    </div>

                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Pickup or Farm Location</span>
                      <input type="text" placeholder="Village, farm address, or mandi point" value={bookingForm.pickupLocation} onChange={(e) => handleBookingInput("pickupLocation", e.target.value)} style={inputStyle} />
                    </label>

                    <div className="kc-booking-grid">
                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Contact Number</span>
                        <input type="tel" placeholder="Enter phone number" value={bookingForm.contactNumber} onChange={(e) => handleBookingInput("contactNumber", e.target.value)} style={inputStyle} />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Special Handling</span>
                        <input type="text" placeholder="Humidity control, fragile load, etc." value={bookingForm.specialHandling} onChange={(e) => handleBookingInput("specialHandling", e.target.value)} style={inputStyle} />
                      </label>
                    </div>

                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Additional Notes</span>
                      <textarea rows={3} placeholder="Mention preferred loading time, crop condition, or extra requests." value={bookingForm.notes} onChange={(e) => handleBookingInput("notes", e.target.value)} style={{ ...inputStyle, resize: "vertical", minHeight: 88 }} />
                    </label>

                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                      <button
                        onClick={() => {
                          setActiveDetailTab("about");
                          resetBookingForm();
                        }}
                        style={{
                          border: "1px solid rgba(212, 175, 55, 0.28)",
                          background: "transparent",
                          color: "#FFF085",
                          borderRadius: 12,
                          padding: "11px 16px",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBookingSubmit}
                        style={{
                          border: "none",
                          background: "linear-gradient(135deg, #FFF085 0%, #D4AF37 100%)",
                          color: "#111111",
                          borderRadius: 12,
                          padding: "11px 18px",
                          fontSize: 13,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        Book For Now
                      </button>
                    </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
