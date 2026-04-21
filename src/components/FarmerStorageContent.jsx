import { useState } from "react";
import { farmerStorageTheme as C } from "./farmerStorageTheme";
import ModuleHeader from "./ModuleHeader";
import ModuleFilters from "./ModuleFilters";
import { UseAppContext } from "../context/AppContext";

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

function StatusBadge({ status }) {
  const cfg = {
    available: { bg: C.availBg,  color: C.availText, border: "#2a5a2a", label: "Available" },
    limited:   { bg: C.amberDim, color: C.gold,       border: "#5a4a1a", label: "Limited Space" },
    full:      { bg: C.redDim,   color: C.redText,    border: "#5a2a2a", label: "Full" },
  }[status] || { bg: C.availBg, color: C.availText, border: "#2a5a2a", label: status };

  return (
    <span
      style={{
        background: cfg.bg, color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontSize: 10, fontWeight: 600,
        padding: "3px 8px", borderRadius: 4,
        letterSpacing: 0.6, textTransform: "uppercase",
      }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Derive display status from capacity (no static status field) ─────────────
function getDisplayStatus(storage, availableForDates) {
  if (availableForDates !== null) {
    if (availableForDates <= 0) return "full";
    if (availableForDates < storage.capacity * 0.3) return "limited";
    return "available";
  }
  return "available";
}

function StorageCard({ storage, onViewDetails }) {
  const [hovered, setHovered] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const displayStatus = storage.status || "available";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.bgCardHover : C.bgCard,
        border: `1px solid ${hovered ? "#f1d86a" : "#d4af37"}`,
        borderRadius: 14, overflow: "hidden",
        boxShadow: hovered
          ? "0 0 0 1px rgba(241, 216, 106, 0.36), 0 18px 40px rgba(0, 0, 0, 0.5), 0 0 28px rgba(212, 175, 55, 0.16)"
          : "0 0 0 1px rgba(212, 175, 55, 0.26), 0 12px 28px rgba(0, 0, 0, 0.42)",
        transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
        display: "flex", flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 128, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderBottom: `1px solid ${C.border}`,
          backgroundImage: storage.images && storage.images.length > 0 ? `url("${storage.images[0]}")` : "linear-gradient(135deg, #2a5a2a 0%, #081D0C 100%)",
          backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.42) 100%)" }} />
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 1 }}>
          <StatusBadge status={displayStatus} />
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { val: `Rs.${storage.price}`, sub: "per day/ton" },
            { val: `${storage.capacity}T`, sub: "total cap." },
            { val: `Rs.${storage.price * storage.capacity}`, sub: "max/day" },
          ].map((s) => (
            <div key={s.sub} style={{ background: "#050505", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 6px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 700, color: C.goldLight }}>{s.val}</div>
              <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <button
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            onClick={() => onViewDetails(storage)}
            style={{
              background: btnHover ? "#ffffff" : C.gold,
              color: "#0a1a0c",
              border: "none",
              padding: "9px 18px", borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              transition: "background 0.18s, transform 0.18s ease, box-shadow 0.18s ease",
              whiteSpace: "nowrap",
              transform: btnHover ? "translateY(-1px)" : "translateY(0)",
              boxShadow: btnHover ? "0 10px 20px rgba(255, 240, 133, 0.18)" : "none",
            }}
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const { addBooking, axios } = UseAppContext();
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("about");
  const [submitting, setSubmitting] = useState(false);

  // Availability state (populated when farmer picks dates)
  const [availCheck, setAvailCheck] = useState(null); // { availableTonnes, occupiedTonnes, totalCapacity }
  const [checkingAvail, setCheckingAvail] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    startDate: "", endDate: "",
    farmerName: "", farmerLocation: "", farmerContact: "",
    cropName: "", quantity: "", notes: "",
  });

  const filters = ["All", "Available", "Low Price", "High Capacity", "Top Rated"];

  const resetBookingForm = () => {
    setBookingForm({ startDate: "", endDate: "", farmerName: "", farmerLocation: "", farmerContact: "", cropName: "", quantity: "", notes: "" });
    setAvailCheck(null);
  };

  const handleBookingInput = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
    // Reset availability check when dates change
    if (field === "startDate" || field === "endDate") {
      setAvailCheck(null);
    }
  };

  // ── Check availability when both dates are set ────────────────────────────
  const handleCheckAvailability = async () => {
    if (!bookingForm.startDate || !bookingForm.endDate) {
      return alert("Please select both start and end dates first.");
    }
    if (new Date(bookingForm.endDate) <= new Date(bookingForm.startDate)) {
      return alert("End date must be after start date.");
    }
    setCheckingAvail(true);
    try {
      const { data } = await axios.post("/api/coldstorage/check", {
        storageId: selectedStorage._id,
        startDate: bookingForm.startDate,
        endDate:   bookingForm.endDate,
      });
      if (data.success) {
        setAvailCheck(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setCheckingAvail(false);
    }
  };

  // ── Submit booking application ─────────────────────────────────────────────
  const handleBookingSubmit = async () => {
    const { startDate, endDate, farmerName, farmerLocation, farmerContact, cropName, quantity } = bookingForm;
    if (!startDate || !endDate || !farmerName || !farmerLocation || !farmerContact || !cropName || !quantity) {
      return alert("Please fill in all required booking details.");
    }
    if (!availCheck) {
      return alert("Please check availability for your selected dates first.");
    }
    if (Number(quantity) > availCheck.availableTonnes) {
      return alert(`Only ${availCheck.availableTonnes} tonnes available for those dates. Please reduce your quantity.`);
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/coldstorage/apply", {
        storageId:      selectedStorage._id,
        farmerName, farmerLocation, farmerContact,
        cropName,
        startDate, endDate,
        quantity:       Number(quantity),
      });

      if (data.success) {
        addBooking({
          module: "Cold Storage",
          itemName: selectedStorage.name,
          providerName: selectedStorage.owner,
          image: selectedStorage.images?.[0] || "/coldstorage.svg",
          priceLabel: `Rs.${selectedStorage.price} / day / ton`,
          summary: `${cropName} • ${quantity}T • ${startDate} to ${endDate}`,
          notificationTitle: "Cold storage booking request",
          notificationDetail: `${cropName} storage request for ${selectedStorage.name} from ${startDate} to ${endDate}.`,
        });
        alert(`Booking application sent successfully to ${selectedStorage.name}.`);
        setActiveDetailTab("about");
        resetBookingForm();
        setSelectedStorage(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Filter and sort ───────────────────────────────────────────────────────
  const filtered = storages
    .filter((s) => {
      if (activeFilter === "Available") return s.status !== "inactive";
      if (activeFilter === "Low Price") return s.price <= 10;
      if (activeFilter === "High Capacity") return s.capacity >= 1000;
      return true;
    })
    .filter(
      (s) =>
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      return 0;
    });

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

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
          position: fixed; inset: 0;
          background: rgba(0, 0, 0, 0.76);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px; z-index: 300;
        }
        .kc-modal-panel {
          width: min(1080px, 100%); max-height: min(90vh, 980px);
          overflow-y: auto; background: #000000;
          border: 1px solid rgba(212, 175, 55, 0.32);
          border-radius: 22px; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
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
                  key={s._id || s.id}
                  storage={s}
                  onViewDetails={(storage) => {
                    setSelectedStorage(storage);
                    setActiveImage(storage.images?.[0] || null);
                    setActiveDetailTab("about");
                    resetBookingForm();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Detail / Booking Modal ── */}
      {selectedStorage && (
        <div className="kc-modal-overlay" onClick={() => setSelectedStorage(null)}>
          <div className="kc-modal-panel" onClick={(e) => e.stopPropagation()}>
            {/* Tab strip */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 14px 0 14px", gap: 12 }}>
              <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: "fit-content", maxWidth: "100%",
                    borderRadius: 999, background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    padding: 4, display: "flex", gap: 4,
                    backdropFilter: "blur(12px)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  {[{ id: "about", label: "About Cold Storage" }, { id: "book", label: "Book Now" }].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveDetailTab(tab.id); resetBookingForm(); }}
                      style={{
                        border: "none", borderRadius: 999,
                        padding: "10px 16px", cursor: "pointer",
                        fontSize: 13, fontWeight: 700,
                        color: activeDetailTab === tab.id ? "#111111" : "#FFF085",
                        background: activeDetailTab === tab.id
                          ? "linear-gradient(135deg, #D4AF37 0%, #FFF085 100%)"
                          : "transparent",
                        transition: "all 0.18s ease", whiteSpace: "nowrap",
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
                  border: "none", background: "rgba(255,255,255,0.08)",
                  color: "#ffffff", width: 34, height: 34,
                  borderRadius: "50%", cursor: "pointer", fontSize: 18,
                }}
              >
                ×
              </button>
            </div>

            <div className="kc-modal-grid" style={{ gridTemplateColumns: activeDetailTab === "book" ? "1fr" : undefined }}>
              {/* About tab — image gallery */}
              {activeDetailTab === "about" && (
                <div style={{ padding: 20, paddingTop: 8, borderRight: "1px solid rgba(212, 175, 55, 0.18)" }}>
                  <div
                    style={{
                      position: "relative", height: 290, borderRadius: 18, overflow: "hidden",
                      backgroundImage: activeImage ? `url("${activeImage}")` : "linear-gradient(135deg, #2a5a2a 0%, #081D0C 100%)",
                      backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", marginBottom: 14,
                    }}
                  >
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.45) 100%)" }} />
                    {selectedStorage.images?.length > 0 && (
                      <div style={{ position: "absolute", left: 16, bottom: 16 }}>
                        <StatusBadge status={selectedStorage.status || "available"} />
                      </div>
                    )}
                    {(!selectedStorage.images || selectedStorage.images.length === 0) && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" opacity="0.3">
                          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#D4AF37" strokeWidth="1.5" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {selectedStorage.images?.length > 0 && (
                    <div className="kc-gallery-row">
                      {selectedStorage.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(image)}
                          style={{
                            border: activeImage === image ? "2px solid #E7C957" : "1px solid rgba(212,175,55,0.18)",
                            borderRadius: 14, overflow: "hidden", padding: 0,
                            background: "#050505", cursor: "pointer", height: 92,
                          }}
                        >
                          <div style={{ width: "100%", height: "100%", backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                        </button>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 16, background: "#081D0C", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 16, padding: 16 }}>
                    <div style={{ color: "#E7C957", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>About This Storage</div>
                    <div style={{ color: C.textSub, fontSize: 14, lineHeight: 1.7 }}>
                      {selectedStorage.description || "A reliable cold storage facility. Select Book Now to check availability and apply for your dates."}
                    </div>
                  </div>
                </div>
              )}

              {/* Right panel */}
              <div style={{ padding: 24, paddingTop: 8, display: "flex", flexDirection: "column", gap: 18, alignItems: activeDetailTab === "book" ? "center" : "stretch" }}>
                {activeDetailTab === "about" && (
                  <>
                    <div>
                      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 26, fontWeight: 800, color: "#E7C957", lineHeight: 1.15 }}>
                        {selectedStorage.name}
                      </div>
                      <div style={{ marginTop: 8, color: C.textSub, fontSize: 14 }}>{selectedStorage.location}</div>
                    </div>

                    <div style={{ background: "#081D0C", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 16, padding: 16 }}>
                      {[
                        { label: "Price",           value: `Rs.${selectedStorage.price} per day/ton` },
                        { label: "Total Capacity",  value: `${selectedStorage.capacity}T` },
                      ].map((item, index, arr) => (
                        <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "10px 0", borderBottom: index !== arr.length - 1 ? "1px solid rgba(212,175,55,0.12)" : "none" }}>
                          <div style={{ fontSize: 12, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</div>
                          <div style={{ color: "#ffffff", fontSize: 14, fontWeight: 600, textAlign: "right" }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* ── Book Now form ── */}
                {activeDetailTab === "book" && (
                  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <div
                      style={{
                        width: "min(760px, 100%)",
                        background: "linear-gradient(180deg, rgba(16,31,21,0.96) 0%, rgba(7,13,9,0.98) 100%)",
                        border: "1px solid rgba(212,175,55,0.24)", borderRadius: 24, padding: 24,
                        display: "flex", flexDirection: "column", gap: 16,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
                      }}
                    >
                      <div>
                        <div style={{ color: "#FFF085", fontSize: 18, fontWeight: 800 }}>Booking Details</div>
                        <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>
                          Select your dates, check availability, then fill your details to send the application.
                        </div>
                      </div>

                      {/* Dates + availability check */}
                      <div className="kc-booking-grid">
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Start Date *</span>
                          <input type="date" value={bookingForm.startDate} onChange={(e) => handleBookingInput("startDate", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>End Date *</span>
                          <input type="date" value={bookingForm.endDate} onChange={(e) => handleBookingInput("endDate", e.target.value)} style={inputStyle} />
                        </label>
                      </div>

                      {/* Check availability button */}
                      <button
                        onClick={handleCheckAvailability}
                        disabled={checkingAvail || !bookingForm.startDate || !bookingForm.endDate}
                        style={{
                          border: "1px solid rgba(212,175,55,0.4)", background: "transparent",
                          color: "#FFF085", borderRadius: 12, padding: "10px 16px",
                          fontSize: 13, fontWeight: 700, cursor: "pointer",
                          opacity: (!bookingForm.startDate || !bookingForm.endDate) ? 0.5 : 1,
                        }}
                      >
                        {checkingAvail ? "Checking..." : "Check Availability for Selected Dates"}
                      </button>

                      {/* Availability result */}
                      {availCheck && (
                        <div
                          style={{
                            background: availCheck.availableTonnes > 0 ? "rgba(74,222,128,0.08)" : "rgba(239,68,68,0.08)",
                            border: `1px solid ${availCheck.availableTonnes > 0 ? "rgba(74,222,128,0.4)" : "rgba(239,68,68,0.4)"}`,
                            borderRadius: 12, padding: "12px 16px",
                          }}
                        >
                          {availCheck.availableTonnes > 0 ? (
                            <div>
                              <p style={{ color: "#4ade80", fontWeight: 700, fontSize: 13, margin: 0 }}>
                                ✓ {availCheck.availableTonnes}T available for your selected dates
                              </p>
                              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: "4px 0 0" }}>
                                {availCheck.occupiedTonnes}T already booked · {availCheck.totalCapacity}T total capacity
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p style={{ color: "#f87171", fontWeight: 700, fontSize: 13, margin: 0 }}>
                                Storage is fully booked for these dates
                              </p>
                              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: "4px 0 0" }}>
                                Try different dates — capacity may be available for other periods
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Farmer details */}
                      <div className="kc-booking-grid">
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Your Name *</span>
                          <input type="text" placeholder="Full name" value={bookingForm.farmerName} onChange={(e) => handleBookingInput("farmerName", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Contact Number *</span>
                          <input type="tel" placeholder="Phone number" value={bookingForm.farmerContact} onChange={(e) => handleBookingInput("farmerContact", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Your Location *</span>
                          <input type="text" placeholder="Village / Town" value={bookingForm.farmerLocation} onChange={(e) => handleBookingInput("farmerLocation", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Crop Name *</span>
                          <input type="text" placeholder="e.g. Tomato, Chilli..." value={bookingForm.cropName} onChange={(e) => handleBookingInput("cropName", e.target.value)} style={inputStyle} />
                        </label>
                      </div>

                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>
                          Quantity Needed (tonnes) *
                          {availCheck && (
                            <span style={{ color: availCheck.availableTonnes > 0 ? "#4ade80" : "#f87171", marginLeft: 8, fontSize: 11 }}>
                              max {availCheck.availableTonnes}T available
                            </span>
                          )}
                        </span>
                        <input
                          type="number" min="1"
                          max={availCheck ? availCheck.availableTonnes : undefined}
                          placeholder={`Max ${selectedStorage.capacity}T`}
                          value={bookingForm.quantity}
                          onChange={(e) => handleBookingInput("quantity", e.target.value)}
                          style={inputStyle}
                        />
                      </label>

                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Additional Notes</span>
                        <textarea
                          rows={2}
                          placeholder="Special handling, preferred loading time, crop condition..."
                          value={bookingForm.notes}
                          onChange={(e) => handleBookingInput("notes", e.target.value)}
                          style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
                        />
                      </label>

                      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                        <button
                          onClick={() => { setActiveDetailTab("about"); resetBookingForm(); }}
                          style={{
                            border: "1px solid rgba(212,175,55,0.28)", background: "transparent",
                            color: "#FFF085", borderRadius: 12, padding: "11px 16px",
                            fontSize: 13, fontWeight: 700, cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleBookingSubmit}
                          disabled={submitting || !availCheck || availCheck.availableTonnes <= 0}
                          style={{
                            border: "none",
                            background: submitting || !availCheck || availCheck.availableTonnes <= 0
                              ? "rgba(212,175,55,0.3)"
                              : "linear-gradient(135deg, #FFF085 0%, #D4AF37 100%)",
                            color: "#111111", borderRadius: 12, padding: "11px 18px",
                            fontSize: 13, fontWeight: 800, cursor: "pointer",
                            opacity: submitting ? 0.7 : 1,
                          }}
                        >
                          {submitting ? "Sending..." : "Send Booking Request"}
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
