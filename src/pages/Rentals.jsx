import { useMemo, useState, useEffect } from "react";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import RentalsCard from "../components/RentalsCard";

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

export default function Rentals() {
  const { isOpen, setIsOpen, axios, addBooking, refreshNotifications } = UseAppContext();
  const [search, setSearch]           = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [rentalsData, setRentalsData] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [dateCheck, setDateCheck]     = useState(null);
  const [checkingDate, setCheckingDate] = useState(false);
  const filters = ["All", "Tractors", "Harvesters", "Implements"];

  const [selectedItem, setSelectedItem]         = useState(null);
  const [activeDetailTab, setActiveDetailTab]   = useState("about");
  const [bookingForm, setBookingForm] = useState({
    farmerName: "", farmerContact: "",
    startDate: "", endDate: "",
    expectedHours: "", deliveryAddress: "", notes: "",
  });

  // ── Fetch real listings from backend ─────────────────────────────────────
  const fetchRentals = async () => {
    try {
      const { data } = await axios.get("/api/rentals/all");
      if (data.success) setRentalsData(data.rentals);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRentals(); }, []);

  const resetBookingForm = () => {
    setBookingForm({ farmerName: "", farmerContact: "", startDate: "", endDate: "", expectedHours: "", deliveryAddress: "", notes: "" });
    setDateCheck(null);
  };

  const handleBookingInput = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
    if (field === "startDate" || field === "endDate") setDateCheck(null);
  };

  // ── Check date range availability ─────────────────────────────────────────
  const handleCheckDate = async () => {
    if (!bookingForm.startDate || !bookingForm.endDate) {
      return alert("Please select both start and end dates first.");
    }
    if (new Date(bookingForm.endDate) <= new Date(bookingForm.startDate)) {
      return alert("End date must be after start date.");
    }
    setCheckingDate(true);
    try {
      const { data } = await axios.post("/api/rentals/checkdate", {
        rentalId:  selectedItem._id,
        startDate: bookingForm.startDate,
        endDate:   bookingForm.endDate,
      });
      if (data.success) {
        setDateCheck({ available: data.available, message: data.message });
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setCheckingDate(false);
    }
  };

  // ── Submit rental application ─────────────────────────────────────────────
  const handleBookingSubmit = async () => {
    const { farmerName, farmerContact, startDate, endDate, deliveryAddress } = bookingForm;
    if (!farmerName || !farmerContact || !startDate || !endDate || !deliveryAddress) {
      return alert("Please fill in all required rental details.");
    }
    if (!dateCheck) {
      return alert("Please check availability for your selected dates before submitting.");
    }
    if (!dateCheck.available) {
      return alert("This machine is already booked for those dates. Please choose different dates.");
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/rentals/apply", {
        rentalId:        selectedItem._id,
        farmerName, farmerContact, startDate, endDate,
        expectedHours:   bookingForm.expectedHours,
        deliveryAddress, notes: bookingForm.notes,
      });

      if (data.success) {
        addBooking({
          module: "Rentals",
          itemName: selectedItem.name,
          providerName: selectedItem.owner,
          image: selectedItem.image,
          priceLabel: `₹${selectedItem.price} / day`,
          summary: `${startDate} to ${endDate} • ${deliveryAddress}`,
          notificationTitle: "Rental booking request",
          notificationDetail: `${selectedItem.name} requested from ${startDate} to ${endDate} for delivery at ${deliveryAddress}.`,
        });
        alert(`Rental request sent successfully to ${selectedItem.name}.`);
        if (refreshNotifications) refreshNotifications();
        setActiveDetailTab("about");
        resetBookingForm();
        setSelectedItem(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRentals = useMemo(() => {
    return rentalsData.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        (item.name || "").toLowerCase().includes(query) ||
        (item.location || "").toLowerCase().includes(query) ||
        (item.description || "").toLowerCase().includes(query);
      const matchesCategory =
        activeFilter === "All" ||
        (item.category || "").toLowerCase().includes(activeFilter.toLowerCase().replace(/s$/, ""));
      return matchesSearch && matchesCategory;
    });
  }, [activeFilter, search, rentalsData]);

  const resultLabel = activeFilter === "All" ? "showing all equipment" : `showing ${activeFilter.toLowerCase()}`;

  return (
    <>
      <style>{`
        input::placeholder { color: rgba(255, 255, 255, 0.58) !important; }
        textarea::placeholder { color: rgba(255, 255, 255, 0.58) !important; }
        .kc-search-input::placeholder { color: rgba(17, 17, 17, 0.55) !important; }
        select option { background: #050505; color: #ffffff; }
        .kc-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.76); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 300; }
        .kc-modal-panel { width: min(1080px, 100%); max-height: min(90vh, 980px); overflow-y: auto; background: #000000; border: 1px solid rgba(212,175,55,0.32); border-radius: 22px; box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
        .kc-modal-grid { display: grid; grid-template-columns: 1.15fr 1fr; }
        .kc-booking-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 860px) { .kc-modal-grid { grid-template-columns: 1fr; } .kc-booking-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="min-h-dvh bg-black">
        <SideNav />
        <div className={`flex min-h-dvh flex-col transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
          <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
            <ModuleHeader title="Machine Rentals" search={search} onSearchChange={setSearch} onOpenSidebar={() => setIsOpen(!isOpen)} />
            <ModuleFilters filters={filters} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-white font-montserrat font-bold text-lg animate-pulse">Loading rentals...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 px-6 pt-4">
                  <span className="font-montserrat text-sm font-bold text-white">
                    {filteredRentals.length} machine{filteredRentals.length !== 1 ? "s" : ""} found
                  </span>
                  <span className="font-montserrat text-xs text-white/60">· {resultLabel}</span>
                  {search.trim() && <span className="font-montserrat text-xs text-[#FFF085]">· matching "{search.trim()}"</span>}
                </div>

                {filteredRentals.length === 0 ? (
                  <div className="px-6 py-10 font-montserrat text-sm text-white/70">No machines match your current search and filters.</div>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px] p-6">
                    {filteredRentals.map((item) => (
                      <RentalsCard
                        key={item._id}
                        item={item}
                        onViewDetails={(selected) => {
                          setSelectedItem(selected);
                          setActiveDetailTab("about");
                          resetBookingForm();
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Detail / Book modal ── */}
      {selectedItem && (
        <div className="kc-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="kc-modal-panel font-montserrat" onClick={(e) => e.stopPropagation()}>
            {/* Tab strip */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 14px 0 14px", gap: 12 }}>
              <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div style={{ width: "fit-content", maxWidth: "100%", borderRadius: 999, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", padding: 4, display: "flex", gap: 4, backdropFilter: "blur(12px)" }}>
                  {[{ id: "about", label: "About Equipment" }, { id: "book", label: "Rent Now" }].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveDetailTab(tab.id); resetBookingForm(); }}
                      style={{ border: "none", borderRadius: 999, padding: "10px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, color: activeDetailTab === tab.id ? "#111111" : "#FFF085", background: activeDetailTab === tab.id ? "linear-gradient(135deg, #D4AF37 0%, #FFF085 100%)" : "transparent", transition: "all 0.18s ease", whiteSpace: "nowrap" }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} style={{ border: "none", background: "rgba(255,255,255,0.08)", color: "#ffffff", width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>×</button>
            </div>

            <div className="kc-modal-grid" style={{ gridTemplateColumns: activeDetailTab === "book" ? "1fr" : undefined }}>
              {/* About tab */}
              {activeDetailTab === "about" && (
                <div style={{ padding: 20, paddingTop: 8, borderRight: "1px solid rgba(212,175,55,0.18)" }}>
                  <div style={{ position: "relative", height: 290, borderRadius: 18, overflow: "hidden", backgroundImage: selectedItem.image ? `url(${selectedItem.image})` : "none", background: selectedItem.image ? undefined : "linear-gradient(135deg, #1a3a1a 0%, #050505 100%)", backgroundSize: "cover", backgroundPosition: "center", marginBottom: 14 }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.45) 100%)" }} />
                  </div>
                  <div style={{ marginTop: 16, background: "#081D0C", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 16, padding: 16 }}>
                    <div style={{ color: "#E7C957", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>About This Equipment</div>
                    <div style={{ color: "rgba(255,255,255,0.86)", fontSize: 15, lineHeight: 1.85 }}>{selectedItem.description}</div>
                  </div>
                </div>
              )}

              {/* Right panel */}
              <div style={{ padding: 24, paddingTop: 8, display: "flex", flexDirection: "column", gap: 18, alignItems: activeDetailTab === "book" ? "center" : "stretch" }}>
                {activeDetailTab === "about" && (
                  <>
                    <div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: "#E7C957", lineHeight: 1.15 }}>{selectedItem.name}</div>
                      <div style={{ marginTop: 8, color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{selectedItem.location}</div>
                    </div>
                    <div style={{ background: "#081D0C", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 16, padding: 16 }}>
                      {[
                        { label: "Price",    value: `Rs.${selectedItem.price} per day` },
                        { label: "Category", value: selectedItem.category },
                        { label: "Location", value: selectedItem.location },
                      ].map((item, index, arr) => (
                        <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "10px 0", borderBottom: index !== arr.length - 1 ? "1px solid rgba(212,175,55,0.12)" : "none" }}>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</div>
                          <div style={{ color: "#ffffff", fontSize: 14, fontWeight: 600, textAlign: "right" }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Booking form */}
                {activeDetailTab === "book" && (
                  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <div style={{ width: "min(760px, 100%)", background: "linear-gradient(180deg, rgba(16,31,21,0.96) 0%, rgba(7,13,9,0.98) 100%)", border: "1px solid rgba(212,175,55,0.24)", borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 20px 40px rgba(0,0,0,0.35)" }}>
                      <div>
                        <div style={{ color: "#FFF085", fontSize: 18, fontWeight: 800 }}>Rental Request Details</div>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 }}>Select your dates, check availability, then fill your details to send the request.</div>
                      </div>

                      {/* Farmer details */}
                      <div className="kc-booking-grid">
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Your Name *</span>
                          <input type="text" placeholder="Full name" value={bookingForm.farmerName} onChange={(e) => handleBookingInput("farmerName", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Contact Number *</span>
                          <input type="tel" placeholder="Your phone number" value={bookingForm.farmerContact} onChange={(e) => handleBookingInput("farmerContact", e.target.value)} style={inputStyle} />
                        </label>
                      </div>

                      {/* Date selection */}
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
                        onClick={handleCheckDate}
                        disabled={checkingDate || !bookingForm.startDate || !bookingForm.endDate}
                        style={{ border: "1px solid rgba(212,175,55,0.4)", background: "transparent", color: "#FFF085", borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: (!bookingForm.startDate || !bookingForm.endDate) ? 0.5 : 1, width: "100%" }}
                      >
                        {checkingDate ? "Checking..." : "Check Availability for Selected Dates"}
                      </button>

                      {/* Availability result */}
                      {dateCheck && (
                        <div style={{ background: dateCheck.available ? "rgba(74,222,128,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${dateCheck.available ? "rgba(74,222,128,0.4)" : "rgba(239,68,68,0.4)"}`, borderRadius: 12, padding: "12px 16px" }}>
                          <p style={{ color: dateCheck.available ? "#4ade80" : "#f87171", fontWeight: 700, fontSize: 13, margin: 0 }}>
                            {dateCheck.available ? "✓ Machine is available for your selected dates" : "✗ Machine is already booked for those dates"}
                          </p>
                          {!dateCheck.available && (
                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: "4px 0 0" }}>
                              Please select different dates and check again.
                            </p>
                          )}
                        </div>
                      )}

                      {/* Other fields */}
                      <div className="kc-booking-grid">
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Expected Hours/Day</span>
                          <input type="number" placeholder="e.g. 8" value={bookingForm.expectedHours} onChange={(e) => handleBookingInput("expectedHours", e.target.value)} style={inputStyle} />
                        </label>
                      </div>

                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Delivery Address (Farm Location) *</span>
                        <input type="text" placeholder="Village address, specific directions" value={bookingForm.deliveryAddress} onChange={(e) => handleBookingInput("deliveryAddress", e.target.value)} style={inputStyle} />
                      </label>

                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Additional Notes</span>
                        <textarea rows={3} placeholder="Any specific attachments or instructions needed?" value={bookingForm.notes} onChange={(e) => handleBookingInput("notes", e.target.value)} style={{ ...inputStyle, resize: "vertical", minHeight: 72 }} />
                      </label>

                      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                        <button
                          onClick={() => { setActiveDetailTab("about"); resetBookingForm(); }}
                          style={{ border: "1px solid rgba(212,175,55,0.28)", background: "transparent", color: "#FFF085", borderRadius: 12, padding: "11px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleBookingSubmit}
                          disabled={submitting || !dateCheck || !dateCheck.available}
                          style={{ border: "none", background: submitting || !dateCheck || !dateCheck.available ? "rgba(212,175,55,0.4)" : "linear-gradient(135deg, #FFF085 0%, #D4AF37 100%)", color: "#111111", borderRadius: 12, padding: "11px 18px", fontSize: 13, fontWeight: 800, cursor: submitting || !dateCheck || !dateCheck.available ? "not-allowed" : "pointer" }}
                        >
                          {submitting ? "Sending..." : "Request Rental"}
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
