export default function CartItemRow({ item, onIncrease, onDecrease, onRemove }) {
  const itemId = item._id || item.id;
  const subtotal = (item.price || 0) * (item.quantity || 1);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[14px] border border-gold/20 bg-[#050505] p-4 font-montserrat">
      <div
        className="size-14 shrink-0 rounded-[10px] border border-gold/20 bg-[#0d0d0d] bg-cover bg-center"
        style={{ backgroundImage: `url("${item.image || "/urea.png"}")` }}
      />
      
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-white">{item.name}</p>
        <p className="truncate text-xs text-white/50">
          {item.seller || item.brand || item.category || "—"}
        </p>
        <p className="mt-0.5 text-xs font-bold text-gold">₹{item.price} / kg</p>
      </div>

      <div className="flex items-center overflow-hidden rounded-[10px] border border-gold/30 bg-gold/5">
        <button
          type="button"
          onClick={() => onDecrease(itemId)}
          aria-label="Decrease quantity"
          className="flex size-8 cursor-pointer items-center justify-center text-lg font-black text-gold transition-colors hover:bg-gold/10"
        >
          −
        </button>
        <span className="w-12 text-center text-sm font-bold text-amber-200">
          {item.quantity || 1} kg
        </span>
        <button
          type="button"
          onClick={() => onIncrease(itemId)}
          aria-label="Increase quantity"
          className="flex size-8 cursor-pointer items-center justify-center text-lg font-black text-gold transition-colors hover:bg-gold/10"
        >
          +
        </button>
      </div>

      <div className="w-20 shrink-0 text-right">
        <p className="text-sm font-black text-amber-200">₹{subtotal.toLocaleString()}</p>
        <p className="text-[10px] text-white/40">subtotal</p>
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