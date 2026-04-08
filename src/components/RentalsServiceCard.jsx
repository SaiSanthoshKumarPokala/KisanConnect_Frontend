import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function RentalsServiceCard({ item, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-[18px] border bg-black font-montserrat transition-all duration-200"
      style={{
        borderColor: hovered ? "#f1d86a" : "#d4af37",
        boxShadow: hovered
          ? "0 0 0 1px rgba(241, 216, 106, 0.36), 0 18px 40px rgba(0, 0, 0, 0.5), 0 0 28px rgba(212, 175, 55, 0.16)"
          : "0 0 0 1px rgba(212, 175, 55, 0.26), 0 12px 28px rgba(0, 0, 0, 0.42)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 p-6 backdrop-blur-[3px] transition-all duration-200"
        style={{
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FFF085] text-sm font-bold text-black shadow-lg shadow-black/30 transition hover:brightness-95"
          >
            <PencilIcon className="size-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-black/30 transition hover:bg-red-500"
          >
            <TrashIcon className="size-4" />
            Delete
          </button>
        </div>
      </div>

      <div
        className="relative h-40 border-b bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${item.image}')`,
          borderColor: "rgba(201, 168, 76, 0.2)",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/60" />
        <div className="absolute left-3 top-3 z-1 rounded-full border border-[#FFF085]/35 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#FFF085]">
          {item.category}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <div className="mb-1 text-[15px] font-bold text-white">{item.name}</div>
          <div className="text-xs text-white/60">{item.location}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">Rs. {item.price}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">
              Per Day
            </div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-2 py-3 text-center">
            <div className="text-sm font-bold text-white">{item.status}</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.5px] text-white/50">
              Status
            </div>
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-white/70">{item.description}</p>
      </div>
    </div>
  );
}
