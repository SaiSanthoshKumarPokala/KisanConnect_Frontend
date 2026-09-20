import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import MetricCard from "../components/bookings/MetricCard";
import BookingCard from "../components/bookings/BookingCard";
import BookingsEmptyState from "../components/bookings/BookingsEmptyState";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { MODULE_ORDER } from "../constants/bookingsData";

export default function Bookings() {
  useDocumentTitle("My Bookings");

  const location = useLocation();
  const navigate = useNavigate();
  const { bookings = [], isOpen, setIsOpen } = UseAppContext();
  const [search, setSearch] = useState("");

  const baseRolePath = location.pathname.startsWith("/serviceprovider")
    ? "/serviceprovider"
    : "/farmer";

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

  const orderedModules = useMemo(
    () => MODULE_ORDER.filter((moduleName) => groupedBookings[moduleName]?.length),
    [groupedBookings]
  );

  const pendingCount = useMemo(
    () => bookings.filter((item) => item.status === "Pending").length,
    [bookings]
  );

  return (
    <div className="min-h-dvh bg-black">
      <SideNav />

      <div
        className={`flex min-h-dvh flex-col transition-[margin] duration-300 ${
          isOpen ? "md:ml-62.5" : "md:ml-20"
        }`}
      >
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          <ModuleHeader
            title="Bookings"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          <main className="flex-1 overflow-y-auto p-6 md:p-7">
            {filteredBookings.length === 0 ? (
              <BookingsEmptyState onNavigateDashboard={() => navigate(baseRolePath)} />
            ) : (
              <div className="flex flex-col gap-6">
                {/* Metric Summary Ribbon */}
                <div className="grid gap-4 md:grid-cols-3">
                  <MetricCard
                    label="Total Bookings"
                    value={String(bookings.length).padStart(2, "0")}
                  />
                  <MetricCard
                    label="Pending Requests"
                    value={String(pendingCount).padStart(2, "0")}
                    accent="text-white"
                  />
                  <MetricCard
                    label="Active Modules"
                    value={String(orderedModules.length).padStart(2, "0")}
                    accent="text-green-400"
                  />
                </div>

                {/* Grouped Module Sections */}
                {orderedModules.map((moduleName) => (
                  <section
                    key={moduleName}
                    className="rounded-3xl border border-gold/20 bg-[#040404] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] md:p-6"
                  >
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-gold/15 pb-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="font-montserrat text-[24px] font-black text-amber-200">
                            {moduleName}
                          </h2>
                          <span className="rounded-full border border-gold/20 bg-[#0a1a0c] px-3 py-1 font-montserrat text-[11px] font-bold uppercase tracking-[0.5px] text-white/70">
                            {groupedBookings[moduleName].length} booking
                            {groupedBookings[moduleName].length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="mt-2 max-w-180 font-montserrat text-[13px] leading-6 text-white/60">
                          Track the latest requests you placed in this module.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5">
                      {groupedBookings[moduleName].map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}