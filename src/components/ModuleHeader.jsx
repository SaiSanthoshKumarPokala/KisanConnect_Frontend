import { farmerStorageTheme as C } from "./farmerStorageTheme";
import { UseAppContext } from "../context/AppContext";
import { useLocation } from "react-router";

export default function ModuleHeader({ title, search, onSearchChange, onOpenSidebar }) {
  const location = useLocation();
  const {
    notificationsOpen,
    setNotificationsOpen,
    role,
    serviceProviderNotifications,
    farmerNotifications,
  } = UseAppContext();

  const routeRole = location.pathname.startsWith("/serviceprovider")
    ? "serviceprovider"
    : location.pathname.startsWith("/farmer")
      ? "farmer"
      : "";

  const effectiveRole = routeRole || role;
  const notificationCount =
    effectiveRole === "serviceprovider"
      ? serviceProviderNotifications.length
      : farmerNotifications.length;

  return (
    <header
      className="kc-header-pad w-full"
      style={{
        background: C.bgCard,
        borderBottom: `1px solid ${C.border}`,
        padding: "14px 24px",
        flexShrink: 0,
      }}
    >
      <div className="flex items-center gap-3 w-full">
        <button
          className="flex md:hidden"
          onClick={onOpenSidebar}
          style={{
            background: "none",
            border: `1px solid ${C.border}`,
            borderRadius: 7,
            padding: "7px 9px",
            color: C.gold,
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div style={{ flexShrink: 0 }}>
          <div
            className="font-montserrat text-[22px] font-extrabold text-[#FFF085]"
            style={{
              textShadow: "0 0 18px rgba(255, 240, 133, 0.22), 0 0 8px rgba(212, 175, 55, 0.18)",
              lineHeight: 1,
            }}
          >
            {title}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3 flex-1">
          <div className="flex-1">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                background: "rgba(255, 255, 255, 0.9)",
                border: `1px solid ${C.border}`,
                borderRadius: 9,
                padding: "10px 14px",
              }}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" style={{ color: "#5f5f5f", flexShrink: 0 }}>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search..."
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#111111",
                  fontSize: 13,
                  fontFamily: "'Montserrat', sans-serif",
                  width: "100%",
                }}
              />
              {search && (
                <button
                  onClick={() => onSearchChange("")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#5f5f5f",
                    cursor: "pointer",
                    fontSize: 18,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              style={{
                position: "relative",
                width: 44,
                height: 44,
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                background: "#000000",
                color: "#E7C957",
                cursor: "pointer",
              }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" style={{ margin: "auto" }}>
                <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 21a2 2 0 004 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {notificationCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 999,
                    background: "#ef4444",
                    color: "#ffffff",
                    fontSize: 9,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                  }}
                >
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
