import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import { UseAppContext } from "../context/AppContext";
import { useLocation } from "react-router";

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

const SHOP_UI_DATA = [
  {
    _id: "ui-1",
    name: "Premium Urea",
    seller: "GreenLeaf Agro Store",
    location: "Kompally, Hyderabad",
    price: 500,
    rating: 4.6,
    reviewCount: "2,264",
    category: "Fertilizers",
    state: "telangana",
    image: "/urea.png",
    description: "Balanced nitrogen support for strong vegetative crop growth. Farmers generally rely on this product when they want a familiar, effective nutrient option that supports leaf development and overall crop vigor during important growth stages.",
    availability: "Available",
  },
  {
    _id: "ui-2",
    name: "Hybrid Paddy Seeds",
    seller: "Kisan Seed House",
    location: "Guntur, Andhra Pradesh",
    price: 820,
    rating: 4.8,
    reviewCount: "3,048",
    category: "Seeds",
    state: "andhra pradesh",
    image: "/seeds.webp",
    description: "High-yield seed variety suited for strong germination rates. It is commonly selected by growers looking for better field establishment, more confident early crop growth, and a seed option with dependable planting performance.",
    availability: "Available",
  },
  {
    _id: "ui-3",
    name: "Crop Shield Pesticide",
    seller: "Agri Protect",
    location: "Nashik, Maharashtra",
    price: 680,
    rating: 4.4,
    reviewCount: "1,614",
    category: "Pesticides",
    state: "maharashtra",
    image: "/fertilizers.png",
    description: "Protective treatment for common seasonal pest pressure. This product is useful when crops begin facing recurring pest stress and farmers want a practical control option that supports more stable field conditions over time.",
    availability: "Out of Stock",
  },
  {
    _id: "ui-4",
    name: "Power Sprayer Kit",
    seller: "Field Tools Hub",
    location: "Mysuru, Karnataka",
    price: 2450,
    rating: 4.5,
    reviewCount: "1,982",
    category: "Equipment",
    state: "karnataka",
    image: "/shop.avif",
    description: "Durable spraying setup for field care and quick application cycles. It helps farmers cover ground efficiently when repeated spray rounds are needed and a dependable field-use tool matters as much as speed.",
    availability: "Available",
  },
  {
    _id: "ui-5",
    name: "Organic Soil Booster",
    seller: "Nature Root Supplies",
    location: "Thrissur, Kerala",
    price: 740,
    rating: 4.7,
    reviewCount: "2,571",
    category: "Fertilizers",
    state: "kerala",
    image: "/fertilizers.svg",
    description: "Organic nutrient blend for healthier soil structure and recovery. It is a strong choice when the goal is to improve soil condition gradually while still supporting crop performance through a more balanced feeding approach.",
    availability: "Booked",
  },
  {
    _id: "ui-6",
    name: "Vegetable Seed Pack",
    seller: "FreshGrow Traders",
    location: "Warangal, Telangana",
    price: 360,
    rating: 4.3,
    reviewCount: "1,246",
    category: "Seeds",
    state: "telangana",
    image: "/seeds.webp",
    description: "Mixed seed pack for kitchen-garden and market crop planting. Farmers and small growers often pick this when they want variety, flexibility, and a practical starting set for more diverse planting plans.",
    availability: "Available",
  },
];

