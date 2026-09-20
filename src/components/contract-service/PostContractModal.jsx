import { XCircleIcon } from "@heroicons/react/24/outline";
import {
  CROP_OPTIONS,
  SEASON_OPTIONS,
  DURATION_OPTIONS,
  PAYMENT_OPTIONS,
} from "../../constants/contractServiceData";

export default function PostContractModal({
  isOpen,
  isPosting,
  formData,
  onFormChange,
  onSubmit,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={() => !isPosting && onClose()}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[22px] border border-gold/35 bg-black font-montserrat shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold/20 bg-[#050505] px-6 py-4">
          <div>
            <h2 className="text-lg font-black text-gold">Post a New Contract</h2>
            <p className="text-xs text-white/50">
              Farmers will see and apply to this listing
            </p>
          </div>
          <button
            type="button"
            disabled={isPosting}
            onClick={onClose}
            aria-label="Close modal"
            className="cursor-pointer text-white/80 transition-all duration-200 hover:rotate-90 hover:text-red-500 disabled:opacity-30"
          >
            <XCircleIcon className="size-8" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="space-y-4"
          >
            <p className="mb-4 text-xs leading-relaxed text-white/60">
              Fill in the technical details for your contract listing so farmers understand crop specifications, pricing ranges, minimum land commitments, and settlement terms immediately.
            </p>

            <div className="space-y-3.5">
              {[
                ["Company Name *", "company", "text", "e.g. AgroCorp India Pvt. Ltd."],
                ["Company Type", "companyType", "text", "e.g. Food Processing"],
                ["Variety / Specification", "variety", "text", "e.g. Pusa 1121, Bt Cotton"],
                ["Region / State *", "region", "text", "e.g. Telangana, AP"],
                ["Min Land / Farmer (acres) *", "minLand", "number", "e.g. 5"],
                ["Total Land Required (acres) *", "totalLand", "number", "e.g. 500"],
                ["Farmers Needed *", "farmersNeeded", "number", "e.g. 50"],
                ["Min Price (₹/quintal) *", "priceMin", "number", "e.g. 2200"],
                ["Max Price (₹/quintal) *", "priceMax", "number", "e.g. 2800"],
                ["Quality Standards", "qualityStd", "text", "e.g. Grade A, moisture < 14%"],
                ["Notes for Farmers", "notes", "text", "Any additional instructions..."],
              ].map(([label, fieldKey, inputType, placeholder]) => (
                <div key={fieldKey} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <label htmlFor={fieldKey} className="w-48 shrink-0 text-xs font-bold text-gold">
                    {label}
                  </label>
                  <input
                    id={fieldKey}
                    type={inputType}
                    value={formData[fieldKey]}
                    placeholder={placeholder}
                    onChange={(e) => onFormChange(fieldKey, e.target.value)}
                    className="flex-1 border-b-2 border-gold/40 bg-transparent py-1 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-gold"
                  />
                </div>
              ))}

              {/* Crop Select */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <label htmlFor="cropSelect" className="w-48 shrink-0 text-xs font-bold text-gold">
                  Crop Required *
                </label>
                <select
                  id="cropSelect"
                  value={formData.crop}
                  onChange={(e) => onFormChange("crop", e.target.value)}
                  className="flex-1 border-b-2 border-gold/40 bg-darkgreen py-1 text-sm text-white outline-none focus:border-gold"
                >
                  <option value="">Select crop</option>
                  {CROP_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Select Fields */}
              {[
                ["Season", "season", SEASON_OPTIONS],
                ["Duration", "duration", DURATION_OPTIONS],
                ["Payment Terms", "paymentTerms", PAYMENT_OPTIONS],
              ].map(([label, fieldKey, optionsList]) => (
                <div key={fieldKey} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <label htmlFor={fieldKey} className="w-48 shrink-0 text-xs font-bold text-gold">
                    {label}
                  </label>
                  <select
                    id={fieldKey}
                    value={formData[fieldKey]}
                    onChange={(e) => onFormChange(fieldKey, e.target.value)}
                    className="flex-1 border-b-2 border-gold/40 bg-darkgreen py-1 text-sm text-white outline-none focus:border-gold"
                  >
                    {optionsList.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Input Support Toggle */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <label htmlFor="inputSupport" className="w-48 shrink-0 text-xs font-bold text-gold">
                  Input Support
                </label>
                <select
                  id="inputSupport"
                  value={formData.inputSupport}
                  onChange={(e) => onFormChange("inputSupport", e.target.value)}
                  className="flex-1 border-b-2 border-gold/40 bg-darkgreen py-1 text-sm text-white outline-none focus:border-gold"
                >
                  <option value="Yes">Yes — Provided</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3 pt-2">
              <button
                type="button"
                disabled={isPosting}
                onClick={onClose}
                className="flex-1 cursor-pointer rounded-lg border-2 border-gold py-2.5 text-center font-bold text-gold transition-colors hover:bg-gold hover:text-darkgreen disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPosting}
                className="flex-1 cursor-pointer rounded-lg border-2 border-gold bg-gold py-2.5 text-center font-bold text-darkgreen transition-all hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPosting ? "Posting..." : "Post Contract"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}