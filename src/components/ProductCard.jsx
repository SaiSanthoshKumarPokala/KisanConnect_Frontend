import { UseAppContext } from "../context/AppContext";

function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#FFF085]/34 bg-black/[0.56] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#FFF085]">
      {category}
    </span>
  );
}

export default function ProductCard({
  name,
  seller,
  location,
  price,
  category,
  image,
  description,
  availability,
  onViewDetails,
  showAddToCart = false,
  cartModule = "Shop",
  _id,
}) {
  const { cart, addShopItem, updateShopQty, removeShopItem } = UseAppContext();

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
    <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[#d4af37] bg-black font-montserrat shadow-[0_0_0_1px_rgba(212,175,55,0.26),0_12px_28px_rgba(0,0,0,0.42)] transition-all duration-200 hover:-translate-y-1">
      <div
        className="relative h-36 border-b border-[#c9a84c]/20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image || "/urea.png"})` }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/55" />
        <div className="absolute left-3 top-3 z-10">
          <CategoryBadge category={category || "Product"} />
        </div>
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-[11px] text-white/80">
          <span className="text-[#d4af37]">•</span>
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

        <div className="flex items-center gap-3 rounded-xl border border-[#d4af37]/20 bg-[#050505] px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#FFF085] to-gold text-[12px] font-extrabold text-black">
            {ownerInitial}
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.5px] text-white/50">Seller</div>
            <div className="text-[13px] font-semibold text-white/80">{seller || "Shop"}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-[#d4af37]/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-[16px] font-black leading-none text-[#FFF085]">₹{price || 500}</div>
            <div className="mt-1 text-[9px] text-white/45">per kg</div>
          </div>
          <div className="rounded-lg border border-[#d4af37]/20 bg-[#050505] px-2 py-3 text-center">
            <div className={`text-[16px] font-black leading-none ${isUnavailable ? "text-red-400" : "text-green-400"}`}>
              {isUnavailable ? "Sold out" : "In Stock"}
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Status</div>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          {/* View Details button */}
          <button
            type="button"
            onClick={() => onViewDetails && onViewDetails(itemPayload)}
            disabled={isUnavailable}
            className={`flex-1 rounded-lg py-2.25 text-xs font-bold transition-all duration-180 ease-out ${
              isUnavailable
                ? "cursor-not-allowed border border-[#d4af37]/[0.28] bg-transparent text-white/50"
                : "cursor-pointer border-none bg-gold text-[#0a1a0c] hover:-translate-y-px hover:bg-white"
            }`}
          >
            {isUnavailable ? "Sold out" : "View Details"}
          </button>

          {/* Add to Cart / Qty adjuster */}
          {showAddToCart && (
            cartQty > 0 ? (
              /* ── Inline qty adjuster ── */
              <div className="flex flex-1 items-center justify-between overflow-hidden rounded-lg border border-[#d4af37]/50 bg-[#d4af37]/8">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="flex h-full w-8.5 shrink-0 cursor-pointer items-center justify-center border-none bg-transparent text-lg font-extrabold text-[#FFF085]"
                >
                  −
                </button>
                <span className="text-sm font-extrabold text-[#FFF085]">{cartQty}</span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={isUnavailable}
                  className="flex h-full w-8.5 shrink-0 cursor-pointer items-center justify-center border-none bg-transparent text-lg font-extrabold text-[#FFF085] disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            ) : (
              /* ── Add to Cart button ── */
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isUnavailable}
                className={`flex-1 rounded-lg py-2.25 text-xs font-bold transition-colors duration-180 ${
                  isUnavailable
                    ? "cursor-not-allowed border border-[#d4af37]/12 bg-transparent text-white/35"
                    : "cursor-pointer border border-[#d4af37]/[0.28] bg-transparent text-[#FFF085] hover:bg-[#d4af37]/10"
                }`}
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