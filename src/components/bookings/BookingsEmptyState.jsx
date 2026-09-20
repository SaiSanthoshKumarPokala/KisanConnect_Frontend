import { BookmarkIcon } from "@heroicons/react/24/outline";

export default function BookingsEmptyState({ onNavigateDashboard }) {
  return (
    <div className="flex min-h-[calc(100dvh-190px)] flex-col justify-center rounded-3xl border border-dashed border-gold/25 bg-[radial-gradient(circle_at_top,rgba(255,240,133,0.12),rgba(0,0,0,0.92)_55%)] px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mx-auto flex size-18 items-center justify-center rounded-full border border-gold/20 bg-black/60 text-amber-200">
        <BookmarkIcon className="size-8 stroke-[1.5]" aria-hidden="true" />
      </div>
      <h2 className="mt-6 font-montserrat text-[30px] font-black tracking-tight text-amber-200">
        No bookings yet
      </h2>
      <p className="mx-auto mt-3 max-w-140 font-montserrat text-[14px] leading-7 text-white/65">
        Your confirmed requests, bookings, and purchase attempts will appear here once you start using the modules.
      </p>
      <div className="mt-8">
        <button
          type="button"
          onClick={onNavigateDashboard}
          className="cursor-pointer rounded-xl bg-gold px-6 py-3 font-montserrat text-[13px] font-black text-[#0a1a0c] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)]"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}