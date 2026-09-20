import { useState } from "react";
import { ChevronDownIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function ContractFarmingCard({ contract, applied, onApply }) {
  const [showDetails, setShowDetails] = useState(false);

  const fillPct =
    contract.totalLand > 0
      ? Math.min(100, Math.round((contract.acceptedLand / contract.totalLand) * 100))
      : 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-gold bg-black font-montserrat shadow-[0_0_0_1px_rgba(212,175,55,0.26),0_12px_28px_rgba(0,0,0,0.42)]">
      {/* Header Visual */}
      <div className="relative flex h-40 items-center justify-center border-b border-gold/20 bg-darkgreen">
        <img src="/contractdoc.svg" alt="Contract Document" className="size-24 opacity-80" />
        <span className="absolute right-3 top-3 rounded-full border border-green-400 bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400">
          {contract.status}
        </span>
      </div>

      {/* Card Details */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-4 text-white">
        <div>
          <h2 className="text-lg font-bold text-gold">
            {contract.crop}
            {contract.variety && (
              <span className="text-sm font-normal text-gold/60"> — {contract.variety}</span>
            )}
          </h2>
          <p className="text-sm text-white/60">{contract.company}</p>
          <p className="text-xs text-white/40">{contract.companyType}</p>
        </div>

        {/* Pricing & Terms */}
        <div className="flex items-center justify-between rounded-lg border border-gold/30 bg-black/30 px-3 py-2">
          <div>
            <p className="font-bold text-gold">
              ₹{contract.priceMin.toLocaleString()} – ₹{contract.priceMax.toLocaleString()}
            </p>
            <p className="text-xs text-white/40">per quintal</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-white">{contract.duration}</p>
            <p className="text-xs text-white/40">{contract.season}</p>
          </div>
        </div>

        {/* Metric Rows */}
        <div className="space-y-1 text-sm">
          {[
            ["📍 Region", contract.region],
            ["🌾 Min Land", `${contract.minLand} acres / farmer`],
            ["👥 Farmers Needed", contract.farmersNeeded],
            ["💳 Payment", contract.paymentTerms],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between text-white/80">
              <span>{label}</span>
              <span className="max-w-40 truncate text-right text-xs text-white/50">{val}</span>
            </div>
          ))}
        </div>

        {/* Input Support Badge */}
        <div>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
              contract.inputSupport
                ? "border-gold/60 bg-gold/10 text-gold"
                : "border-white/20 text-white/40"
            }`}
          >
            {contract.inputSupport ? "✓ Input Support" : "No Input Support"}
          </span>
        </div>

        {/* Land Allocation Meter */}
        <div className="w-full">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-white/50">Contracts filled</span>
            <span className="text-gold">{fillPct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gold transition-all duration-300" style={{ width: `${fillPct}%` }} />
          </div>
        </div>

        {/* Expandable Specifications */}
        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="flex cursor-pointer items-center gap-1 text-xs text-gold transition-colors hover:text-gold/70"
        >
          <span>{showDetails ? "Hide details" : "View full details"}</span>
          <ChevronDownIcon
            className={`size-4 transition-transform duration-200 ${
              showDetails ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {showDetails && (
          <div className="space-y-2 rounded-lg border border-gold/20 bg-[#050505] p-3 text-xs text-white/60">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                Quality Standards
              </p>
              <p>{contract.qualityStd || "Not specified"}</p>
            </div>
            {contract.notes && (
              <div className="border-t border-gold/10 pt-2">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                  Notes from Company
                </p>
                <p>{contract.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-2">
          {applied ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-400/40 bg-green-600/20 py-2.5 text-sm font-bold text-green-400">
              <CheckCircleIcon className="size-5" aria-hidden="true" />
              <span>Application Submitted</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onApply(contract)}
              className="w-full cursor-pointer rounded-lg bg-gold py-2.5 text-center font-bold text-darkgreen transition-all duration-150 hover:bg-linear-to-r hover:from-gold hover:to-yellow-200"
            >
              Apply Now →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}