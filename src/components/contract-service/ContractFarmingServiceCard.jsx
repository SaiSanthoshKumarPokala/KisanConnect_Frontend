import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ApplicationRow from "./ApplicationRow";

export default function ContractFarmingServiceCard({ contract, onDecision, onClose }) {
  const [showApps, setShowApps] = useState(false);

  const acceptedLand = contract.applications
    .filter((a) => a.status === "Accepted")
    .reduce((sum, a) => sum + Number(a.land || 0), 0);

  const fillPct =
    contract.totalLand > 0
      ? Math.min(100, Math.round((acceptedLand / contract.totalLand) * 100))
      : 0;

  const pendingCount = contract.applications.filter((a) => a.status === "Pending").length;
  const acceptedCount = contract.applications.filter((a) => a.status === "Accepted").length;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-gold bg-black font-montserrat shadow-[0_0_0_1px_rgba(212,175,55,0.26),0_12px_28px_rgba(0,0,0,0.42)]">
      {/* Header Visual */}
      <div className="relative flex h-40 items-center justify-center border-b border-gold/20 bg-darkgreen">
        <img src="/contractdoc.svg" alt="" className="size-24 opacity-80" />
        <span
          className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-bold ${
            contract.status === "Active"
              ? "border-green-400 bg-green-500/20 text-green-400"
              : "border-neutral-500 bg-neutral-800/40 text-neutral-400"
          }`}
        >
          {contract.status}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-4 text-white">
        <div>
          <h2 className="text-lg font-bold text-gold">
            {contract.crop}
            {contract.variety && (
              <span className="text-sm font-normal text-gold/60"> — {contract.variety}</span>
            )}
          </h2>
          <p className="text-sm text-white/70">{contract.company}</p>
        </div>

        {/* Pricing & Duration */}
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

        {/* Metric Specifications */}
        <div className="space-y-1 text-sm">
          {[
            ["📍 Region", contract.region],
            ["🌾 Min Land", `${contract.minLand} acres/farmer`],
            ["👥 Farmers Needed", contract.farmersNeeded],
            ["💳 Payment", contract.paymentTerms],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between text-white/80">
              <span>{label}</span>
              <span className="max-w-45 truncate text-right text-xs text-white/50">{val}</span>
            </div>
          ))}
        </div>

        {/* Input Support Badge */}
        <div>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              contract.inputSupport
                ? "border-gold/60 bg-gold/10 text-gold"
                : "border-white/20 text-white/40"
            }`}
          >
            {contract.inputSupport ? "✓ Input Support" : "No Input Support"}
          </span>
        </div>

        {/* Progress Tracker */}
        <div className="w-full">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-white/50">Land contracted</span>
            <span className="text-gold">
              {fillPct}% of {contract.totalLand} acres
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        {/* Application Summaries */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
            {pendingCount} Pending
          </span>
          <span className="rounded-lg border border-green-400/40 bg-green-400/10 px-2.5 py-1 text-xs font-semibold text-green-300">
            {acceptedCount} Accepted
          </span>
          <span className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/40">
            {contract.applications.length} total
          </span>
        </div>

        {/* Applicant Details Collapse */}
        {contract.applications.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowApps((prev) => !prev)}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gold py-2.5 font-bold text-darkgreen transition-all duration-200 hover:bg-linear-to-r hover:from-gold hover:to-yellow-200"
          >
            <span>{showApps ? "Hide" : "View"} Farmer Applications</span>
            <ChevronDownIcon
              className={`size-4 transition-transform duration-200 ${
                showApps ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        ) : (
          <div className="w-full rounded-lg border border-white/10 py-2.5 text-center text-xs text-white/30">
            No applications yet — farmers will apply soon
          </div>
        )}

        {showApps && (
          <div className="mt-1 w-full space-y-2 border-t border-gold/20 pt-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gold">
              Farmer Applications
            </p>
            {contract.applications.map((app) => (
              <ApplicationRow key={app._id} app={app} onDecision={onDecision} />
            ))}
          </div>
        )}

        {/* Close Contract Trigger */}
        {contract.status === "Active" && (
          <button
            type="button"
            onClick={() => onClose(contract._id)}
            className="mt-1 w-full cursor-pointer rounded-lg bg-red-600/70 py-2 text-xs font-bold text-white transition-colors hover:bg-red-600"
          >
            Close Contract
          </button>
        )}
      </div>
    </div>
  );
}