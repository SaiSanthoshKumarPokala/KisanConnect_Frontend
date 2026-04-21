import { useMemo, useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import { UseAppContext } from "../context/AppContext";
import { useLocation } from "react-router";

const inputStyle = {
  width: "100%", background: "#050505", border: "1px solid rgba(212,175,55,0.22)",
  borderRadius: 12, padding: "12px 14px", color: "#ffffff", fontSize: 13,
  outline: "none", fontFamily: "'Montserrat', sans-serif",
};

export default function Shop() {
  const location = useLocation();
  const { isOpen, setIsOpen, axios, addBooking } = UseAppContext();
  const [search, setSearch]           = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const filters = ["All", "Fertilizers", "Seeds", "Pesticides", "Equipment"];
  const cartEnabled = location.pathname.startsWith("/farmer") || location.pathname.startsWith("/serviceprovider");

  const [selectedItem, setSelectedItem]       = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("about");
  const [bookingForm, setBookingForm] = useState({ quantity: "", deliveryAddress: "", contactNumber: "", notes: "" });

  // ── Fetch products from backend ───────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/shop/all");
      if (data.success) setProducts(data.products);
    } catch (error) { console.log(error.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetBookingForm = () => setBookingForm({ quantity: "", deliveryAddress: "", contactNumber: "", notes: "" });

  const handleBookingInput = (field, value) => setBookingForm((prev) => ({ ...prev, [field]: value }));

  const handleBookingSubmit = () => {
    if (!bookingForm.quantity || !bookingForm.deliveryAddress || !bookingForm.contactNumber) {
      window.alert("Please fill in all required purchase details.");
      return;
    }
    addBooking({
      module: "Shop", itemName: selectedItem.name, providerName: selectedItem.seller || selectedItem.brand,
      image: selectedItem.image, priceLabel: `₹${selectedItem.price} / unit`,
      summary: `${bookingForm.quantity} requested • ${bookingForm.deliveryAddress}`,
      notificationTitle: "Shop purchase request",
      notificationDetail: `${selectedItem.name} purchase request placed for ${bookingForm.quantity}.`,
    });
    window.alert(`Purchase request for ${selectedItem.name} sent successfully.`);
    setActiveDetailTab("about"); resetBookingForm(); setSelectedItem(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch = !query ||
        (item.name || "").toLowerCase().includes(query) ||
        (item.brand || "").toLowerCase().includes(query) ||
        (item.description || "").toLowerCase().includes(query);
      const matchesCategory = activeFilter === "All" || item.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, activeFilter, search]);

  return (
    <>
      <style>{`
        input::placeholder { color: rgba(255,255,255,0.58) !important; }
        textarea::placeholder { color: rgba(255,255,255,0.58) !important; }
        .kc-search-input::placeholder { color: rgba(17,17,17,0.55) !important; }
        .kc-modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.76);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:300; }
        .kc-modal-panel { width:min(1080px,100%);max-height:min(90vh,980px);overflow-y:auto;background:#000000;border:1px solid rgba(212,175,55,0.32);border-radius:22px;box-shadow:0 24px 60px rgba(0,0,0,0.5); }
        .kc-modal-grid { display:grid;grid-template-columns:1.15fr 1fr; }
        .kc-booking-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
        @media(max-width:860px){.kc-modal-grid{grid-template-columns:1fr}.kc-booking-grid{grid-template-columns:1fr}}
      `}</style>

      <div className="min-h-dvh bg-black">
        <SideNav />
        <div className={`flex min-h-dvh flex-col transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
          <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
            <ModuleHeader title="Shop" search={search} onSearchChange={setSearch} onOpenSidebar={() => setIsOpen(!isOpen)} />
            <ModuleFilters filters={filters} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-white font-montserrat font-bold text-lg animate-pulse">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 px-6 pt-4">
                  <span className="font-montserrat text-sm font-bold text-white">{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found</span>
                  <span className="font-montserrat text-xs text-white/60">· {activeFilter === "All" ? "showing all products" : `showing ${activeFilter.toLowerCase()}`}</span>
                  {search.trim() && <span className="font-montserrat text-xs text-[#FFF085]">· matching "{search.trim()}"</span>}
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="px-6 py-10 font-montserrat text-sm text-white/70">No products match your current search and filters.</div>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px] p-6">
                    {filteredProducts.map((item) => (
                      <ProductCard
                        key={item._id}
                        _id={item._id}
                        name={item.name} seller={item.brand} location={item.location || ""}
                        price={item.price}
                        category={item.category} image={item.image}
                        description={item.description} availability="Available"
                        showAddToCart={cartEnabled} cartModule="Shop"
                        onViewDetails={(selected) => { setSelectedItem({ ...selected, owner: item.owner }); setActiveDetailTab("about"); resetBookingForm(); }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selectedItem && (
        <div className="kc-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="kc-modal-panel font-montserrat" onClick={(e) => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 14px 0 14px", gap:12 }}>
              <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
                <div style={{ width:"fit-content", maxWidth:"100%", borderRadius:999, background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.22)", padding:4, display:"flex", gap:4, backdropFilter:"blur(12px)" }}>
                  {[{id:"about",label:"About Product"},{id:"book",label:"Buy Now"}].map((tab) => (
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
                  <div style={{ position:"relative", height:290, borderRadius:18, overflow:"hidden", backgroundImage:`url(${selectedItem.image||"/urea.png"})`, backgroundSize:"cover", backgroundPosition:"center", marginBottom:14 }}>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(0,0,0,0.12) 0%,rgba(0,0,0,0.45) 100%)" }} />
                  </div>
                  <div style={{ marginTop:16, background:"#081D0C", border:"1px solid rgba(212,175,55,0.18)", borderRadius:16, padding:16 }}>
                    <div style={{ color:"#E7C957", fontWeight:700, fontSize:16, marginBottom:8 }}>About This Product</div>
                    <div style={{ color:"rgba(255,255,255,0.86)", fontSize:15, lineHeight:1.85 }}>{selectedItem.description}</div>
                  </div>
                </div>
              )}

              <div style={{ padding:24, paddingTop:8, display:"flex", flexDirection:"column", gap:18, alignItems:activeDetailTab==="book"?"center":"stretch" }}>
                {activeDetailTab === "about" && (
                  <>
                    <div>
                      <div style={{ fontSize:26, fontWeight:800, color:"#E7C957", lineHeight:1.15 }}>{selectedItem.name}</div>
                      <div style={{ marginTop:8, color:"rgba(255,255,255,0.8)", fontSize:14 }}>Sold by {selectedItem.seller}</div>
                    </div>
                    <div style={{ background:"#081D0C", border:"1px solid rgba(212,175,55,0.18)", borderRadius:16, padding:16 }}>
                      {[{label:"Price",value:`₹${selectedItem.price} per kg`},{label:"Category",value:selectedItem.category},{label:"Stock",value:`${selectedItem.stock} kg`}].map((item,i,arr)=>(
                        <div key={item.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, padding:"10px 0", borderBottom:i!==arr.length-1?"1px solid rgba(212,175,55,0.12)":"none" }}>
                          <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:0.5 }}>{item.label}</div>
                          <div style={{ color:"#ffffff", fontSize:14, fontWeight:600, textAlign:"right" }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeDetailTab === "book" && (
                  <div style={{ display:"flex", justifyContent:"center", width:"100%" }}>
                    <div style={{ width:"min(760px,100%)", background:"linear-gradient(180deg,rgba(16,31,21,0.96) 0%,rgba(7,13,9,0.98) 100%)", border:"1px solid rgba(212,175,55,0.24)", borderRadius:24, padding:24, display:"flex", flexDirection:"column", gap:16, boxShadow:"0 20px 40px rgba(0,0,0,0.35)" }}>
                      <div>
                        <div style={{ color:"#FFF085", fontSize:18, fontWeight:800 }}>Purchase Details</div>
                        <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginTop:4 }}>Add to cart and head to the cart page to checkout, or fill details here to send a direct request.</div>
                      </div>
                      <div className="kc-booking-grid">
                        <label style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          <span style={{ color:"#FFF085", fontSize:12, fontWeight:700 }}>Quantity (kg) *</span>
                          <input type="number" min="1" max={selectedItem.stock} placeholder={`Max ${selectedItem.stock} kg`} value={bookingForm.quantity} onChange={(e)=>handleBookingInput("quantity",e.target.value)} style={inputStyle}/>
                        </label>
                        <label style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          <span style={{ color:"#FFF085", fontSize:12, fontWeight:700 }}>Contact Number *</span>
                          <input type="tel" placeholder="Your phone number" value={bookingForm.contactNumber} onChange={(e)=>handleBookingInput("contactNumber",e.target.value)} style={inputStyle}/>
                        </label>
                      </div>
                      <label style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        <span style={{ color:"#FFF085", fontSize:12, fontWeight:700 }}>Delivery Address *</span>
                        <input type="text" placeholder="Full delivery address" value={bookingForm.deliveryAddress} onChange={(e)=>handleBookingInput("deliveryAddress",e.target.value)} style={inputStyle}/>
                      </label>
                      <label style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        <span style={{ color:"#FFF085", fontSize:12, fontWeight:700 }}>Notes</span>
                        <textarea rows={2} placeholder="Any delivery instructions..." value={bookingForm.notes} onChange={(e)=>handleBookingInput("notes",e.target.value)} style={{...inputStyle,resize:"vertical",minHeight:64}}/>
                      </label>
                      <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
                        <button onClick={()=>{setActiveDetailTab("about");resetBookingForm();}} style={{ border:"1px solid rgba(212,175,55,0.28)", background:"transparent", color:"#FFF085", borderRadius:12, padding:"11px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Cancel</button>
                        <button onClick={handleBookingSubmit} style={{ border:"none", background:"linear-gradient(135deg,#FFF085 0%,#D4AF37 100%)", color:"#111111", borderRadius:12, padding:"11px 18px", fontSize:13, fontWeight:800, cursor:"pointer" }}>Confirm Order</button>
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
