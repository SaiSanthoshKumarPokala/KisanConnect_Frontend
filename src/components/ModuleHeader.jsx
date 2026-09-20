import { useLocation } from "react-router";
import { UseAppContext } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";

function getSearchPlaceholder(title, role, t) {
  const key = `${role}:${title}`.toLowerCase();
  const placeholders = {
    "farmer:machine rentals":          t("search_rentals"),
    "serviceprovider:my rentals":      t("search_rentals"),
    "farmer:transport":                t("search_transport"),
    "serviceprovider:my transport":    t("search_transport"),
    "farmer:shop":                     t("search_shop"),
    "serviceprovider:my shop":         t("search_shop"),
    "farmer:marketplace":              t("search_marketplace"),
    "serviceprovider:farm marketplace":t("search_marketplace"),
    "farmer:cold storage":             t("search_storage"),
    "serviceprovider:my storage":      t("search_storage"),
    "farmer:contract farming":         t("search_contract"),
    "serviceprovider:contract management": t("search_contract"),
  };
  return placeholders[key] || t("search_default");
}

export default function ModuleHeader({
  title,
  search,
  onSearchChange,
  onOpenSidebar,
  searchPlaceholder,
}) {
  const location = useLocation();
  const {
    notificationsOpen, setNotificationsOpen,
    role, ongoingDeals, transportDeals, transportRejected,
    rentalDeals, rentalRejected, contractDeals,
    shopOrders, marketplaceOrders,
    cart, navigate,
  } = UseAppContext();

  const routeRole  = location.pathname.startsWith("/serviceprovider") ? "serviceprovider" : location.pathname.startsWith("/farmer") ? "farmer" : "";
  const effectiveRole  = routeRole || role;
  const showCartButton = effectiveRole === "farmer" || effectiveRole === "serviceprovider";
  const { t } = useLanguage();
  const placeholder    = searchPlaceholder || getSearchPlaceholder(title, effectiveRole, t);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const threeDaysAgo = new Date(today); threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const activeColdDeals      = (ongoingDeals        || []).filter((d) => new Date(d.endDate)    >= today);
  const activeTransportDeals = (transportDeals      || []).filter((d) => new Date(d.pickupDate) >= today);
  const activeRentalDeals    = (rentalDeals         || []).filter((d) => new Date(d.endDate)    >= today);
  const activeContractDeals  = (contractDeals       || []).length;
  const activeShopOrders     = (shopOrders          || []).filter((o) => new Date(o.paidAt || o.createdAt) >= threeDaysAgo);
  const activeMktOrders      = (marketplaceOrders   || []).filter((o) => new Date(o.paidAt || o.createdAt) >= threeDaysAgo);
  const rejectedTransport    = effectiveRole === "farmer" ? (transportRejected || []) : [];
  const rejectedRentals      = effectiveRole === "farmer" ? (rentalRejected    || []) : [];

  const notificationCount =
    activeColdDeals.length + activeTransportDeals.length +
    activeRentalDeals.length + activeContractDeals +
    activeShopOrders.length + activeMktOrders.length +
    rejectedTransport.length + rejectedRentals.length;

  return (
    <header className="kc-header-pad w-full shrink-0 border-b border-gold/18 bg-black px-6 py-3.5">
      <div className="flex w-full items-center gap-3">
        {/* Mobile Sidebar Toggle Button */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex md:hidden shrink-0 cursor-pointer items-center justify-center rounded-[7px] border border-[#c9a84c]/20 bg-transparent px-2.25 py-1.75 text-[#c9a84c]"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <line x1="3" y1="6"  x2="21" y2="6"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Title */}
        <div className="shrink-0">
          <div className="font-montserrat text-[22px] font-extrabold leading-none text-[#FFF085] [text-shadow:0_0_18px_rgba(255,240,133,0.22),0_0_8px_rgba(212,175,55,0.18)]">
            {title}
          </div>
        </div>

        <div className="ml-auto flex flex-1 items-center gap-3">
          {/* Search Input Box */}
          <div className="flex-1">
            <div className="flex items-center gap-2.25 rounded-[9px] border border-[#c9a84c]/20 bg-white/90 px-3.5 py-2.5">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" className="shrink-0 text-[#5f5f5f]">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
                className="kc-module-search-input kc-search-input w-full border-none bg-transparent font-montserrat text-[13px] text-[#111111] outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="shrink-0 cursor-pointer border-none bg-transparent text-lg leading-none text-[#5f5f5f]"
                >
                  x
                </button>
              )}
            </div>
          </div>

          {/* Action Icon Group */}
          <div className="relative flex shrink-0 gap-2">
            {/* Bookings button */}
            <button
              type="button"
              onClick={() => navigate(`/${effectiveRole}/bookings`)}
              title="Booked items"
              className="relative flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[#c9a84c]/20 bg-black text-[#E7C957]"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="m-auto">
                <path d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v14l-6.5-3-6.5 3V6A1.5 1.5 0 0 1 7 4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Cart button */}
            {showCartButton && (
              <button
                type="button"
                onClick={() => navigate(`/${effectiveRole}/cart`)}
                className="relative flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[#c9a84c]/20 bg-black text-[#E7C957]"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="m-auto">
                  <path d="M3 3h2l3.6 7.6L7 14h12M7 14l1.5-6h11l-2.5 6H7zm2 5a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {cart && cart.length > 0 && (
                  <span className="absolute top-1.75 right-1.75 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-extrabold text-white">
                    {cart.length > 9 ? "9+" : cart.length}
                  </span>
                )}
              </button>
            )}

            {/* Notifications button */}
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[#c9a84c]/20 bg-black text-[#E7C957]"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="m-auto">
                <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 21a2 2 0 004 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-1.75 right-1.75 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-extrabold text-white">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}