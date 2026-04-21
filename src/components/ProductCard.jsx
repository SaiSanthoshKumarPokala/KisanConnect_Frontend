import { useState } from "react";
import { UseAppContext } from "../context/AppContext";

function CategoryBadge({ category }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px]"
      style={{ background: "rgba(0,0,0,0.56)", borderColor: "rgba(255,240,133,0.34)", color: "#FFF085" }}
    >
      {category}
    </span>
  );
}

export default function ProductCard({
  name, seller, location, price,
  category, image, description, availability,
  onViewDetails, showAddToCart = false, cartModule = "Shop",
  _id,
}) {
  const { cart, addShopItem, updateShopQty, removeShopItem } = UseAppContext();
  const [btnHover, setBtnHover] = useState(false);

  const itemPayload = { _id, name, seller, location, price, category, image, description, availability };
  const isUnavailable = availability === "Out of Stock" || availability === "Booked";

  // Check if this product is already in cart
  const cartItem = cart.find((c) => c._id === _id && c.cartModule === cartModule);
  const cartQty  = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addShopItem(cartModule, itemPayload);
  };

  const handleIncrease = () => {
    updateShopQty(_id, cartModule, 1);
  };

  const handleDecrease = () => {
    if (cartQty <= 1) {
      removeShopItem(_id, cartModule);
    } else {
      updateShopQty(_id, cartModule, -1);
    }
  };

  const ownerInitial = seller?.charAt(0)?.toUpperCase() || "S";
  const subtitle = description || "Reliable agricultural supply for day-to-day farm needs.";

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-[18px] border bg-black font-montserrat transition-all duration-200 hover:-translate-y-1"
      style={{ borderColor: "#d4af37", boxShadow: "0 0 0 1px rgba(212,175,55,0.26), 0 12px 28px rgba(0,0,0,0.42)" }}
    >
      <div
        className="relative h-36 border-b bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image || "/urea.png"})`, borderColor: "rgba(201,168,76,0.2)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/55" />
        <div className="absolute left-3 top-3 z-10">
          <CategoryBadge category={category || "Product"} />
        </div>
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-[11px] text-white/80">
          <span className="text-gold">•</span>
          <span>{location || "Available across your region"}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[15px] font-bold leading-tight text-white">{name || "Product"}</div>
            <div className="mt-1 line-clamp-2 text-[11px] font-medium leading-5 text-white/55">{subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-[12px] border border-gold/20 bg-[#050505] px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF085] to-[#D4AF37] text-[12px] font-extrabold text-black">
            {ownerInitial}
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.5px] text-white/50">Seller</div>
            <div className="text-[13px] font-semibold text-white/80">{seller || "Shop"}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-[16px] font-black leading-none text-[#FFF085]">₹{price || 500}</div>
            <div className="mt-1 text-[9px] text-white/45">per kg</div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className={`text-[16px] font-black leading-none ${isUnavailable ? "text-red-400" : "text-green-400"}`}>
              {isUnavailable ? "Sold out" : "In Stock"}
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Status</div>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          {/* View Details button */}
          <button
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            onClick={() => onViewDetails && onViewDetails(itemPayload)}
            disabled={isUnavailable}
            style={{
              flex: 1,
              background: isUnavailable ? "transparent" : btnHover ? "#ffffff" : "#D4AF37",
              color: isUnavailable ? "rgba(255,255,255,0.5)" : "#0a1a0c",
              border: isUnavailable ? "1px solid rgba(212,175,55,0.28)" : "none",
              padding: "9px 0", borderRadius: 8, fontSize: 12, fontWeight: 700,
              cursor: isUnavailable ? "not-allowed" : "pointer",
              transition: "background 0.18s, transform 0.18s ease",
              transform: btnHover && !isUnavailable ? "translateY(-1px)" : "translateY(0)",
            }}
          >
            {isUnavailable ? "Sold out" : "View Details"}
          </button>

          {/* Add to Cart / Qty adjuster */}
          {showAddToCart && (
            cartQty > 0 ? (
              /* ── Inline qty adjuster ── */
              <div
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
                  border: "1px solid rgba(212,175,55,0.5)", borderRadius: 8,
                  background: "rgba(212,175,55,0.08)", overflow: "hidden",
                }}
              >
                <button
                  onClick={handleDecrease}
                  style={{ width: 34, height: "100%", background: "transparent", border: "none", color: "#FFF085", fontSize: 18, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}
                >
                  −
                </button>
                <span style={{ color: "#FFF085", fontSize: 14, fontWeight: 800 }}>{cartQty}</span>
                <button
                  onClick={handleIncrease}
                  disabled={isUnavailable}
                  style={{ width: 34, height: "100%", background: "transparent", border: "none", color: "#FFF085", fontSize: 18, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}
                >
                  +
                </button>
              </div>
            ) : (
              /* ── Add to Cart button ── */
              <button
                onClick={handleAddToCart}
                disabled={isUnavailable}
                style={{
                  flex: 1, background: "transparent",
                  color: isUnavailable ? "rgba(255,255,255,0.35)" : "#FFF085",
                  border: `1px solid ${isUnavailable ? "rgba(212,175,55,0.12)" : "rgba(212,175,55,0.28)"}`,
                  padding: "9px 0", borderRadius: 8, fontSize: 12, fontWeight: 700,
                  cursor: isUnavailable ? "not-allowed" : "pointer",
                  transition: "background 0.18s",
                }}
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
