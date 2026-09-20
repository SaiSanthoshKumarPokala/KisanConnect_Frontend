import { UseAppContext } from "../../context/AppContext";
import { DEFAULT_MARKETPLACE_IMAGE, formatStock } from "../../constants/marketplaceData";

export default function MarketplaceProductCard({ item, onViewDetails }) {
  const { cart = [], addMarketplaceItem, updateMarketplaceQty, removeMarketplaceItem } = UseAppContext();

  const cartItem = cart.find(
    (c) => (c._id || c.id) === (item._id || item.id) && c.cartModule === "Marketplace"
  );
  const cartQty = cartItem?.quantity || 0;
  const isUnavailable = item.availability === "Out of Stock" || item.stock === 0;

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-[18px] border bg-black font-montserrat shadow-[0_0_0_1px_rgba(212,175,55,0.26),0_12px_28px_rgba(0,0,0,0.42)] transition-all duration-200 hover:-translate-y-1"
      style={{ borderColor: "#d4af37" }}
    >
      <div
        className="relative h-36 border-b border-[rgba(201,168,76,0.2)] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${item.image || DEFAULT_MARKETPLACE_IMAGE}")` }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/55" />
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
          <h3 className="text-[15px] font-bold leading-tight text-white">{item.name}</h3>
          <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-5 text-white/55">
            {item.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-[15px] font-black leading-none text-[#FFF085]">₹{item.price}</div>
            <div className="mt-1 text-[9px] text-white/45">per kg</div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div
              className={`text-[13px] font-bold leading-none ${
                item.stock > 0
                  ? "text-emerald-400"
                  : item.stock === 0
                    ? "text-red-400"
                    : "text-white/40"
              }`}
            >
              {formatStock(item.stock)}
            </div>
            <div className="mt-1 text-[9px] text-white/45">stock</div>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            type="button"
            onClick={() => !isUnavailable && onViewDetails?.(item)}
            disabled={isUnavailable}
            className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-colors ${
              isUnavailable
                ? "cursor-not-allowed border border-gold/30 bg-transparent text-white/50"
                : "cursor-pointer bg-gold text-[#0a1a0c] hover:bg-white"
            }`}
          >
            {isUnavailable ? "Out of Stock" : "View Details"}
          </button>

          {!isUnavailable &&
            (cartQty > 0 ? (
              <div className="flex flex-1 items-center justify-between overflow-hidden rounded-lg border border-gold/50 bg-gold/10">
                <button
                  type="button"
                  onClick={() => {
                    if (cartQty <= 1) {
                      removeMarketplaceItem(item._id || item.id, "Marketplace");
                    } else {
                      updateMarketplaceQty(item._id || item.id, "Marketplace", -1);
                    }
                  }}
                  className="flex size-8 cursor-pointer items-center justify-center font-black text-amber-200 transition-colors hover:bg-gold/20"
                >
                  −
                </button>
                <span className="text-xs font-black text-amber-200">{cartQty} kg</span>
                <button
                  type="button"
                  onClick={() => updateMarketplaceQty(item._id || item.id, "Marketplace", 1)}
                  className="flex size-8 cursor-pointer items-center justify-center font-black text-amber-200 transition-colors hover:bg-gold/20"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  addMarketplaceItem("Marketplace", { ...item, _id: item._id || item.id })
                }
                className="flex-1 cursor-pointer rounded-lg border border-gold/30 bg-transparent py-2.5 text-xs font-bold text-[#FFF085] transition-colors hover:border-gold hover:bg-white/5"
              >
                Add to Cart
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}