import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function ContractApplyModal({
  dialogRef,
  contract,
  applied,
  submitting,
  formData,
  onFormChange,
  onSubmit,
  onClose,
}) {
  const isLandDeficient =
    contract && formData.fLand && Number(formData.fLand) < contract.minLand;

  const isSubmitDisabled =
    submitting ||
    !formData.fName ||
    !formData.fPhone ||
    !formData.fLand ||
    !formData.fExperience;

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-full max-w-lg rounded-xl bg-transparent p-0 backdrop:backdrop-blur-sm"
    >
      <div className="overflow-hidden rounded-[22px] border border-gold/30 bg-black font-montserrat shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-gold/20 bg-[#050505] px-6 py-4">
          <div>
            <h2 className="text-lg font-black text-gold">Apply for Contract</h2>
            {contract && (
              <p className="mt-0.5 text-sm text-white/55">
                {contract.crop}
                {contract.variety ? ` — ${contract.variety}` : ""} · {contract.company}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="cursor-pointer text-white/80 transition-all duration-200 hover:rotate-90 hover:text-red-500"
          >
            <XCircleIcon className="size-8" aria-hidden="true" />
          </button>
        </div>

        <div className="bg-black p-6">
          {!applied ? (
            <div>
              {/* Quick Contract Metrics */}
              {contract && (
                <div className="mb-5 grid grid-cols-3 gap-3 rounded-[18px] border border-gold/20 bg-[#050505] px-4 py-4 text-center">
                  {[
                    ["Price", `₹${contract.priceMin.toLocaleString()}-${contract.priceMax.toLocaleString()}`],
                    ["Min Land", `${contract.minLand} acres`],
                    ["Duration", contract.duration],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-sm font-bold text-gold">{val}</p>
                      <p className="mt-0.5 text-[10px] text-white/50">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Form Body */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit();
                }}
                className="flex flex-col gap-4"
              >
                {[
                  ["Full Name *", "fName", "text", "Your full name"],
                  ["Mobile Number *", "fPhone", "tel", "+91 XXXXX XXXXX"],
                  ["State", "fState", "text", "e.g. Telangana"],
                  ["District", "fDistrict", "text", "e.g. Nalgonda"],
                  [
                    "Land Available (acres) *",
                    "fLand",
                    "number",
                    contract ? `Min ${contract.minLand} acres required` : "",
                  ],
                  ["Years of Experience *", "fExperience", "number", "e.g. 8"],
                  ["Current Crop Grown", "fCrop", "text", "e.g. Paddy, Cotton..."],
                ].map(([label, key, type, placeholder]) => (
                  <div key={key} className="rounded-2xl border border-gold/15 bg-[#050505] px-4 py-3">
                    <label htmlFor={key} className="mb-2 block text-sm font-bold text-gold">
                      {label}
                    </label>
                    <input
                      id={key}
                      type={type}
                      placeholder={placeholder}
                      value={formData[key]}
                      onChange={(e) => onFormChange(key, e.target.value)}
                      className="w-full rounded-xl border border-gold/15 bg-black px-3 py-3 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-gold/45"
                    />
                  </div>
                ))}

                <div className="rounded-2xl border border-gold/15 bg-[#050505] px-4 py-3">
                  <label htmlFor="fMessage" className="mb-2 block text-sm font-bold text-gold">
                    Message to Company
                  </label>
                  <textarea
                    id="fMessage"
                    rows={2}
                    value={formData.fMessage}
                    onChange={(e) => onFormChange("fMessage", e.target.value)}
                    placeholder="Why are you a good fit for this contract?"
                    className="min-h-22 w-full resize-none rounded-xl border border-gold/15 bg-black px-3 py-3 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-gold/45"
                  />
                </div>

                {isLandDeficient && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    ⚠ Your land ({formData.fLand} acres) is below the minimum required ({contract.minLand} acres).
                  </p>
                )}

                <div className="mt-2 flex flex-row gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 cursor-pointer rounded-lg border-2 border-gold p-2 font-bold text-gold transition-all duration-150 hover:bg-gold hover:text-darkgreen"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="flex-1 cursor-pointer rounded-lg border-2 border-gold bg-gold p-2 font-bold text-darkgreen transition-all duration-150 hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-8 text-center">
              <CheckCircleIcon className="mx-auto mb-4 size-16 stroke-green-400" aria-hidden="true" />
              <h3 className="mb-2 text-xl font-black text-gold">Application Sent!</h3>
              <p className="mb-1 text-sm leading-relaxed text-white/60">
                Your application for <span className="font-semibold text-white">{contract?.crop}</span> with{" "}
                <span className="font-semibold text-white">{contract?.company}</span> has been submitted.
              </p>
              <p className="mb-6 text-xs text-white/40">The company will review and respond soon.</p>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg bg-gold px-8 py-2 font-bold text-darkgreen transition-all duration-150 hover:bg-linear-to-r hover:from-gold hover:to-yellow-200"
              >
                Back to Contracts
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}