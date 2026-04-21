import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import ServiceProviderCatalogForm from "../components/ServiceProviderCatalogForm";
import { UseAppContext } from "../context/AppContext";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const DEFAULT_IMAGE = "/shop.avif";

// ── Farmer form fields — price per kg, stock in kg ───────────────────────────
const marketplaceFields = [
  { key: "name",        label: "Item Name",           placeholder: "Enter crop or produce name",                  required: true },
  { key: "category",   label: "Category",             type: "select", options: ["Vegetables", "Fruits", "Crops", "Spices", "Dairy", "Other"], required: true },
  { key: "price",      label: "Price Per Kg",         type: "number", placeholder: "Enter price per kg",           required: true },
  { key: "stock",      label: "Available Stock (kg)", type: "number", placeholder: "e.g. 500",                    required: true },
  { key: "location",   label: "Farm Location",        placeholder: "Enter your location",                         required: true },
  { key: "description",label: "Description",          type: "textarea", placeholder: "Share quality, harvest timing, or handling details", required: true },
];

const initialForm = {
  name: "", category: "Vegetables", price: "",
  stock: "", location: "", description: "", image: DEFAULT_IMAGE,
};

const inputStyle = {
  width: "100%", background: "#050505",
  border: "1px solid rgba(212,175,55,0.22)", borderRadius: 12,
  padding: "12px 14px", color: "#ffffff", fontSize: 13,
  outline: "none", fontFamily: "'Montserrat', sans-serif",
};

// ── Helper: display stock ─────────────────────────────────────────────────────
function stockDisplay(stock) {
  if (stock > 0)          return `${stock} kg`;
  if (stock === 0)        return "Out of Stock";
  return "—";
}
function stockColor(stock) {
  if (stock > 0)  return "#4ade80";
  if (stock === 0)return "#f87171";
  return "rgba(255,255,255,0.4)";
}

