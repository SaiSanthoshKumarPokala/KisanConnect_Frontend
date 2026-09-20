import { STATUS_STYLES } from "../../constants/bookingsData";

export default function BookingCard({ booking }) {
  const formattedDate = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently placed";

  const getStatusMessage = (status) => {
    switch (status) {
      case "Pending":
        return "Your request is waiting for provider confirmation.";
      case "Accepted":
        return "Your booking has been accepted and is ready for the next step.";
      case "Rejected":
        return "This request was rejected. You can explore other options anytime.";
      default:
        return "Your request is currently being processed.";
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-gold/20 bg-black shadow-[0_12px_28px_rgba(0,0,0,0.42)]">
      <div
        className="relative h-40 border-b border-gold/15 bg-[#0d0d0d] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: booking.image ? `url(${booking.image})` : "none",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/25 to-black/70" />
        
        <div className="absolute left-3 top-3 rounded-full border border-gold/25 bg-black/70 px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.45px] text-amber-200">
          {booking.module || "Booking"}
        </div>
        
        <div
          className={`absolute right-3 top-3 rounded-full border px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.45px] ${
            STATUS_STYLES[booking.status] || STATUS_STYLES.Pending
          }`}
        >
          {booking.status}
        </div>
        
        <div className="absolute inset-x-3 bottom-3">
          <div className="truncate font-montserrat text-[16px] font-bold text-white">
            {booking.itemName || "Booking Item"}
          </div>
          <div className="truncate font-montserrat text-[12px] text-white/65">
            {booking.providerName || booking.counterparty || "Kisan Connect"}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 font-montserrat">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-3 py-3">
            <div className="text-[9px] uppercase tracking-[0.45px] text-white/45">Price</div>
            <div className="mt-1 line-clamp-1 text-[13px] font-semibold text-amber-200">
              {booking.priceLabel || "Shared on request"}
            </div>
          </div>
          
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-3 py-3">
            <div className="text-[9px] uppercase tracking-[0.45px] text-white/45">Placed On</div>
            <div className="mt-1 line-clamp-1 text-[13px] font-semibold text-white">
              {formattedDate}
            </div>
          </div>
        </div>

        {booking.summary && (
          <p className="line-clamp-3 text-[12px] leading-6 text-white/65">{booking.summary}</p>
        )}

        <div className="mt-auto rounded-[14px] border border-gold/15 bg-[#050505] px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.45px] text-white/40">
            Latest Update
          </div>
          <div className="mt-1 text-[13px] leading-6 text-white/75">
            {getStatusMessage(booking.status)}
          </div>
        </div>
      </div>
    </div>
  );
}