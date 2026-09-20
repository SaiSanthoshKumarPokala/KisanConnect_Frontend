import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function CartEmptyState({ onBrowseShop, onBrowseMarketplace }) {
  return (
    <div className="flex min-h-[calc(100dvh-190px)] flex-col justify-center rounded-3xl border border-dashed border-gold/25 bg-[radial-gradient(circle_at_top,rgba(255,240,133,0.12),rgba(0,0,0,0.92)_55%)] px-6 py-14 text-center font-montserrat">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-gold/20 bg-black/60 text-amber-200">
        <ShoppingCartIcon className="size-8 stroke-[1.5]" aria-hidden="true" />
      </div>
      <h2 className="mt-6 text-3xl font-black tracking-tight text-amber-200">
        Your cart is empty
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/60">
        Browse the shop or marketplace to add items.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onBrowseShop}
          className="cursor-pointer rounded-xl bg-gold px-6 py-3 text-sm font-black text-[#0a1a0c] transition hover:-translate-y-0.5 hover:bg-white"
        >
          Browse Shop
        </button>
        <button
          type="button"
          onClick={onBrowseMarketplace}
          className="cursor-pointer rounded-xl border border-gold/25 px-6 py-3 text-sm font-bold text-amber-200 transition hover:border-gold/40 hover:bg-white/5"
        >
          Browse Marketplace
        </button>
      </div>
    </div>
  );
}