// ─── Farmer listing card ──────────────────────────────────────────────────────
function FarmerListingCard({ item, onEdit, onDelete }) {
  const outOfStock = item.stock === 0 || item.availability === "Out of Stock";

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-[18px] border bg-black font-montserrat"
      style={{ borderColor: "#d4af37", boxShadow: "0 0 0 1px rgba(212,175,55,0.26), 0 12px 28px rgba(0,0,0,0.42)" }}
    >
      <div
        className="relative h-40 border-b"
        style={{ backgroundImage: item.image ? `url("${item.image}")` : "linear-gradient(135deg,#1a3a1a 0%,#050505 100%)", backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat", borderColor: "rgba(201,168,76,0.2)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
        <div className="absolute left-3 top-3 z-[1] rounded-full border border-[#FFF085]/35 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#FFF085]">
          {item.category}
        </div>
        {outOfStock && (
          <div className="absolute right-3 top-3 z-[1] rounded-full border border-red-400/50 bg-red-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-red-400">
            Out of Stock
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="mb-1 text-[15px] font-bold text-white">{item.name}</div>
          <div className="text-xs text-white/60">{item.location}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">₹{item.price}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Per Kg</div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold" style={{ color: stockColor(item.stock) }}>
              {stockDisplay(item.stock)}
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Stock</div>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-white/70">{item.description}</p>

        <div className="flex gap-3 mt-auto pt-1">
          <button type="button" onClick={() => onEdit(item)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#FFF085] text-sm font-bold text-black shadow-lg shadow-black/30 transition hover:brightness-95">
            <PencilIcon className="size-4" /> Edit
          </button>
          <button type="button" onClick={() => onDelete(item._id || item.id)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-black/30 transition hover:bg-red-500">
            <TrashIcon className="size-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SP browse card ───────────────────────────────────────────────────────────
function MarketplaceProductCard({ item, onViewDetails }) {
  const { cart, addMarketplaceItem, updateMarketplaceQty, removeMarketplaceItem } = UseAppContext();
  const [btnHover, setBtnHover] = useState(false);

  const cartItem   = cart.find((c) => (c._id || c.id) === (item._id || item.id) && c.cartModule === "Marketplace");
  const cartQty    = cartItem?.quantity || 0;
  const isUnavailable = item.availability === "Out of Stock" || item.stock === 0;

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-[18px] border bg-black font-montserrat transition-all duration-200 hover:-translate-y-1"
      style={{ borderColor: "#d4af37", boxShadow: "0 0 0 1px rgba(212,175,55,0.26), 0 12px 28px rgba(0,0,0,0.42)" }}
    >
      <div
        className="relative h-36 border-b"
        style={{ backgroundImage: `url("${item.image || DEFAULT_IMAGE}")`, backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat", borderColor: "rgba(201,168,76,0.2)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/55" />
        <div className="absolute left-3 top-3 z-10 rounded-full border border-[#FFF085]/35 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#FFF085]">
          {item.category}
        </div>
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-[11px] text-white/80">
          <span className="text-gold">•</span>
          <span>{item.location || "Farm Fresh"}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="text-[15px] font-bold leading-tight text-white">{item.name}</div>
          <div className="mt-1 line-clamp-2 text-[11px] font-medium leading-5 text-white/55">{item.description}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-[15px] font-black leading-none text-[#FFF085]">₹{item.price}</div>
            <div className="mt-1 text-[9px] text-white/45">per kg</div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-[13px] font-bold leading-none" style={{ color: stockColor(item.stock) }}>
              {stockDisplay(item.stock)}
            </div>
            <div className="mt-1 text-[9px] text-white/45">stock</div>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            onClick={() => !isUnavailable && onViewDetails && onViewDetails(item)}
            disabled={isUnavailable}
            style={{
              flex: 1, background: isUnavailable ? "transparent" : btnHover ? "#ffffff" : "#D4AF37",
              color: isUnavailable ? "rgba(255,255,255,0.5)" : "#0a1a0c",
              border: isUnavailable ? "1px solid rgba(212,175,55,0.28)" : "none",
              padding: "9px 0", borderRadius: 8, fontSize: 12, fontWeight: 700,
              cursor: isUnavailable ? "not-allowed" : "pointer", transition: "background 0.18s",
            }}
          >
            {isUnavailable ? "Out of Stock" : "View Details"}
          </button>

          {!isUnavailable && (
            cartQty > 0 ? (
              <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"space-between", border:"1px solid rgba(212,175,55,0.5)", borderRadius:8, background:"rgba(212,175,55,0.08)", overflow:"hidden" }}>
                <button onClick={() => { if (cartQty <= 1) removeMarketplaceItem(item._id||item.id, "Marketplace"); else updateMarketplaceQty(item._id||item.id, "Marketplace", -1); }}
                  style={{ width:34, height:"100%", background:"transparent", border:"none", color:"#FFF085", fontSize:18, fontWeight:800, cursor:"pointer" }}>−</button>
                <span style={{ color:"#FFF085", fontSize:13, fontWeight:800 }}>{cartQty} kg</span>
                <button onClick={() => updateMarketplaceQty(item._id||item.id, "Marketplace", 1)}
                  style={{ width:34, height:"100%", background:"transparent", border:"none", color:"#FFF085", fontSize:18, fontWeight:800, cursor:"pointer" }}>+</button>
              </div>
            ) : (
              <button
                onClick={() => addMarketplaceItem("Marketplace", { ...item, _id: item._id || item.id })}
                style={{ flex:1, background:"transparent", color:"#FFF085", border:"1px solid rgba(212,175,55,0.28)", padding:"9px 0", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer" }}
              >
                Add to Cart
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Marketplace() {
  const location    = useLocation();
  const isFarmerRoute = location.pathname.startsWith("/farmer");

  const { isOpen, setIsOpen, axios, addBooking } = UseAppContext();
  const [search, setSearch]           = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [listings, setListings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("about");
  const [bookingForm, setBookingForm] = useState({ quantity:"", contactNumber:"", deliveryAddress:"", notes:"" });
  const [submitting, setSubmitting]   = useState(false);

  const filters = ["All", "Vegetables", "Fruits", "Crops", "Spices", "Dairy", "Other"];

  const fetchListings = async () => {
    try {
      const ep = isFarmerRoute ? "/api/marketplace/mine" : "/api/marketplace/all";
      const { data } = await axios.get(ep);
      if (data.success) setListings(data.listings || []);
    } catch (error) { console.log(error.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchListings(); }, [isFarmerRoute]);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch = !query ||
        (item.name || "").toLowerCase().includes(query) ||
        (item.location || "").toLowerCase().includes(query) ||
        (item.description || "").toLowerCase().includes(query);
      const matchesCategory = activeFilter === "All" || item.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [listings, activeFilter, search]);

  const handleOpenForm  = () => { setEditingItem(null); setShowFormModal(true); };
  const handleEdit      = (item) => { setEditingItem(item); setShowFormModal(true); };
  const handleCloseForm = () => { setEditingItem(null); setShowFormModal(false); };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        const { data } = await axios.post("/api/marketplace/edit", {
          listingId: editingItem._id, ...formData,
          price: Number(formData.price), stock: Number(formData.stock),
        });
        if (data.success) setListings((prev) => prev.map((l) => l._id === editingItem._id ? { ...l, ...data.listing } : l));
        else alert(data.message);
      } else {
        const { data } = await axios.post("/api/marketplace/post", {
          ...formData, price: Number(formData.price), stock: Number(formData.stock),
        });
        if (data.success) setListings((prev) => [data.listing, ...prev]);
        else alert(data.message);
      }
    } catch (error) { alert(error.message); }
    handleCloseForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      const { data } = await axios.post("/api/marketplace/delete", { listingId: id });
      if (data.success) setListings((prev) => prev.filter((l) => l._id !== id));
      else alert(data.message);
    } catch (error) { alert(error.message); }
  };

  const resetBookingForm = () => setBookingForm({ quantity:"", contactNumber:"", deliveryAddress:"", notes:"" });

  const handleBookingSubmit = async () => {
    if (!bookingForm.quantity || !bookingForm.contactNumber || !bookingForm.deliveryAddress) {
      return alert("Please fill in all required purchase details.");
    }
    if (Number(bookingForm.quantity) > selectedItem.stock) {
      return alert(`Only ${selectedItem.stock} kg available. Please reduce quantity.`);
    }
    setSubmitting(true);
    try {
      addBooking({
        module: "Marketplace", itemName: selectedItem.name,
        providerName: selectedItem.owner, image: selectedItem.image,
        priceLabel: `₹${selectedItem.price} / kg`,
        summary: `${bookingForm.quantity} kg requested • ${bookingForm.deliveryAddress}`,
        notificationTitle: "Marketplace purchase",
        notificationDetail: `${selectedItem.name} purchase request placed for ${bookingForm.quantity} kg.`,
      });
      alert(`Purchase request for ${selectedItem.name} sent successfully.`);
      setActiveDetailTab("about"); resetBookingForm(); setSelectedItem(null);
    } catch (error) { alert(error.message); }
    finally { setSubmitting(false); }
  };

  const pageTitle   = isFarmerRoute ? "Marketplace" : "Farm Marketplace";
  const resultLabel = activeFilter === "All" ? "showing all listings" : `showing ${activeFilter.toLowerCase()}`;

  return (
    <>
      <style>{`
        input::placeholder{color:rgba(255,255,255,0.58)!important}
        textarea::placeholder{color:rgba(255,255,255,0.58)!important}
        .kc-search-input::placeholder{color:rgba(17,17,17,0.55)!important}
        .kc-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.76);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:300}
        .kc-modal-panel{width:min(1080px,100%);max-height:min(90vh,980px);overflow-y:auto;background:#000;border:1px solid rgba(212,175,55,0.32);border-radius:22px;box-shadow:0 24px 60px rgba(0,0,0,0.5)}
        .kc-modal-grid{display:grid;grid-template-columns:1.15fr 1fr}
        .kc-booking-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        @media(max-width:860px){.kc-modal-grid{grid-template-columns:1fr}.kc-booking-grid{grid-template-columns:1fr}}
      `}</style>

      <div className="min-h-dvh bg-black">
        <SideNav />
        <div className={`flex min-h-dvh flex-col transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
          <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
            <ModuleHeader title={pageTitle} search={search} onSearchChange={setSearch} onOpenSidebar={() => setIsOpen(!isOpen)} />
            <ModuleFilters filters={filters} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-white font-montserrat font-bold text-lg animate-pulse">Loading marketplace...</p>
              </div>
            ) : isFarmerRoute ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-4">
                  <span className="font-montserrat text-sm font-bold text-white">{filteredListings.length} listing{filteredListings.length !== 1 ? "s" : ""} live</span>
                  <button onClick={handleOpenForm} className="rounded-[12px] bg-[#D4AF37] px-4 py-2 text-[12px] font-black uppercase tracking-[0.45px] text-[#0a1a0c] transition hover:-translate-y-[1px] hover:bg-white">
                    + Add Listing
                  </button>
                </div>
                <div className="flex-1 bg-black p-6">
                  {filteredListings.length === 0 ? (
                    <div className="flex min-h-[calc(100dvh-14rem)] flex-col items-center justify-center gap-6 text-center">
                      <p className="max-w-xl text-xl font-bold text-white">Start showcasing your crops and farm goods in the marketplace.</p>
                      <button onClick={handleOpenForm} className="rounded-[12px] bg-[#D4AF37] px-6 py-3 text-[13px] font-black uppercase tracking-[0.45px] text-[#0a1a0c] transition hover:-translate-y-[1px] hover:bg-white">
                        Add Your First Listing
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px]">
                      {filteredListings.map((item) => (
                        <FarmerListingCard key={item._id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 px-6 pt-4">
                  <span className="font-montserrat text-sm font-bold text-white">{filteredListings.length} item{filteredListings.length !== 1 ? "s" : ""} found</span>
                  <span className="font-montserrat text-xs text-white/60">· {resultLabel}</span>
                  {search.trim() && <span className="font-montserrat text-xs text-[#FFF085]">· matching "{search.trim()}"</span>}
                </div>
                {filteredListings.length === 0 ? (
                  <div className="px-6 py-10 font-montserrat text-sm text-white/70">No marketplace listings match your current search and filters.</div>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px] p-6">
                    {filteredListings.map((item) => (
                      <MarketplaceProductCard
                        key={item._id || item.id} item={item}
                        onViewDetails={(selected) => { setSelectedItem(selected); setActiveDetailTab("about"); resetBookingForm(); }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Farmer form modal */}
      {showFormModal && (
        <div className="kc-modal-overlay" onClick={handleCloseForm}>
          <div onClick={(e) => e.stopPropagation()} style={{ width:"min(860px,100%)", maxHeight:"min(88vh,920px)", overflow:"auto", background:"#000", border:"1px solid rgba(212,175,55,0.32)", borderRadius:"22px", boxShadow:"0 24px 60px rgba(0,0,0,0.5)" }}>
            <ServiceProviderCatalogForm
              title={editingItem ? "Edit Marketplace Listing" : "Add Marketplace Listing"}
              introText="List your produce, crop lots, or farm goods so buyers can review quality, quantity, and location at a glance."
              imageLabel="Upload listing image" uploadText="Click to upload marketplace image"
              submitText="Save Listing"
              initialData={editingItem || initialForm}
              fields={marketplaceFields}
              onBack={handleCloseForm} onSave={handleSave} isModal={true}
            />
          </div>
        </div>
      )}

      {/* SP detail / buy modal */}
      {!isFarmerRoute && selectedItem && (
        <div className="kc-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="kc-modal-panel font-montserrat" onClick={(e) => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 14px 0 14px", gap:12 }}>
              <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
                <div style={{ width:"fit-content", maxWidth:"100%", borderRadius:999, background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.22)", padding:4, display:"flex", gap:4, backdropFilter:"blur(12px)" }}>
                  {[{id:"about",label:"About Listing"},{id:"book",label:"Buy Now"}].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveDetailTab(tab.id)}
                      style={{ border:"none", borderRadius:999, padding:"10px 16px", cursor:"pointer", fontSize:13, fontWeight:700, color:activeDetailTab===tab.id?"#111111":"#FFF085", background:activeDetailTab===tab.id?"linear-gradient(135deg,#D4AF37 0%,#FFF085 100%)":"transparent", transition:"all 0.18s ease", whiteSpace:"nowrap" }}>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} style={{ border:"none", background:"rgba(255,255,255,0.08)", color:"#ffffff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18 }}>×</button>
            </div>

            <div className="kc-modal-grid" style={{ gridTemplateColumns:activeDetailTab==="book"?"1fr":undefined }}>
              {activeDetailTab === "about" && (
                <div style={{ padding:20, paddingTop:8, borderRight:"1px solid rgba(212,175,55,0.18)" }}>
                  <div style={{ position:"relative", height:290, borderRadius:18, overflow:"hidden", backgroundImage:`url("${selectedItem.image||DEFAULT_IMAGE}")`, backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat", marginBottom:14 }}>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(0,0,0,0.12) 0%,rgba(0,0,0,0.45) 100%)" }} />
                  </div>
                  <div style={{ marginTop:16, background:"#081D0C", border:"1px solid rgba(212,175,55,0.18)", borderRadius:16, padding:16 }}>
                    <div style={{ color:"#E7C957", fontWeight:700, fontSize:16, marginBottom:8 }}>About This Listing</div>
                    <div style={{ color:"rgba(255,255,255,0.8)", fontSize:14, lineHeight:1.7 }}>{selectedItem.description}</div>
                  </div>
                </div>
              )}

              <div style={{ padding:24, paddingTop:8, display:"flex", flexDirection:"column", gap:18, alignItems:activeDetailTab==="book"?"center":"stretch" }}>
                {activeDetailTab === "about" && (
                  <>
                    <div>
                      <div style={{ fontSize:26, fontWeight:800, color:"#E7C957", lineHeight:1.15 }}>{selectedItem.name}</div>
                      <div style={{ marginTop:8, color:"rgba(255,255,255,0.8)", fontSize:14 }}>Listed by farmer · {selectedItem.location}</div>
                    </div>
                    <div style={{ background:"#081D0C", border:"1px solid rgba(212,175,55,0.18)", borderRadius:16, padding:16 }}>
                      {[
                        { label:"Price",    value:`₹${selectedItem.price} per kg` },
                        { label:"Category", value:selectedItem.category },
                        { label:"Stock",    value:stockDisplay(selectedItem.stock) },
                        { label:"Location", value:selectedItem.location },
                      ].map((r, i, arr) => (
                        <div key={r.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, padding:"10px 0", borderBottom:i!==arr.length-1?"1px solid rgba(212,175,55,0.12)":"none" }}>
                          <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:0.5 }}>{r.label}</div>
                          <div style={{ color: r.label==="Stock" ? stockColor(selectedItem.stock) : "#ffffff", fontSize:14, fontWeight:600, textAlign:"right" }}>{r.value}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeDetailTab === "book" && (
                  <div style={{ display:"flex", justifyContent:"center", width:"100%" }}>
                    <div style={{ width:"min(760px,100%)", background:"linear-gradient(180deg,rgba(16,31,21,0.96) 0%,rgba(7,13,9,0.98) 100%)", border:"1px solid rgba(212,175,55,0.24)", borderRadius:24, padding:24, display:"flex", flexDirection:"column", gap:16, boxShadow:"0 20px 40px rgba(0,0,0,0.35)" }}>
                      <div>
                        <div style={{ color:"#FFF085", fontSize:18, fontWeight:800 }}>Marketplace Purchase</div>
                        <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginTop:4 }}>
                          Define quantity in kg and delivery details to buy from this farmer listing.
                          <span style={{ color:"#4ade80", marginLeft:6, fontWeight:700 }}>
                            {selectedItem.stock} kg available
                          </span>
                        </div>
                      </div>
                      <div className="kc-booking-grid">
                        <label style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          <span style={{ color:"#FFF085", fontSize:12, fontWeight:700 }}>Quantity (kg) *</span>
                          <input
                            type="number" min="1" max={selectedItem.stock}
                            placeholder={`Max ${selectedItem.stock} kg`}
                            value={bookingForm.quantity}
                            onChange={(e) => setBookingForm(p => ({ ...p, quantity: e.target.value }))}
                            style={inputStyle}
                          />
                        </label>
                        <label style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          <span style={{ color:"#FFF085", fontSize:12, fontWeight:700 }}>Contact Number *</span>
                          <input type="tel" placeholder="Your phone number" value={bookingForm.contactNumber} onChange={(e)=>setBookingForm(p=>({...p,contactNumber:e.target.value}))} style={inputStyle}/>
                        </label>
                      </div>
                      <label style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        <span style={{ color:"#FFF085", fontSize:12, fontWeight:700 }}>Delivery Address *</span>
                        <input type="text" placeholder="Full delivery address" value={bookingForm.deliveryAddress} onChange={(e)=>setBookingForm(p=>({...p,deliveryAddress:e.target.value}))} style={inputStyle}/>
                      </label>
                      <label style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        <span style={{ color:"#FFF085", fontSize:12, fontWeight:700 }}>Additional Notes</span>
                        <textarea rows={2} placeholder="Any packaging or delivery instructions..." value={bookingForm.notes} onChange={(e)=>setBookingForm(p=>({...p,notes:e.target.value}))} style={{...inputStyle,resize:"vertical",minHeight:64}}/>
                      </label>
                      <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
                        <button onClick={()=>{setActiveDetailTab("about");resetBookingForm();}} style={{ border:"1px solid rgba(212,175,55,0.28)", background:"transparent", color:"#FFF085", borderRadius:12, padding:"11px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Cancel</button>
                        <button onClick={handleBookingSubmit} disabled={submitting} style={{ border:"none", background:submitting?"rgba(212,175,55,0.4)":"linear-gradient(135deg,#FFF085 0%,#D4AF37 100%)", color:"#111", borderRadius:12, padding:"11px 18px", fontSize:13, fontWeight:800, cursor:submitting?"not-allowed":"pointer" }}>
                          {submitting ? "Sending..." : "Confirm Purchase"}
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
