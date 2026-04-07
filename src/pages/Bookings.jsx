import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import { UseAppContext } from "../context/AppContext";

const MODULE_ORDER = ["Rentals", "Transport", "Cold Storage", "Shop", "Marketplace", "Contract Farming", "Other"];

const statusStyles = {
  Pending: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  Accepted: "border-green-400/30 bg-green-400/10 text-green-300",
  Rejected: "border-red-400/30 bg-red-400/10 text-red-300",
};

function MetricCard({ label, value, accent = "text-[#FFF085]" }) {
  return (
    <div className="rounded-[18px] border border-gold/20 bg-[#050505] p-4 shadow-[0_12px_24px_rgba(0,0,0,0.24)]">
      <div className={`text-[24px] font-black ${accent}`}>{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.4px] text-white/45">{label}</div>
    </div>
  );
}

function BookingCard({ booking }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-gold/20 bg-black shadow-[0_12px_28px_rgba(0,0,0,0.42)]">
      <div
        className="relative h-40 border-b border-gold/15 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: booking.image ? `url(${booking.image})` : "none",
          backgroundColor: "#0d0d0d",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/70" />
        <div className="absolute left-3 top-3 rounded-full border border-gold/25 bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.45px] text-[#FFF085]">
          {booking.module || "Booking"}
        </div>
        <div
          className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.45px] ${
            statusStyles[booking.status] || statusStyles.Pending
          }`}
        >
          {booking.status}
        </div>
        <div className="absolute inset-x-3 bottom-3">
          <div className="truncate text-[16px] font-bold text-white">{booking.itemName || "Booking Item"}</div>
          <div className="truncate text-[12px] text-white/65">
            {booking.providerName || booking.counterparty || "Kisan Connect"}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 font-montserrat">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-3 py-3">
            <div className="text-[9px] uppercase tracking-[0.45px] text-white/45">Price</div>
            <div className="mt-1 line-clamp-1 text-[13px] font-semibold text-[#FFF085]">
              {booking.priceLabel || "Shared on request"}
            </div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-3 py-3">
            <div className="text-[9px] uppercase tracking-[0.45px] text-white/45">Placed On</div>
            <div className="mt-1 line-clamp-1 text-[13px] font-semibold text-white">
              {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
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
            {booking.status === "Pending"
              ? "Your request is waiting for provider confirmation."
              : booking.status === "Accepted"
                ? "Your booking has been accepted and is ready for the next step."
                : "This request was rejected. You can explore other options anytime."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Bookings() {
  const location = useLocation();
  const { bookings, isOpen, setIsOpen } = UseAppContext();
  const [search, setSearch] = useState("");
  const baseRolePath = location.pathname.startsWith("/serviceprovider") ? "/serviceprovider" : "/farmer";

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return bookings;
    return bookings.filter((item) =>
      [item.itemName, item.providerName, item.module, item.summary]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [bookings, search]);

  const groupedBookings = useMemo(
    () =>
      filteredBookings.reduce((acc, item) => {
        const moduleName = item.module || "Other";
        if (!acc[moduleName]) acc[moduleName] = [];
        acc[moduleName].push(item);
        return acc;
      }, {}),
    [filteredBookings]
  );

  const orderedModules = MODULE_ORDER.filter((moduleName) => groupedBookings[moduleName]?.length);
  const pendingCount = bookings.filter((item) => item.status === "Pending").length;

  return (
    <div className="min-h-dvh bg-black">
      <SideNav />
      <div className={`flex min-h-dvh flex-col transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          <ModuleHeader
            title="Bookings"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          <div className="flex-1 overflow-y-auto p-6 md:p-7">
            {filteredBookings.length === 0 ? (
              <div className="flex min-h-[calc(100dvh-190px)] flex-col justify-center rounded-[24px] border border-dashed border-gold/25 bg-[radial-gradient(circle_at_top,rgba(255,240,133,0.12),rgba(0,0,0,0.92)_55%)] px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full border border-gold/20 bg-black/60 text-[#FFF085]">
                  <svg width="34" height="34" fill="none" viewBox="0 0 24 24">
                    <path d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v14l-6.5-3-6.5 3V6A1.5 1.5 0 0 1 7 4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="mt-6 text-[30px] font-black tracking-tight text-[#FFF085]">No bookings yet</h2>
                <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-7 text-white/65">
                  Your confirmed requests, bookings, and purchase attempts will appear here once you start using the modules.
                </p>
                <div className="mt-8">
                  <button
                    onClick={() => window.location.assign(`${window.location.origin}/#${baseRolePath}`)}
                    className="rounded-[12px] bg-[#D4AF37] px-6 py-3 text-[13px] font-black text-[#0a1a0c] transition hover:-translate-y-[1px] hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)]"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <MetricCard label="Total Bookings" value={String(bookings.length).padStart(2, "0")} />
                  <MetricCard label="Pending Requests" value={String(pendingCount).padStart(2, "0")} accent="text-white" />
                  <MetricCard label="Active Modules" value={String(orderedModules.length).padStart(2, "0")} accent="text-green-400" />
                </div>

                {orderedModules.map((moduleName) => (
                  <section key={moduleName} className="rounded-[24px] border border-gold/22 bg-[#040404] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] md:p-6">
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-gold/15 pb-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-[24px] font-black text-[#FFF085]">{moduleName}</h2>
                          <span className="rounded-full border border-gold/20 bg-[#0a1a0c] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.5px] text-white/70">
                            {groupedBookings[moduleName].length} booking{groupedBookings[moduleName].length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="mt-2 max-w-[720px] text-[13px] leading-6 text-white/58">
                          Track the latest requests you placed in this module.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px]">
                      {groupedBookings[moduleName].map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
