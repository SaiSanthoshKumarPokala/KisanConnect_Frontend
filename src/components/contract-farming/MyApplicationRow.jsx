import { STATUS_STYLES } from "../../utils/contractHelpers";

export default function MyApplicationRow({ app }) {
  const contract = app.contract;
  const formattedDate = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "Recently";

  return (
    <div className="flex flex-row flex-wrap items-center gap-4 border-b border-gold/10 px-5 py-4 font-montserrat last:border-0">
      <img src="/contractdoc.svg" alt="" className="size-10 opacity-70" />
      
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gold">
          {contract?.crop}
          {contract?.variety ? ` — ${contract.variety}` : ""}
        </p>
        <p className="text-xs text-white/60">
          {contract?.company} · {contract?.region}
        </p>
        <p className="mt-0.5 text-xs text-white/40">
          Applied {formattedDate}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-bold text-gold">
            ₹{contract?.priceMin?.toLocaleString()} - ₹{contract?.priceMax?.toLocaleString()}
          </p>
          <p className="text-xs text-white/40">per quintal</p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
            STATUS_STYLES[app.status] || STATUS_STYLES.Pending
          }`}
        >
          {app.status}
        </span>
      </div>
    </div>
  );
}