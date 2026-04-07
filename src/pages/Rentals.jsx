import { useMemo, useState } from "react";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import RentalsCard from "../components/RentalsCard";
import image1 from "../assets/Rentals/image1.webp";
import image2 from "../assets/Rentals/image2.webp";
import image3 from "../assets/Rentals/image3.jpeg";
import image4 from "../assets/Rentals/image4.webp";
import image5 from "../assets/Rentals/image5.webp";

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

const RENTALS_UI_DATA = [
  {
    id: 1,
    name: "Mahindra 575 DI",
    category: "Tractors",
    location: "Kompally, Hyderabad",
    state: "telangana",
    price: 2200,
    horsepower: 47,
    rating: 4.8,
    reviewCount: "2,168",
    owner: "Rajesh Kumar",
    availability: "Available",
    description: "Reliable tractor for ploughing, haulage, and long field days. Farmers usually choose this machine when they want a steady combination of field strength, practical handling, and dependable performance across repeated daily work like tilling, pulling, and general transport support.",
    image: image1,
  },
  {
    id: 2,
    name: "John Deere 5310",
    category: "Tractors",
    location: "Guntur, Andhra Pradesh",
    state: "andhra pradesh",
    price: 2600,
    horsepower: 55,
    rating: 4.7,
    reviewCount: "1,842",
    owner: "Venkat Rao",
    availability: "Available",
    description: "High-torque machine suited for heavier tilling and transport work. It is especially useful on larger plots where stronger pulling power, stable field movement, and better long-hour performance matter during busy seasonal operations.",
    image: image2,
  },
  {
    id: 3,
    name: "Harvester Prime X9",
    category: "Harvesters",
    location: "Nashik, Maharashtra",
    state: "maharashtra",
    price: 5400,
    horsepower: 98,
    rating: 4.9,
    reviewCount: "3,106",
    owner: "Meera Agro Infra",
    availability: "Booked",
    description: "Fast, clean harvesting support for peak-season grain and paddy work. This option is often preferred by growers who want quicker turnaround during harvest windows while keeping crop handling efficient and reducing labor pressure on the field.",
    image: image3,
  },
  {
    id: 4,
    name: "FieldMax Mini Harvester",
    category: "Harvesters",
    location: "Mysuru, Karnataka",
    state: "karnataka",
    price: 4900,
    horsepower: 88,
    rating: 4.5,
    reviewCount: "1,265",
    owner: "Arjun Patel",
    availability: "Limited",
    description: "Compact harvester that handles medium-size farms with ease. It works well for farmers who want practical harvesting help on moderate acreage without stepping up to a much larger or more expensive machine.",
    image: image4,
  },
  {
    id: 5,
    name: "Turbo Seeder 2000",
    category: "Implements",
    location: "Thrissur, Kerala",
    state: "kerala",
    price: 1400,
    horsepower: 28,
    rating: 4.6,
    reviewCount: "1,908",
    owner: "Sowmya Naik",
    availability: "Available",
    description: "Uniform row sowing with quick setup for busy planting schedules. The machine is a strong fit when timely planting matters because it helps maintain row consistency while reducing manual effort at the start of the season.",
    image: image5,
  },
  {
    id: 6,
    name: "RotaKing Cultivator",
    category: "Implements",
    location: "Warangal, Telangana",
    state: "telangana",
    price: 1100,
    horsepower: 24,
    rating: 4.4,
    reviewCount: "1,122",
    owner: "Naveen Goud",
    availability: "Available",
    description: "Budget-friendly option for rapid soil preparation before planting. It is commonly selected for routine pre-sowing work where the goal is to prepare land quickly, keep cost manageable, and still rely on a machine that feels consistent in day-to-day use.",
    image: image2,
  },
];

