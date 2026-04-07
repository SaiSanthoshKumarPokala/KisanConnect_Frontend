import { useMemo, useState } from "react";
import SideNav from "../components/SideNav";
import TransportCard from "../components/TransportCard";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import { UseAppContext } from "../context/AppContext";
import image1 from "../assets/Transport/image1.webp";
import image2 from "../assets/Transport/image2.webp";
import image3 from "../assets/Transport/image3.jpeg";
import image4 from "../assets/Transport/image4.webp";
import image5 from "../assets/Transport/image5.webp";
import image6 from "../assets/Transport/image6.webp";

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

const TRANSPORT_UI_DATA = [
  {
    id: 1,
    name: "Agri Freight Mini Truck",
    vehicleType: "Trucks",
    location: "Hyderabad, Telangana",
    state: "telangana",
    price: "Rs. 350",
    priceLabel: "Rs. 350 / km",
    capacity: "8 Tonnes",
    rating: 4.3,
    reviewCount: "1,584",
    owner: "Ravi Kumar",
    availability: "Available",
    description: "Reliable short-haul option for mandi trips and local farm pickups. It is well suited for routine nearby movement when farmers need predictable service, manageable operating cost, and enough space for day-to-day produce dispatches.",
    image: image1,
  },
  {
    id: 2,
    name: "FieldLink Heavy Carrier",
    vehicleType: "Trucks",
    location: "Guntur, Andhra Pradesh",
    state: "andhra pradesh",
    price: "Rs. 420",
    priceLabel: "Rs. 420 / km",
    capacity: "12 Tonnes",
    rating: 4.7,
    reviewCount: "2,216",
    owner: "Venkat Logistics",
    availability: "Available",
    description: "Heavy-duty transport for longer interstate crop movement. This vehicle works best when produce needs to move across longer routes with stronger carrying support and a setup that feels prepared for higher-volume trips.",
    image: image2,
  },
  {
    id: 3,
    name: "Harvest Tempo XL",
    vehicleType: "Tempo",
    location: "Nashik, Maharashtra",
    state: "maharashtra",
    price: "Rs. 210",
    priceLabel: "Rs. 210 / km",
    capacity: "3 Tonnes",
    rating: 4.5,
    reviewCount: "1,391",
    owner: "Anita Transport",
    availability: "Limited",
    description: "Compact carrier suited for produce pickups from tighter rural roads. Farmers often prefer it for interior-village access where a smaller, more agile vehicle can reach loading points that bigger carriers struggle to handle comfortably.",
    image: image3,
  },
  {
    id: 4,
    name: "Kisan Cargo Van",
    vehicleType: "Vans",
    location: "Mysuru, Karnataka",
    state: "karnataka",
    price: "Rs. 180",
    priceLabel: "Rs. 180 / km",
    capacity: "1.5 Tonnes",
    rating: 4.2,
    reviewCount: "1,048",
    owner: "Arjun Patel",
    availability: "Available",
    description: "Fast and practical for smaller deliveries and quick supply runs. It is ideal for growers who need flexible transport on shorter schedules without booking a larger truck for relatively lighter loads.",
    image: image4,
  },
  {
    id: 5,
    name: "Cold Chain Reefer Van",
    vehicleType: "Reefer",
    location: "Thrissur, Kerala",
    state: "kerala",
    price: "Rs. 390",
    priceLabel: "Rs. 390 / km",
    capacity: "4 Tonnes",
    rating: 4.8,
    reviewCount: "2,441",
    owner: "Sowmya Cold Logistics",
    availability: "Booked",
    description: "Temperature-controlled movement for perishables and delicate produce. This option is especially valuable when fruits, vegetables, flowers, or sensitive goods need safer handling and more stable transit conditions from pickup to drop.",
    image: image5,
  },
  {
    id: 6,
    name: "Bulk Transit Hauler",
    vehicleType: "Trucks",
    location: "Warangal, Telangana",
    state: "telangana",
    price: "Rs. 460",
    priceLabel: "Rs. 460 / km",
    capacity: "15 Tonnes",
    rating: 4.6,
    reviewCount: "1,877",
    owner: "Naveen Freight",
    availability: "Available",
    description: "Built for high-volume shipments when capacity matters most. It is a strong choice for bulk dispatch cycles where the priority is moving larger quantities efficiently without splitting loads into multiple smaller trips.",
    image: image6,
  },
];