export default function Shop() {
  const location = useLocation();
  const { isOpen, setIsOpen, addBooking } = UseAppContext();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [products] = useState([]);
  const filters = ["All", "Fertilizers", "Seeds", "Pesticides", "Equipment"];
  const isFarmerRoute = location.pathname.startsWith("/farmer");
  const pageTitle = "Shop";
  const cartEnabled = location.pathname.startsWith("/farmer") || location.pathname.startsWith("/serviceprovider");

  const [selectedItem, setSelectedItem] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("about");
  const [bookingForm, setBookingForm] = useState({
    quantity: "",
    deliveryAddress: "",
    contactNumber: "",
    notes: "",
  });

  const resetBookingForm = () => {
    setBookingForm({
      quantity: "",
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
      bookingForm.quantity,
      bookingForm.deliveryAddress,
      bookingForm.contactNumber,
    ];

    if (requiredFields.some((value) => !String(value).trim())) {
      window.alert("Please fill in all required purchase details.");
      return;
    }

    addBooking({
      module: "Shop",
      itemName: selectedItem.name,
      providerName: selectedItem.seller,
      image: selectedItem.image,
      priceLabel: `₹${selectedItem.price} / unit`,
      summary: `${bookingForm.quantity} requested • ${bookingForm.deliveryAddress}`,
      notificationTitle: "Shop purchase request",
      notificationDetail: `${selectedItem.name} purchase request placed for ${bookingForm.quantity}.`,
    });
    window.alert(`Purchase request for ${selectedItem.name} sent successfully to ${selectedItem.seller}.`);
    setActiveDetailTab("about");
    resetBookingForm();
    setSelectedItem(null);
  };

  const displayProducts = products.length > 0 ? products : SHOP_UI_DATA;

  const filteredProducts = useMemo(() => {
    return displayProducts.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.seller.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      const matchesCategory = activeFilter === "All" || item.category === activeFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [displayProducts, activeFilter, search]);

  const resultLabel =
    activeFilter === "All" ? "showing all products" : `showing ${activeFilter.toLowerCase()}`;
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
      <div className="min-h-dvh bg-darkgreen">
        <SideNav />
        <div
        className={`flex min-h-dvh flex-col transition-all duration-300 ${
          isOpen ? "md:ml-62.5" : "md:ml-20"
        }`}
      >
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-darkgreen shadow-2xl md:mx-6">
          <ModuleHeader
            title={pageTitle}
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
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
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

          {filteredProducts.length === 0 ? (
            <div className="px-6 py-10 font-montserrat text-sm text-white/70">
              No products match your current search and filters.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5 p-6">
              {filteredProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  name={item.name}
                  seller={item.seller}
                  location={item.location}
                  price={item.price}
                  rating={item.rating}
                  reviewCount={item.reviewCount}
                  category={item.category}
                  image={item.image}
                  description={item.description}
                  availability={item.availability}
                  showAddToCart={cartEnabled}
                  cartModule="Shop"
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
                    { id: "about", label: "About Product" },
                    { id: "book", label: "Buy Now" },
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
                      backgroundImage: `url(${selectedItem.image || "/urea.png"})`,
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
                      About This Product
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
                        Sold by {selectedItem.seller}
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
                          {selectedItem.seller?.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                            Seller
                          </div>
                          <div style={{ color: "#ffffff", fontSize: 16, fontWeight: 700, marginTop: 2 }}>
                            {selectedItem.seller}
                          </div>
                        </div>
                      </div>

                      {[
                        { label: "Price", value: `Rs.${selectedItem.price} per unit` },
                        { label: "Category", value: selectedItem.category },
                        { label: "Rating", value: `${selectedItem.rating} out of 5` },
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
                          Purchase Details
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 14, marginTop: 6, lineHeight: 1.75 }}>
                          Provide the quantity you want, the contact number for delivery coordination, and the complete drop address so the seller can review your order request properly. Clear instructions here make it easier for the provider to confirm stock readiness, packaging expectations, and dispatch planning without unnecessary back-and-forth.
                        </div>
                      </div>

                      <div className="kc-booking-grid">
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Quantity</span>
                          <input type="number" min="1" placeholder="Eg: 5 packets/units" value={bookingForm.quantity} onChange={(e) => handleBookingInput("quantity", e.target.value)} style={inputStyle} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Contact Number</span>
                          <input type="tel" placeholder="Your phone number" value={bookingForm.contactNumber} onChange={(e) => handleBookingInput("contactNumber", e.target.value)} style={inputStyle} />
                        </label>
                      </div>

                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Delivery Address</span>
                        <input type="text" placeholder="Full delivery physical address" value={bookingForm.deliveryAddress} onChange={(e) => handleBookingInput("deliveryAddress", e.target.value)} style={inputStyle} />
                      </label>

                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Additional Instructions</span>
                        <textarea rows={3} placeholder="Any delivery instructions..." value={bookingForm.notes} onChange={(e) => handleBookingInput("notes", e.target.value)} style={{ ...inputStyle, resize: "vertical", minHeight: 64 }} />
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
                          Confirm Order
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
