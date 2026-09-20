import { useRef } from "react";
import { XMarkIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

export default function Filters({
  title = "Filter Options",
  onApply,
  onReset,
  children,
}) {
  const dialogRef = useRef(null);

  const handleOpen = () => {
    dialogRef.current?.showModal();
  };

  const handleClose = () => {
    dialogRef.current?.close();
  };

  const handleApply = () => {
    onApply?.();
    handleClose();
  };

  const handleReset = () => {
    onReset?.();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gold/40 bg-black/60 px-4 py-2 font-montserrat text-xs font-bold text-gold transition-all duration-150 hover:border-gold hover:bg-gold hover:text-darkgreen"
      >
        <AdjustmentsHorizontalIcon className="size-4" aria-hidden="true" />
        <span>Filters</span>
      </button>

      {/* Native Modal Dialog */}
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          // Close on outside backdrop click
          if (e.target === dialogRef.current) {
            handleClose();
          }
        }}
        className="m-auto w-[min(480px,92vw)] rounded-[22px] border border-gold/30 bg-black p-6 font-montserrat text-white shadow-[0_24px_60px_rgba(0,0,0,0.7)] backdrop:bg-black/80 backdrop:backdrop-blur-md open:flex open:flex-col open:gap-5"
      >
        {/* Dialog Header */}
        <div className="flex items-center justify-between border-b border-gold/15 pb-3.5">
          <div className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="size-5 text-gold" aria-hidden="true" />
            <h3 className="text-base font-bold text-gold">{title}</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close filters"
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>

        {/* Dynamic Filter Content Body */}
        <div className="flex flex-col gap-4 text-sm text-white/80">
          {children || (
            <p className="text-xs text-white/50">
              No additional filter criteria specified.
            </p>
          )}
        </div>

        {/* Dialog Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gold/15 pt-4">
          {onReset && (
            <button
              type="button"
              onClick={handleReset}
              className="cursor-pointer rounded-xl border border-gold/30 bg-transparent px-4 py-2 text-xs font-bold text-amber-200 transition hover:bg-white/5"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-xl border border-gold/30 bg-transparent px-4 py-2 text-xs font-bold text-amber-200 transition hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="cursor-pointer rounded-xl bg-linear-to-r from-amber-200 to-gold px-5 py-2 text-xs font-extrabold text-darkgreen transition hover:brightness-105"
          >
            Apply
          </button>
        </div>
      </dialog>
    </>
  );
}