import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import ProductCard from "../components/ProductCard";
import ShopServiceCard from "../components/ShopServiceCard";
import ServiceProviderCatalogForm from "../components/ServiceProviderCatalogForm";
import { UseAppContext } from "../context/AppContext";

const DEFAULT_MARKET_IMAGE = "/shop.avif";

const marketplaceFields = [
  { key: "name", label: "Item Name", placeholder: "Enter crop or produce name", required: true },
  { key: "category", label: "Category", type: "select", options: ["Vegetables", "Fruits", "Crops", "Spices", "Dairy", "Other"], required: true },
  { key: "price", label: "Price Per Unit", type: "number", placeholder: "Enter price", required: true },
  { key: "stock", label: "Available Quantity", placeholder: "Eg: 500 kg or 2 tonnes", required: true },
  { key: "location", label: "Farm Location", placeholder: "Enter location", required: true },
  { key: "availability", label: "Status", type: "select", options: ["Available", "Booked", "Out of Stock"], required: true },
  { key: "description", label: "Description", type: "textarea", placeholder: "Share quality, harvest timing, or handling details", required: true },
];

const initialForm = {
  name: "",
  seller: "",
  price: "",
  rating: 4.5,
  category: "Vegetables",
  stock: "",
  location: "",
  image: DEFAULT_MARKET_IMAGE,
  description: "",
  availability: "Available",
};

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

