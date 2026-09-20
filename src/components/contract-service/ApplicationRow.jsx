import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";

const STATUS_STYLES = {
  Pending: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  Accepted: "border-green-400/40 bg-green-400/10 text-green-300",
  Rejected: "border-red-400/40 bg-red-400/10 text-red-300",
};

export default function ApplicationRow({ app, onDecision }) {
  const initials = app.name
    ? app.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AP";

  return (
    <div
      className={`mb-2 rounded-lg border p-3 font-montserrat transition-colors last:mb-0 ${
        app.status === "Accepted"
          ? "border-green-400/30 bg-green-950/20"
          : app.status === "Rejected"
            ? "border-red-400/30 bg-red-950/20"
            : "border-white/10 bg-black/40"
      }`}
    >
      <div className="mb-2 flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/20 font-montserrat text-xs font-black text-gold">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">{app.name}</p>
          <p className="text-xs text-white/50">
            {app.location} · {app.experience} · {app.land} acres
          </p>
          <p className="mt-0.5 text-xs text-white/40">{app.phone}</p>
          {app.message && (
            <p className="mt-1 text-xs italic text-white/60">"{app.message}"</p>
          )}
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            STATUS_STYLES[app.status] || STATUS_STYLES.Pending
          }`}
        >
          {app.status}
        </span>
      </div>

      {app.status === "Pending" && (
        <div className="flex gap-2 pl-11">
          <button
            type="button"
            onClick={() => onDecision(app._id, "Accepted")}
            className="flex cursor-pointer items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-green-500"
          >
            <CheckCircleIcon className="size-4" aria-hidden="true" />
            <span>Accept</span>
          </button>
          <button
            type="button"
            onClick={() => onDecision(app._id, "Rejected")}
            className="flex cursor-pointer items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-500"
          >
            <XMarkIcon className="size-4" aria-hidden="true" />
            <span>Reject</span>
          </button>
        </div>
      )}
    </div>
  );
}