export default function Rentals() {
  const { isOpen, setIsOpen, addBooking } = UseAppContext();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Tractors", "Harvesters", "Implements"];

  const [selectedItem, setSelectedItem] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("about");
  const [bookingForm, setBookingForm] = useState({
    startDate: "",
    endDate: "",
    expectedHours: "",
    deliveryAddress: "",
    contactNumber: "",
    notes: "",
  });

  const resetBookingForm = () => {
    setBookingForm({
      startDate: "",
      endDate: "",
      expectedHours: "",
      deliveryAddress: "",
      contactNumber: "",
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
      bookingForm.deliveryAddress,
      bookingForm.contactNumber,
    ];

    if (requiredFields.some((value) => !String(value).trim())) {
      window.alert("Please fill in all required rental details.");
      return;
    }

    addBooking({
      module: "Rentals",
      itemName: selectedItem.name,
      providerName: selectedItem.owner,
      image: selectedItem.image,
      priceLabel: `₹${selectedItem.price} / day`,
      summary: `${bookingForm.startDate} to ${bookingForm.endDate} • ${bookingForm.deliveryAddress}`,
      notificationTitle: "Rental booking request",
      notificationDetail: `${selectedItem.name} requested from ${bookingForm.startDate} to ${bookingForm.endDate} for delivery at ${bookingForm.deliveryAddress}.`,
    });
    window.alert(`Rental request sent successfully to ${selectedItem.owner} for ${selectedItem.name}.`);
    setActiveDetailTab("about");
    resetBookingForm();
    setSelectedItem(null);
  };

  const filteredRentals = useMemo(() => {
    return RENTALS_UI_DATA.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.owner.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      const matchesCategory = activeFilter === "All" || item.category === activeFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [activeFilter, search]);

  const resultLabel =
    activeFilter === "All" ? "showing all equipment" : `showing ${activeFilter.toLowerCase()}`;

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
            title="Machine Rentals"
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
              {filteredRentals.length} machine{filteredRentals.length !== 1 ? "s" : ""} found
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

          {filteredRentals.length === 0 ? (
            <div className="px-6 py-10 font-montserrat text-sm text-white/70">
              No machines match your current search and filters.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px] p-6">
              {filteredRentals.map((item) => (
                <RentalsCard 
                  key={item.id} 
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
        </div>
      </div>
    </div>

      {selectedItem && (
        <div className="kc-modal-overlay" onClick={() => setSelectedItem(null)}>
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
                    { id: "about", label: "About Equipment" },
                    { id: "book", label: "Rent Now" },
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
                onClick={() => setSelectedItem(null)}
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
                      backgroundImage: `url(${selectedItem.image})`,
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
                      About This Equipment
                    </div>
                        <div style={{ color: "rgba(255,255,255,0.86)", fontSize: 15, lineHeight: 1.85 }}>
                          {selectedItem.description}
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
                        {selectedItem.name}
                      </div>
                      <div style={{ marginTop: 8, color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
                        {selectedItem.location} - {selectedItem.state}
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
                          {selectedItem.owner?.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                            Owner
                          </div>
                          <div style={{ color: "#ffffff", fontSize: 16, fontWeight: 700, marginTop: 2 }}>
                            {selectedItem.owner}
                          </div>
                        </div>
                      </div>

                      {[
                        { label: "Price", value: `Rs.${selectedItem.price} per day` },
                        { label: "Horsepower", value: `${selectedItem.horsepower} HP` },
                        { label: "Category", value: selectedItem.category },
                        { label: "Status", value: selectedItem.availability },
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
                          Rental Request Details
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 14, marginTop: 6, lineHeight: 1.75 }}>
                          Share the full rental schedule, your field or delivery location, and any usage notes the owner should know before confirming the machine. This helps the provider understand the work window, prepare the right equipment condition, and coordinate transport or handover more smoothly.
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
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Expected Hours/Day</span>
                          <input type="number" placeholder="Eg: 8" value={bookingForm.expectedHours} onChange={(e) => handleBookingInput("expectedHours", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Contact Number</span>
                          <input type="tel" placeholder="Your phone number" value={bookingForm.contactNumber} onChange={(e) => handleBookingInput("contactNumber", e.target.value)} style={inputStyle} />
                        </label>
                      </div>

                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Delivery Address (Farm Location)</span>
                        <input type="text" placeholder="Village address, specific directions" value={bookingForm.deliveryAddress} onChange={(e) => handleBookingInput("deliveryAddress", e.target.value)} style={inputStyle} />
                      </label>

                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Additional Notes</span>
                        <textarea rows={3} placeholder="Any specific attachments or instructions needed?" value={bookingForm.notes} onChange={(e) => handleBookingInput("notes", e.target.value)} style={{ ...inputStyle, resize: "vertical", minHeight: 88 }} />
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
                          Request Rental
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
