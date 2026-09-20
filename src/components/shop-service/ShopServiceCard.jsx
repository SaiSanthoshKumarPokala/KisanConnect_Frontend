import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function ShopServiceCard({ item, onEdit, onDelete, hideSubtitle = false }) {
  const subtitle = item.brand || item.seller || "Listing";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[#d4af37] bg-black font-montserrat shadow-[0_0_0_1px_rgba(212,175,55,0.26),0_12px_28px_rgba(0,0,0,0.42)]">
      {/* Banner / Image Area */}
      <div
        className="relative h-40 border-b border-[#c9a84c]/20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: item.image
            ? `url('${item.image}')`
            : "linear-gradient(135deg, #1a3a1a 0%, #050505 100%)",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/10 to-black/60" />
        <div className="absolute left-3 top-3 z-1 rounded-full border border-[#FFF085]/35 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#FFF085]">
          {item.category}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="mb-1 text-[15px] font-bold text-white">{item.name}</div>
          {!hideSubtitle && <div className="text-xs text-white/60">{subtitle}</div>}
        </div>

        {/* 2-Column Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-[#d4af37]/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">Rs. {item.price}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Per Kg</div>
          </div>
          <div className="rounded-lg border border-[#d4af37]/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">
              {item.stock > 0 ? `${item.stock} kg` : item.stock === 0 ? "Out of Stock" : "—"}
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">Stock</div>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-white/70">{item.description}</p>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FFF085] text-sm font-bold text-black shadow-lg shadow-black/30 transition hover:brightness-95"
          >
            <PencilIcon className="size-4" /> Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(item._id || item.id)}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-black/30 transition hover:bg-red-500"
          >
            <TrashIcon className="size-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}