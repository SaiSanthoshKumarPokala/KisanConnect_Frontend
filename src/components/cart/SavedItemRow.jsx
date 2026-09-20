export default function SavedItemRow({ item, onRemove }) {
  const itemId = item.id || item._id;
  const title = item.name || item.vehicleType || "Saved Item";
  const subtitle = item.seller || item.owner || item.location || "Kisan Connect";
  const price = item.priceLabel || (item.price ? `₹${item.price}` : "—");

  return (
    <div className="flex items-center gap-4 rounded-[14px] border border-gold/15 bg-[#050505] p-4 font-montserrat">
      <div
        className="size-12 shrink-0 rounded-[10px] border border-gold/15 bg-[#0d0d0d] bg-cover bg-center"
        style={{ backgroundImage: `url("${item.image || ""}")` }}
      />

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <span className="rounded-full border border-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold/60">
            {item.cartModule}
          </span>
        </div>
        <p className="truncate text-sm font-bold text-white">{title}</p>
        <p className="text-xs text-white/50">
          {subtitle} · {price}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(itemId)}
        className="shrink-0 cursor-pointer text-xs font-bold text-red-400 transition-colors hover:text-red-300"
      >
        Remove
      </button>
    </div>
  );
}