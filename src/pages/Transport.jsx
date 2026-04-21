import { useMemo, useState, useEffect } from "react";
import SideNav from "../components/SideNav";
import TransportCard from "../components/TransportCard";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
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

export default function Transport() {
  const { isOpen, setIsOpen, axios, addBooking } = UseAppContext();
  const [search, setSearch]               = useState("");
  const [activeFilter, setActiveFilter]   = useState("All");
  const [transport, setTransport]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const filters = ["All", "Trucks", "Tempo", "Vans", "Reefer"];

  const [selectedVehicle, setSelectedVehicle]     = useState(null);
  const [activeDetailTab, setActiveDetailTab]     = useState("about");
  const [dateChecked, setDateChecked]             = useState(false);
  const [dateAvailable, setDateAvailable]         = useState(null);
  const [checkingDate, setCheckingDate]           = useState(false);

  const [bookingForm, setBookingForm] = useState({
    farmerName: "", contactNumber: "",
    pickupDate: "", estimatedWeight: "",
    cropName: "", pickupLocation: "",
    dropLocation: "", distance: "",
    notes: "",
  });

  // ── Fetch from backend ─────────────────────────────────────────────────────
  const fetchTransport = async () => {
    try {
      const { data } = await axios.get("/api/transport/all");
      if (data.success) setTransport(data.transport || []);
    } catch (error) { console.log(error.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTransport(); }, []);

  const resetBookingForm = () => {
    setBookingForm({ farmerName: "", contactNumber: "", pickupDate: "", estimatedWeight: "", cropName: "", pickupLocation: "", dropLocation: "", distance: "", notes: "" });
    setDateChecked(false);
    setDateAvailable(null);
  };

  const handleBookingInput = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
    if (field === "pickupDate") { setDateChecked(false); setDateAvailable(null); }
  };

  // ── Check date availability ───────────────────────────────────────────────
  const handleCheckDate = async () => {
    if (!bookingForm.pickupDate) { window.alert("Please select a pickup date first."); return; }
    setCheckingDate(true);
    try {
      const { data } = await axios.post("/api/transport/checkdate", {
        transportId: selectedVehicle._id,
        date: bookingForm.pickupDate,
      });
      setDateChecked(true);
      setDateAvailable(data.available);
    } catch (error) { window.alert(error.message); }
    finally { setCheckingDate(false); }
  };

  // ── Estimated total payment ───────────────────────────────────────────────
  const pricePerKm = selectedVehicle ? Number(selectedVehicle.price) || 0 : 0;
  const distanceKm = Number(bookingForm.distance) || 0;
  const estimatedTotal = pricePerKm * distanceKm;

  // ── Submit booking ────────────────────────────────────────────────────────
  const handleBookingSubmit = async () => {
    const required = [bookingForm.farmerName, bookingForm.contactNumber, bookingForm.pickupDate, bookingForm.pickupLocation, bookingForm.dropLocation, bookingForm.estimatedWeight, bookingForm.cropName, bookingForm.distance];
    if (required.some((v) => !String(v).trim())) {
      window.alert("Please fill in all required transport details."); return;
    }
    if (!dateChecked) { window.alert("Please check availability for the selected date first."); return; }
    if (!dateAvailable) { window.alert("This vehicle is already booked for that date. Please choose a different date."); return; }

    try {
      const { data } = await axios.post("/api/transport/apply", {
        transportId:     selectedVehicle._id,
        farmerName:      bookingForm.farmerName,
        farmerContact:   bookingForm.contactNumber,
        pickupDate:      bookingForm.pickupDate,
        pickupLocation:  bookingForm.pickupLocation,
        dropLocation:    bookingForm.dropLocation,
        cropName:        bookingForm.cropName,
        estimatedWeight: bookingForm.estimatedWeight,
        notes:           bookingForm.notes,
        distance:        Number(bookingForm.distance),
      });

      if (data.success) {
        addBooking({
          module: "Transport",
          itemName: selectedVehicle.name,
          providerName: selectedVehicle.ownerName,
          image: selectedVehicle.image,
          priceLabel: `₹${selectedVehicle.price} / km`,
          summary: `${bookingForm.pickupLocation} → ${bookingForm.dropLocation} · ${bookingForm.distance} km`,
        });
        window.alert(`Transport booking request submitted successfully for ${selectedVehicle.name}.`);
        setActiveDetailTab("about");
        resetBookingForm();
        setSelectedVehicle(null);
      } else {
        window.alert(data.message);
      }
    } catch (error) { window.alert(error.message); }
  };

  const filteredTransport = useMemo(() => {
    return transport.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch = !query ||
        (item.name || "").toLowerCase().includes(query) ||
        (item.route || "").toLowerCase().includes(query) ||
        (item.ownerName || "").toLowerCase().includes(query) ||
        (item.description || "").toLowerCase().includes(query);
      const matchesCategory = activeFilter === "All" || item.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [transport, activeFilter, search]);

  const resultLabel = activeFilter === "All" ? "showing all transport options" : `showing ${activeFilter.toLowerCase()}`;

  return (
    <>
      <style>{`
        input::placeholder { color: rgba(255, 255, 255, 0.58) !important; }
        textarea::placeholder { color: rgba(255, 255, 255, 0.58) !important; }
        .kc-search-input::placeholder { color: rgba(17, 17, 17, 0.55) !important; }
        .kc-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.76); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 300; }
        .kc-modal-panel { width: min(1080px,100%); max-height: min(90vh,980px); overflow-y: auto; background: #000000; border: 1px solid rgba(212,175,55,0.32); border-radius: 22px; box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
        .kc-modal-grid { display: grid; grid-template-columns: 1.15fr 1fr; }
        .kc-booking-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 860px) { .kc-modal-grid { grid-template-columns: 1fr; } .kc-booking-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="min-h-dvh bg-black">
        <SideNav />
        <div className={`flex min-h-dvh flex-col transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
          <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
            <ModuleHeader title="Transport" search={search} onSearchChange={setSearch} onOpenSidebar={() => setIsOpen(!isOpen)} />
            <ModuleFilters filters={filters} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-white font-montserrat font-bold text-lg animate-pulse">Loading transport...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 px-6 pt-4">
                  <span className="font-montserrat text-sm font-bold text-white">{filteredTransport.length} vehicle{filteredTransport.length !== 1 ? "s" : ""} found</span>
                  <span className="font-montserrat text-xs text-white/60">· {resultLabel}</span>
                  {search.trim() && <span className="font-montserrat text-xs text-[#FFF085]">· matching "{search.trim()}"</span>}
                </div>

                {filteredTransport.length === 0 ? (
                  <div className="px-6 py-10 font-montserrat text-sm text-white/70">No transport options match your current search and filters.</div>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px] p-6">
                    {filteredTransport.map((vehicle) => (
                      <TransportCard
                        key={vehicle._id}
                        vehicle={{ ...vehicle, owner: vehicle.ownerName, priceLabel: `₹${vehicle.price} / km` }}
                        onViewDetails={(selected) => { setSelectedVehicle(selected); setActiveDetailTab("about"); resetBookingForm(); }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detail / booking modal */}
      {selectedVehicle && (
        <div className="kc-modal-overlay" onClick={() => setSelectedVehicle(null)}>
          <div className="kc-modal-panel font-montserrat" onClick={(e) => e.stopPropagation()}>

            {/* Tab switcher */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 14px 0 14px", gap: 12 }}>
              <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div style={{ width: "fit-content", maxWidth: "100%", borderRadius: 999, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", padding: 4, display: "flex", gap: 4, backdropFilter: "blur(12px)" }}>
                  {[{ id: "about", label: "About Vehicle" }, { id: "book", label: "Book Transport" }].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveDetailTab(tab.id)}
                      style={{ border: "none", borderRadius: 999, padding: "10px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, color: activeDetailTab === tab.id ? "#111111" : "#FFF085", background: activeDetailTab === tab.id ? "linear-gradient(135deg,#D4AF37 0%,#FFF085 100%)" : "transparent", transition: "all 0.18s ease", whiteSpace: "nowrap" }}>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setSelectedVehicle(null)} style={{ border: "none", background: "rgba(255,255,255,0.08)", color: "#ffffff", width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>×</button>
            </div>

            <div className="kc-modal-grid" style={{ gridTemplateColumns: activeDetailTab === "book" ? "1fr" : undefined }}>
              {/* About tab - left panel */}
              {activeDetailTab === "about" && (
                <div style={{ padding: 20, paddingTop: 8, borderRight: "1px solid rgba(212,175,55,0.18)" }}>
                  <div style={{ position: "relative", height: 290, borderRadius: 18, overflow: "hidden", backgroundImage: `url("${selectedVehicle.image}")`, backgroundSize: "cover", backgroundPosition: "center", marginBottom: 14 }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.12) 0%,rgba(0,0,0,0.45) 100%)" }} />
                  </div>
                  <div style={{ marginTop: 16, background: "#081D0C", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 16, padding: 16 }}>
                    <div style={{ color: "#E7C957", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>About This Vehicle</div>
                    <div style={{ color: "rgba(255,255,255,0.86)", fontSize: 14, lineHeight: 1.75 }}>{selectedVehicle.description}</div>
                  </div>
                </div>
              )}

              {/* Right panel */}
              <div style={{ padding: 24, paddingTop: 8, display: "flex", flexDirection: "column", gap: 18, minHeight: 520, alignItems: activeDetailTab === "book" ? "center" : "stretch" }}>
                {activeDetailTab === "about" && (
                  <>
                    <div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: "#E7C957", lineHeight: 1.15 }}>{selectedVehicle.name}</div>
                      <div style={{ marginTop: 8, color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{selectedVehicle.route}</div>
                    </div>
                    <div style={{ background: "#081D0C", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 16, padding: 16 }}>
                      {/* Operator row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
                        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#FFF085 0%,#D4AF37 100%)", color: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, flexShrink: 0 }}>
                          {(selectedVehicle.ownerName || selectedVehicle.owner || "O").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.6 }}>Operator</div>
                          <div style={{ color: "#ffffff", fontSize: 16, fontWeight: 700, marginTop: 2 }}>{selectedVehicle.ownerName || selectedVehicle.owner}</div>
                        </div>
                      </div>
                      {[
                        { label: "Price",        value: `₹${selectedVehicle.price} per km` },
                        { label: "Capacity",     value: selectedVehicle.capacity },
                        { label: "Vehicle Type", value: selectedVehicle.category },
                        { label: "Status",       value: selectedVehicle.availability },
                      ].map((row, i, arr) => (
                        <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "10px 0", borderBottom: i !== arr.length - 1 ? "1px solid rgba(212,175,55,0.12)" : "none" }}>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>{row.label}</div>
                          <div style={{ color: "#ffffff", fontSize: 14, fontWeight: 600, textAlign: "right" }}>{row.value}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeDetailTab === "book" && (
                  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <div style={{ width: "min(760px,100%)", background: "linear-gradient(180deg,rgba(16,31,21,0.96) 0%,rgba(7,13,9,0.98) 100%)", border: "1px solid rgba(212,175,55,0.24)", borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 20px 40px rgba(0,0,0,0.35)" }}>
                      <div>
                        <div style={{ color: "#FFF085", fontSize: 18, fontWeight: 800 }}>Transport Booking</div>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 }}>
                          Fill your details and route so the operator can confirm availability.
                        </div>
                      </div>

                      {/* Row 1: name + contact */}
                      <div className="kc-booking-grid">
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Your Name *</span>
                          <input type="text" placeholder="Full name" value={bookingForm.farmerName} onChange={(e) => handleBookingInput("farmerName", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Contact Number *</span>
                          <input type="tel" placeholder="Your phone number" value={bookingForm.contactNumber} onChange={(e) => handleBookingInput("contactNumber", e.target.value)} style={inputStyle} />
                        </label>
                      </div>

                      {/* Row 2: pickup date + check button */}
                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Pickup Date *</span>
                        <input type="date" value={bookingForm.pickupDate} onChange={(e) => handleBookingInput("pickupDate", e.target.value)} style={inputStyle} />
                      </label>

                      <button
                        onClick={handleCheckDate}
                        disabled={checkingDate || !bookingForm.pickupDate}
                        style={{ border: "1px solid rgba(212,175,55,0.4)", background: "transparent", color: "#FFF085", borderRadius: 12, padding: "11px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: !bookingForm.pickupDate ? 0.4 : 1 }}
                      >
                        {checkingDate ? "Checking..." : "Check Availability for Selected Date"}
                      </button>

                      {dateChecked && (
                        <div style={{ textAlign: "center", padding: "8px 16px", borderRadius: 10, background: dateAvailable ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${dateAvailable ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.4)"}`, color: dateAvailable ? "#4ade80" : "#f87171", fontWeight: 700, fontSize: 13 }}>
                          {dateAvailable ? "✓ This vehicle is available for the selected date" : "✗ This vehicle is already booked for that date"}
                        </div>
                      )}

                      {/* Row 3: weight + crop */}
                      <div className="kc-booking-grid">
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Estimated Weight *</span>
                          <input type="text" placeholder="e.g. 5 Tonnes" value={bookingForm.estimatedWeight} onChange={(e) => handleBookingInput("estimatedWeight", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Crop / Material *</span>
                          <input type="text" placeholder="e.g. Tomatoes, Wheat" value={bookingForm.cropName} onChange={(e) => handleBookingInput("cropName", e.target.value)} style={inputStyle} />
                        </label>
                      </div>

                      {/* Row 4: pickup + drop location */}
                      <div className="kc-booking-grid">
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Pickup Location *</span>
                          <input type="text" placeholder="Farm address or Mandi name" value={bookingForm.pickupLocation} onChange={(e) => handleBookingInput("pickupLocation", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Drop Location *</span>
                          <input type="text" placeholder="Destination address" value={bookingForm.dropLocation} onChange={(e) => handleBookingInput("dropLocation", e.target.value)} style={inputStyle} />
                        </label>
                      </div>

                      {/* Distance + live payment estimate */}
                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Total Distance (km) *</span>
                        <input type="number" min="1" placeholder="e.g. 45" value={bookingForm.distance} onChange={(e) => handleBookingInput("distance", e.target.value)} style={inputStyle} />
                      </label>

                      {/* Live payment estimate */}
                      {distanceKm > 0 && pricePerKm > 0 && (
                        <div style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Estimated Payment</div>
                            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>₹{pricePerKm} × {distanceKm} km</div>
                          </div>
                          <div style={{ color: "#FFF085", fontSize: 22, fontWeight: 900 }}>₹{estimatedTotal.toLocaleString()}</div>
                        </div>
                      )}

                      {/* Notes */}
                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Additional Notes</span>
                        <textarea rows={3} placeholder="Any specific requirements (cooling, padding)..." value={bookingForm.notes} onChange={(e) => handleBookingInput("notes", e.target.value)} style={{ ...inputStyle, resize: "vertical", minHeight: 64 }} />
                      </label>

                      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                        <button onClick={() => { setActiveDetailTab("about"); resetBookingForm(); }} style={{ border: "1px solid rgba(212,175,55,0.28)", background: "transparent", color: "#FFF085", borderRadius: 12, padding: "11px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                          Cancel
                        </button>
                        <button onClick={handleBookingSubmit} style={{ border: "none", background: "linear-gradient(135deg,#FFF085 0%,#D4AF37 100%)", color: "#111", borderRadius: 12, padding: "11px 18px", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                          Book Transport
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
