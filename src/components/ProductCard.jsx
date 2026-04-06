function CategoryBadge({ category }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px]"
      style={{
        background: "rgba(0, 0, 0, 0.56)",
        borderColor: "rgba(255, 240, 133, 0.34)",
        color: "#FFF085",
      }}
    >
      {category}
    </span>
  );
}

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-[2px] text-[12px] text-gold">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? "opacity-100" : "opacity-20"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductCard(props) {
  const ownerInitial = props.seller ? props.seller.charAt(0).toUpperCase() : "S";

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-[18px] border bg-black font-montserrat transition-all duration-200 hover:-translate-y-1"
      style={{
        borderColor: "#d4af37",
        boxShadow:
          "0 0 0 1px rgba(212, 175, 55, 0.26), 0 12px 28px rgba(0, 0, 0, 0.42)",
      }}
    >
      <div
        className="relative h-36 border-b bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${props.image || "/urea.png"})`,
          borderColor: "rgba(201, 168, 76, 0.2)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/55" />
        <div className="absolute left-3 top-3 z-10">
          <CategoryBadge category={props.category || "Product"} />
        </div>
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-[11px] text-white/80">
          <span className="text-gold">●</span>
          <span>{props.seller || "Shop Name"}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <div className="mb-1 text-[15px] font-bold leading-tight text-white">
            {props.name || "Urea Fertilizer"}
          </div>
          <div className="text-xs text-white/60">Rs. {props.price || 500} / unit</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF085] to-[#D4AF37] text-[12px] font-extrabold text-black">
            {ownerInitial}
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.5px] text-white/50">Seller</div>
            <div className="text-[13px] font-semibold text-white/80">{props.seller || "Shop Name"}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">Rs. {props.price || 500}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Price</div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">{props.category || "General"}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Category</div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">{props.rating || 4.5}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Rating</div>
          </div>
        </div>

        <p className="text-[13px] leading-5 text-white/80">
          {props.description || "Trusted farm input with quality supply for daily agricultural needs."}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <RatingStars rating={props.rating || 4.5} />
            <div className="mt-1 text-[11px] text-white/50">
              {props.rating || 4.5} out of 5 rating
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-gold/30 bg-transparent px-3 py-2 text-xs font-bold text-[#FFF085] transition hover:border-gold hover:bg-gold/10"
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-lg px-3 py-2 text-xs font-bold text-[#0a1a0c] transition hover:-translate-y-[1px]"
              style={{
                background: "linear-gradient(135deg, #FFF085 0%, #D4AF37 100%)",
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