export default function Marketplace() {
  const location = useLocation();
  const isFarmerRoute = location.pathname.startsWith("/farmer");
  const {
    isOpen,
    setIsOpen,
    user,
    addBooking,
    marketplaceListings,
    addMarketplaceListing,
    updateMarketplaceListing,
    deleteMarketplaceListing,
  } = UseAppContext();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("about");
  const [bookingForm, setBookingForm] = useState({
    quantity: "",
    deliveryAddress: "",
    contactNumber: "",
    notes: "",
  });

  const filters = ["All", "Vegetables", "Fruits", "Crops", "Spices", "Dairy", "Other"];

  const filteredListings = useMemo(() => {
    return marketplaceListings.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.seller.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      const matchesCategory = activeFilter === "All" || item.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [activeFilter, marketplaceListings, search]);

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
      module: "Marketplace",
      itemName: selectedItem.name,
      providerName: selectedItem.seller,
      image: selectedItem.image,
      priceLabel: `₹${selectedItem.price} / unit`,
      summary: `${bookingForm.quantity} requested • ${bookingForm.deliveryAddress}`,
      notificationTitle: "Marketplace purchase request",
      notificationDetail: `${selectedItem.name} purchase request placed for ${bookingForm.quantity}.`,
    });
    window.alert(`Purchase request for ${selectedItem.name} sent successfully to ${selectedItem.seller}.`);
    setActiveDetailTab("about");
    resetBookingForm();
    setSelectedItem(null);
  };

  const handleOpenForm = () => {
    setEditingListing(null);
    setShowFormModal(true);
  };

  const handleEdit = (item) => {
    setEditingListing(item);
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setEditingListing(null);
    setShowFormModal(false);
  };

  const handleSaveListing = (formData) => {
    const payload = {
      ...formData,
      seller: editingListing?.seller || user?.name || "Farmer Market",
      rating: editingListing?.rating || 4.6,
      image: formData.image || DEFAULT_MARKET_IMAGE,
      price: Number(formData.price),
    };

    if (editingListing) {
      updateMarketplaceListing(editingListing.id, payload);
    } else {
      addMarketplaceListing(payload);
    }

    handleCloseForm();
  };

  const pageTitle = isFarmerRoute ? "Marketplace" : "Farm Marketplace";
  const resultLabel =
    activeFilter === "All" ? "showing all marketplace goods" : `showing ${activeFilter.toLowerCase()}`;
  const addButtonLabel = isFarmerRoute ? "Add Items" : "";

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
        <div className={`flex min-h-dvh flex-col transition-all duration-300 ${isOpen ? "md:ml-62.5" : "md:ml-20"}`}>
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

            {isFarmerRoute ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-montserrat text-sm font-bold text-white">
                      {filteredListings.length} listing{filteredListings.length !== 1 ? "s" : ""} live
                    </span>
                    <span className="font-montserrat text-xs text-white/60">
                      . {resultLabel}
                    </span>
                  </div>
                  <button
                    onClick={handleOpenForm}
                    className="rounded-xl bg-gold px-4 py-2 text-[12px] font-black uppercase tracking-[0.45px] text-[#0a1a0c] transition hover:-translate-y-px hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)]"
                  >
                    {addButtonLabel}
                  </button>
                </div>

                <div className="flex-1 bg-darkgreen p-6">
                  {filteredListings.length === 0 ? (
                    <div className="flex min-h-[calc(100dvh-14rem)] flex-col items-center justify-center gap-6 text-center">
                      <p className="max-w-xl text-xl font-bold text-white">
                        Start showcasing your crops and farm goods in the marketplace.
                      </p>
                      <button
                        onClick={handleOpenForm}
                        className="rounded-xl bg-gold px-6 py-3 text-[13px] font-black uppercase tracking-[0.45px] text-[#0a1a0c] transition hover:-translate-y-px hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)]"
                      >
                        {addButtonLabel}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5">
                      {filteredListings.map((item) => (
                        <ShopServiceCard
                          key={item.id}
                          item={item}
                          onEdit={handleEdit}
                          onDelete={deleteMarketplaceListing}
                          hideSubtitle={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 px-6 pt-4">
                  <span className="font-montserrat text-sm font-bold text-white">
                    {filteredListings.length} item{filteredListings.length !== 1 ? "s" : ""} found
                  </span>
                  <span className="font-montserrat text-xs text-white/60">
                    . {resultLabel}
                  </span>
                </div>

                {filteredListings.length === 0 ? (
                  <div className="px-6 py-10 font-montserrat text-sm text-white/70">
                    No marketplace listings match your current search and filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5 p-6">
                    {filteredListings.map((item) => (
                      <ProductCard
                        key={item.id}
                        name={item.name}
                        seller={item.seller}
                        price={item.price}
                        rating={item.rating}
                        category={item.category}
                        image={item.image}
                        description={item.description}
                        availability={item.availability}
                        showAddToCart={true}
                        cartModule="Marketplace"
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

      {showFormModal && (
        <div
          className="kc-modal-overlay"
          onClick={handleCloseForm}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(860px, 100%)",
              maxHeight: "min(88vh, 920px)",
              overflow: "auto",
              background: "#000000",
              border: "1px solid rgba(212, 175, 55, 0.32)",
              borderRadius: "22px",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
            }}
          >
            <ServiceProviderCatalogForm
              title={editingListing ? "Edit Marketplace Listing" : "Add Marketplace Listing"}
              introText="List your produce, crop lots, or farm goods so buyers can review the quality, quantity, and location at a glance."
              imageLabel="Upload listing image"
              uploadText="Click to upload marketplace image"
              submitText={editingListing ? "Save Listing" : "Save Listing"}
              initialData={editingListing || { ...initialForm, seller: user?.name || "Farmer Market" }}
              fields={marketplaceFields}
              onBack={handleCloseForm}
              onSave={handleSaveListing}
              isModal={true}
            />
          </div>
        </div>
      )}

      {!isFarmerRoute && selectedItem && (
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
                    { id: "about", label: "About Listing" },
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

            <div className="kc-modal-grid" style={{ gridTemplateColumns: activeDetailTab === "book" ? "1fr" : undefined }}>
              {activeDetailTab === "about" && (
                <div style={{ padding: 20, paddingTop: 8, borderRight: "1px solid rgba(212, 175, 55, 0.18)" }}>
                  <div
                    style={{
                      position: "relative",
                      height: 290,
                      borderRadius: 18,
                      overflow: "hidden",
                      backgroundImage: `url(${selectedItem.image || DEFAULT_MARKET_IMAGE})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.45) 100%)" }} />
                  </div>
                  <div style={{ marginTop: 16, background: "#081D0C", border: "1px solid rgba(212, 175, 55, 0.18)", borderRadius: 16, padding: 16 }}>
                    <div style={{ color: "#E7C957", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                      About This Listing
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.7 }}>
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

                    <div style={{ background: "#081D0C", border: "1px solid rgba(212, 175, 55, 0.18)", borderRadius: 16, padding: 16 }}>
                      {[
                        { label: "Price", value: `Rs.${selectedItem.price} per unit` },
                        { label: "Category", value: selectedItem.category },
                        { label: "Stock", value: selectedItem.stock },
                        { label: "Location", value: selectedItem.location },
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
                          Marketplace Purchase
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 }}>
                          Define quantity and delivery details to buy from this farmer listing.
                        </div>
                      </div>

                      <div className="kc-booking-grid">
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: "#FFF085", fontSize: 12, fontWeight: 700 }}>Quantity</span>
                          <input type="text" placeholder="Eg: 50 kg" value={bookingForm.quantity} onChange={(e) => handleBookingInput("quantity", e.target.value)} style={inputStyle} />
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
                        <textarea rows={3} placeholder="Any packaging or delivery instructions..." value={bookingForm.notes} onChange={(e) => handleBookingInput("notes", e.target.value)} style={{ ...inputStyle, resize: "vertical", minHeight: 64 }} />
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
                          Confirm Purchase
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