export default function Transport() {
  const { isOpen, setIsOpen, addBooking } = UseAppContext();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Trucks", "Tempo", "Vans", "Reefer"];

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("about");
  const [bookingForm, setBookingForm] = useState({
    pickupDate: "",
    pickupLocation: "",
    dropLocation: "",
    estimatedWeight: "",
    cropName: "",
    contactNumber: "",
    notes: "",
  });

  const resetBookingForm = () => {
    setBookingForm({
      pickupDate: "",
      pickupLocation: "",
      dropLocation: "",
      estimatedWeight: "",
      cropName: "",
      contactNumber: "",
      notes: "",
    });
  };

  const handleBookingInput = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = () => {
    const requiredFields = [
      bookingForm.pickupDate,
      bookingForm.pickupLocation,
      bookingForm.dropLocation,
      bookingForm.estimatedWeight,
      bookingForm.cropName,
      bookingForm.contactNumber,
    ];

    if (requiredFields.some((value) => !String(value).trim())) {
      window.alert("Please fill in all required transport details.");
      return;
    }

    addBooking({
      module: "Transport",
      itemName: selectedVehicle.name,
      providerName: selectedVehicle.owner,
      image: selectedVehicle.image,
      priceLabel: selectedVehicle.priceLabel || selectedVehicle.price,
      summary: `${bookingForm.pickupLocation} to ${bookingForm.dropLocation} • ${bookingForm.cropName}`,
      notificationTitle: "Transport booking request",
      notificationDetail: `${selectedVehicle.name} requested for ${bookingForm.cropName} transport from ${bookingForm.pickupLocation} to ${bookingForm.dropLocation}.`,
    });
    window.alert(`Transport booking request sent to ${selectedVehicle.owner} for ${selectedVehicle.name}.`);
    setActiveDetailTab("about");
    resetBookingForm();
    setSelectedVehicle(null);
  };

  const filteredTransport = useMemo(() => {
    return TRANSPORT_UI_DATA.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.owner.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      const matchesCategory = activeFilter === "All" || item.vehicleType.includes(activeFilter);
      
      return matchesSearch && matchesCategory;
    });
  }, [activeFilter, search]);

  const resultLabel =
    activeFilter === "All" ? "showing all transport options" : `showing ${activeFilter.toLowerCase()}`;
  return (
    <>
      <style>{`
        input::placeholder { color: rgba(255, 255, 255, 0.58) !important; }
        textarea::placeholder { color: rgba(255, 255, 255, 0.58) !important; }
        .kc-search-input::placeholder { color: rgba(17, 17, 17, 0.55) !important; }
        select option { background: #050505; color: #ffffff; }
        
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
        .kc-booking-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 860px) {
          .kc-modal-grid { grid-template-columns: 1fr; }
          .kc-booking-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="min-h-dvh bg-black">
        <SideNav />
        <div
        className={`flex min-h-dvh flex-col transition-all duration-300 ${
          isOpen ? "md:ml-[250px]" : "md:ml-[80px]"
        }`}
      >
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          <ModuleHeader
            title="Transport"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />
          <ModuleFilters
            filters={filters}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          <div className="flex flex-wrap items-center gap-2 px-6 pt-4">
            <span className="font-montserrat text-sm font-bold text-white">
              {filteredTransport.length} vehicle{filteredTransport.length !== 1 ? "s" : ""} found
            </span>
            <span className="font-montserrat text-xs text-white/60">
              . {resultLabel}
            </span>
            {search.trim() && (
              <span className="font-montserrat text-xs text-[#FFF085]">
                . matching "{search.trim()}"
              </span>
            )}
          </div>

          {filteredTransport.length === 0 ? (
            <div className="px-6 py-10 font-montserrat text-sm text-white/70">
              No transport options match your current search and filters.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px] p-6">
              {filteredTransport.map((vehicle) => (
                <TransportCard 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  onViewDetails={(selected) => {
                    setSelectedVehicle(selected);
                    setActiveDetailTab("about");
                    resetBookingForm();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

      {selectedVehicle && (
        <div className="kc-modal-overlay" onClick={() => setSelectedVehicle(null)}>
          <div className="kc-modal-panel font-montserrat" onClick={(e) => e.stopPropagation()}>
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
                    { id: "about", label: "About Vehicle" },
                    { id: "book", label: "Book Transport" },
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
                onClick={() => setSelectedVehicle(null)}
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
                      backgroundImage: `url(${selectedVehicle.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.45) 100%)" }} />
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
                      About This Vehicle
                    </div>
                        <div style={{ color: "rgba(255,255,255,0.86)", fontSize: 15, lineHeight: 1.85 }}>
                          {selectedVehicle.description}
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
                  minHeight: 520,
                  alignItems: activeDetailTab === "book" ? "center" : "stretch",
                }}
              >
                {activeDetailTab === "about" && (
                  <>
                    <div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: "#E7C957", lineHeight: 1.15 }}>
                        {selectedVehicle.name}
                      </div>
                      <div style={{ marginTop: 8, color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
                        {selectedVehicle.location} - {selectedVehicle.state}
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
                            fontSize: 18,
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {selectedVehicle.owner?.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                            Operator
                          </div>
                          <div style={{ color: "#ffffff", fontSize: 16, fontWeight: 700, marginTop: 2 }}>
                            {selectedVehicle.owner}
                          </div>
                        </div>
                      </div>

                      {[
                        { label: "Price", value: selectedVehicle.priceLabel },
                        { label: "Capacity", value: selectedVehicle.capacity },
                        { label: "Vehicle Type", value: selectedVehicle.vehicleType },
                        { label: "Status", value: selectedVehicle.availability },
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
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>
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
                          Transport Booking
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 14, marginTop: 6, lineHeight: 1.75 }}>
                          Enter the pickup schedule, crop or material details, estimated load, and exact route information so the transporter can judge vehicle fit, timing, and handling requirements before approving the request. The more clearly the trip is defined, the easier it becomes to avoid last-minute coordination issues.
                        </div>
                      </div>

                      <div className="kc-booking-grid">
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Pickup Date</span>
                          <input type="date" value={bookingForm.pickupDate} onChange={(e) => handleBookingInput("pickupDate", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Estimated Weight</span>
                          <input type="text" placeholder="Eg: 5 Tonnes" value={bookingForm.estimatedWeight} onChange={(e) => handleBookingInput("estimatedWeight", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Crop / Material</span>
                          <input type="text" placeholder="Eg: Tomatoes, Wheat" value={bookingForm.cropName} onChange={(e) => handleBookingInput("cropName", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Contact Number</span>
                          <input type="tel" placeholder="Your phone number" value={bookingForm.contactNumber} onChange={(e) => handleBookingInput("contactNumber", e.target.value)} style={inputStyle} />
                        </label>
                      </div>

                      <div className="kc-booking-grid">
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Pickup Location</span>
                          <input type="text" placeholder="Farm address or Mandi name" value={bookingForm.pickupLocation} onChange={(e) => handleBookingInput("pickupLocation", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Drop Location</span>
                          <input type="text" placeholder="Destination address" value={bookingForm.dropLocation} onChange={(e) => handleBookingInput("dropLocation", e.target.value)} style={inputStyle} />
                        </label>
                      </div>

                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Additional Notes</span>
                        <textarea rows={3} placeholder="Any specific requirements (cooling, padding)..." value={bookingForm.notes} onChange={(e) => handleBookingInput("notes", e.target.value)} style={{ ...inputStyle, resize: "vertical", minHeight: 64 }} />
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
