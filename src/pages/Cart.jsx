import { useState } from "react";
import { useLocation } from "react-router";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import { UseAppContext } from "../context/AppContext";

const inputStyle = {
  width: "100%", background: "#050505",
  border: "1px solid rgba(212,175,55,0.22)", borderRadius: 12,
  padding: "12px 14px", color: "#ffffff", fontSize: 13,
  outline: "none", fontFamily: "'Montserrat', sans-serif",
};

// ─── Cart item row ─────────────────────────────────────────────────────────────
function CartItemRow({ item, onIncrease, onDecrease, onRemove }) {
  const subtotal = (item.price || 0) * (item.quantity || 1);
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[14px] border border-gold/20 bg-[#050505] p-4">
      <div className="h-14 w-14 shrink-0 rounded-[10px] border border-gold/20 bg-cover bg-center"
        style={{ backgroundImage: `url("${item.image || "/urea.png"}")`, backgroundColor: "#0d0d0d" }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{item.name}</p>
        <p className="text-xs text-white/50 truncate">{item.seller || item.brand || item.category || "—"}</p>
        <p className="text-xs font-bold text-gold mt-0.5">₹{item.price} / kg</p>
      </div>
      <div className="flex items-center rounded-[10px] border border-gold/30 overflow-hidden"
        style={{ background: "rgba(212,175,55,0.06)" }}>
        <button onClick={() => onDecrease(item._id || item.id)}
          className="w-8 h-8 flex items-center justify-center text-gold font-black text-lg cursor-pointer hover:bg-gold/10 transition-colors">−</button>
        <span className="w-10 text-center text-sm font-bold text-[#FFF085]">{item.quantity || 1} kg</span>
        <button onClick={() => onIncrease(item._id || item.id)}
          className="w-8 h-8 flex items-center justify-center text-gold font-black text-lg cursor-pointer hover:bg-gold/10 transition-colors">+</button>
      </div>
      <div className="text-right shrink-0 w-20">
        <p className="text-sm font-black text-[#FFF085]">₹{subtotal.toLocaleString()}</p>
        <p className="text-[10px] text-white/40">subtotal</p>
      </div>
      <button onClick={() => onRemove(item._id || item.id)}
        className="text-red-400 hover:text-red-300 text-xs font-bold cursor-pointer transition-colors shrink-0">Remove</button>
    </div>
  );
}

// ─── Saved-for-later row ───────────────────────────────────────────────────────
function SavedItemRow({ item, onRemove }) {
  const title    = item.name || item.vehicleType || "Saved Item";
  const subtitle = item.seller || item.owner || item.location || "Kisan Connect";
  const price    = item.priceLabel || (item.price ? `₹${item.price}` : "—");
  return (
    <div className="flex items-center gap-4 rounded-[14px] border border-gold/15 bg-[#050505] p-4">
      <div className="h-12 w-12 shrink-0 rounded-[10px] border border-gold/15 bg-cover bg-center"
        style={{ backgroundImage: `url("${item.image}")`, backgroundColor: "#0d0d0d" }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold/60 border border-gold/20 px-2 py-0.5 rounded-full">{item.cartModule}</span>
        </div>
        <p className="text-sm font-bold text-white truncate">{title}</p>
        <p className="text-xs text-white/50">{subtitle} · {price}</p>
      </div>
      <button onClick={() => onRemove(item.id || item._id)}
        className="text-red-400 hover:text-red-300 text-xs font-bold cursor-pointer transition-colors shrink-0">Remove</button>
    </div>
  );
}

// ─── Purchasable section with Razorpay ─────────────────────────────────────────
function PurchasableSection({ title, subtitle, items, total, onIncrease, onDecrease, onRemove, onPay, moduleLabel }) {
  const { axios } = UseAppContext();
  const [paying, setPaying] = useState(false);

  // Step 2: Open Razorpay checkout with the order from backend
  const initPay = (order, items, total) => {
    const options = {
      key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:      order.amount,
      currency:    order.currency || "INR",
      name:        "KisanConnect",
      description: `${moduleLabel} Purchase`,
      order_id:    order.id,
      handler:     async (response) => {
        // Step 3: Verify payment on backend after Razorpay callback
        try {
          const { data } = await axios.post("/api/buy/verify", {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
          });

          if (data.success) {
            // Payment verified — update local state (deducts stock, saves order)
            onPay(items, total);
            window.alert("Payment successful! Your order has been placed.");
          } else {
            window.alert("Payment verification failed: " + data.message);
          }
        } catch (error) {
          window.alert("Verification error: " + error.message);
        } finally {
          setPaying(false);
        }
      },
      prefill: { name: "", email: "", contact: "" },
      theme:   { color: "#D4AF37" },
      modal:   {
        ondismiss: () => { setPaying(false); }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Step 1: Create Razorpay order on backend with real cart data
  const createOrder = async () => {
    if (paying) return;
    setPaying(true);

    try {
      const product = items.map((item) => ({
        id:       item._id || item.id,
        name:     item.name,
        brand:    item.brand || item.seller || item.category || "",
        price:    item.price,
        quantity: item.quantity || 1,
        owner:    item.owner || null,
      }));

      const { data } = await axios.post("/api/buy/order", {
        product,
        amount: total, // in rupees — backend converts to paise
      });

      if (data.success) {
        initPay(data.order, items, total);
      } else {
        window.alert(data.message);
        setPaying(false);
      }
    } catch (error) {
      window.alert(error.message);
      setPaying(false);
    }
  };

  return (
    <section className="rounded-[22px] border border-gold/25 bg-[#040404] p-5 md:p-6">
      <div className="flex items-center justify-between mb-5 border-b border-gold/15 pb-4">
        <div>
          <h2 className="text-xl font-black text-[#FFF085]">{title}</h2>
          <p className="text-xs text-white/50 mt-1">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-[#FFF085]">₹{total.toLocaleString()}</p>
          <p className="text-xs text-white/40">total</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-5">
        {items.map((item) => (
          <CartItemRow
            key={item._id || item.id}
            item={item}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
          />
        ))}
      </div>

      <button
        onClick={createOrder}
        disabled={paying}
        className="w-full rounded-[14px] py-4 text-[15px] font-black text-[#0a1a0c] transition hover:-translate-y-px"
        style={{
          background:  paying ? "rgba(212,175,55,0.4)" : "linear-gradient(135deg,#FFF085 0%,#D4AF37 100%)",
          boxShadow:   "0 8px 24px rgba(212,175,55,0.3)",
          cursor:      paying ? "not-allowed" : "pointer",
        }}
      >
        {paying ? "Opening Payment..." : `Pay Now — ₹${total.toLocaleString()}`}
      </button>
    </section>
  );
}

// ─── Main Cart ─────────────────────────────────────────────────────────────────
export default function Cart() {
  const location = useLocation();
  const {
    cart, setCart, isOpen, setIsOpen, navigate,
    updateShopQty, removeShopItem, placeShopOrder,
    updateMarketplaceQty, removeMarketplaceItem, placeMarketplaceOrder,
  } = UseAppContext();

  const baseRolePath = location.pathname.startsWith("/serviceprovider") ? "/serviceprovider" : "/farmer";

  const shopItems  = cart.filter((item) => item.cartModule === "Shop");
  const mktItems   = cart.filter((item) => item.cartModule === "Marketplace");
  const otherItems = cart.filter((item) => item.cartModule !== "Shop" && item.cartModule !== "Marketplace");

  const shopTotal = shopItems.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  const mktTotal  = mktItems.reduce((sum, i)  => sum + (i.price || 0) * (i.quantity || 1), 0);

  // Shop handlers
  const handleShopIncrease = (id) => updateShopQty(id, "Shop", 1);
  const handleShopDecrease = (id) => updateShopQty(id, "Shop", -1);
  const handleShopRemove   = (id) => removeShopItem(id, "Shop");
  const handleShopPay = (items, total) => {
    placeShopOrder(items, total);
    setCart((prev) => prev.filter((item) => item.cartModule !== "Shop"));
  };

  // Marketplace handlers
  const handleMktIncrease = (id) => updateMarketplaceQty(id, "Marketplace", 1);
  const handleMktDecrease = (id) => updateMarketplaceQty(id, "Marketplace", -1);
  const handleMktRemove   = (id) => removeMarketplaceItem(id, "Marketplace");
  const handleMktPay = (items, total) => {
    placeMarketplaceOrder(items, total);
    setCart((prev) => prev.filter((item) => item.cartModule !== "Marketplace"));
  };

  const handleRemoveOther = (id) => setCart((prev) => prev.filter((item) => (item.id || item._id) !== id));

  return (
    <div className="min-h-dvh bg-black">
      <SideNav />
      <div className={`flex min-h-dvh flex-col transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          <ModuleHeader title="Cart" search="" onSearchChange={() => {}} onOpenSidebar={() => setIsOpen(!isOpen)} />

          <div className="flex-1 overflow-y-auto p-6 md:p-7">
            {cart.length === 0 ? (
              <div className="flex min-h-[calc(100dvh-190px)] flex-col justify-center rounded-[24px] border border-dashed border-gold/25 bg-[radial-gradient(circle_at_top,rgba(255,240,133,0.12),rgba(0,0,0,0.92)_55%)] px-6 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-black/60 text-[#FFF085]">
                  <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
                    <path d="M3 3h2l3.6 7.6L7 14h12M7 14l1.5-6h11l-2.5 6H7zm2 5a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="mt-6 text-3xl font-black tracking-tight text-[#FFF085]">Your cart is empty</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/60">Browse the shop or marketplace to add items.</p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <button onClick={() => navigate(`${baseRolePath}/shop`)}
                    className="rounded-[12px] bg-[#D4AF37] px-6 py-3 text-sm font-black text-[#0a1a0c] transition hover:-translate-y-px hover:bg-white">Browse Shop</button>
                  <button onClick={() => navigate(`${baseRolePath}/marketplace`)}
                    className="rounded-[12px] border border-gold/25 px-6 py-3 text-sm font-bold text-[#FFF085] transition hover:border-gold/40 hover:bg-white/5">Browse Marketplace</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {shopItems.length > 0 && (
                  <PurchasableSection
                    title="Shop Items"
                    subtitle={`${shopItems.length} item${shopItems.length !== 1 ? "s" : ""} from the shop`}
                    items={shopItems}
                    total={shopTotal}
                    onIncrease={handleShopIncrease}
                    onDecrease={handleShopDecrease}
                    onRemove={handleShopRemove}
                    onPay={handleShopPay}
                    moduleLabel="Shop"
                  />
                )}

                {mktItems.length > 0 && (
                  <PurchasableSection
                    title="Marketplace Items"
                    subtitle={`${mktItems.length} item${mktItems.length !== 1 ? "s" : ""} from farmers`}
                    items={mktItems}
                    total={mktTotal}
                    onIncrease={handleMktIncrease}
                    onDecrease={handleMktDecrease}
                    onRemove={handleMktRemove}
                    onPay={handleMktPay}
                    moduleLabel="Marketplace"
                  />
                )}

                {otherItems.length > 0 && (
                  <section className="rounded-[22px] border border-gold/15 bg-[#040404] p-5 md:p-6">
                    <div className="mb-4 border-b border-gold/10 pb-3">
                      <h2 className="text-lg font-black text-white/60">Saved for Later</h2>
                      <p className="text-xs text-white/40 mt-1">Items from other modules — visit each module to proceed</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {otherItems.map((item, i) => (
                        <SavedItemRow key={item.id || item._id || i} item={item} onRemove={handleRemoveOther} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
