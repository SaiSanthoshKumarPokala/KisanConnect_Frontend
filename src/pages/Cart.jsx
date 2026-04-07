import React, { useMemo, useState } from "react";
import { useLocation } from "react-router";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import { UseAppContext } from "../context/AppContext";

const MODULE_ORDER = ["Rentals", "Transport", "Shop", "Marketplace", "Cold Storage", "Other"];

const moduleDescriptions = {
  Rentals: "Ready-to-rent farm equipment collected for your next field task.",
  Transport: "Transport options grouped together for easy trip planning.",
  Shop: "Supplies and products you saved for a later purchase decision.",
  Marketplace: "Farmer-listed goods and produce saved for purchase follow-up.",
  "Cold Storage": "Storage requests and spaces you want to revisit before booking.",
  Other: "Saved items from across the platform.",
};

function CartMetric({ label, value, accent = "text-[#FFF085]" }) {
  return (
    <div className="rounded-[18px] border border-gold/20 bg-[#050505] p-4 shadow-[0_12px_24px_rgba(0,0,0,0.24)]">
      <div className={`text-[22px] font-black ${accent}`}>{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.4px] text-white/45">{label}</div>
    </div>
  );
}

function CartItemCard({ item, onRemove }) {
  const [hovered, setHovered] = useState(false);
  const title = item.name || item.vehicleType || item.crop || "Saved Item";
  const subtitle = item.seller || item.owner || item.location || "Kisan Connect";
  const price =
    item.priceLabel ||
    (item.price ? `Rs. ${item.price}` : item.rate ? `Rs. ${item.rate}` : "Available");

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-[18px] border bg-black font-montserrat transition-all duration-200 hover:-translate-y-1"
      style={{
        borderColor: "#d4af37",
        boxShadow:
          "0 0 0 1px rgba(212, 175, 55, 0.24), 0 12px 28px rgba(0, 0, 0, 0.42)",
      }}
    >
      <div
        className="relative h-40 border-b bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${item.image})`,
          borderColor: "rgba(201, 168, 76, 0.2)",
          backgroundColor: "#0d0d0d",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
        <div className="absolute left-3 top-3 rounded-full border border-gold/30 bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#FFF085]">
          {item.cartModule || "Saved"}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-bold text-white">{title}</div>
            <div className="truncate text-[12px] text-white/65">{subtitle}</div>
          </div>
          <div className="rounded-full border border-gold/25 bg-black/70 px-3 py-1 text-[11px] font-bold text-[#FFF085]">
            {price}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-3 py-3">
            <div className="text-[9px] uppercase tracking-[0.45px] text-white/45">Owner</div>
            <div className="mt-1 line-clamp-1 text-[13px] font-semibold text-white">
              {item.owner || item.seller || "Available Provider"}
            </div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-[#050505] px-3 py-3">
            <div className="text-[9px] uppercase tracking-[0.45px] text-white/45">Location</div>
            <div className="mt-1 line-clamp-1 text-[13px] font-semibold text-white">
              {item.location || item.city || "Shared across the region"}
            </div>
          </div>
        </div>

        {item.description && (
          <p className="line-clamp-3 text-[12px] leading-6 text-white/65">{item.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.45px] text-white/40">
              Saved For Later
            </div>
            <div className="mt-1 text-[12px] text-white/65">Review and continue from the module when needed.</div>
          </div>
          <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onRemove(item.id || item._id)}
            className="rounded-[10px] border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.5px] transition-all duration-200"
            style={{
              borderColor: hovered ? "rgba(248, 113, 113, 0.7)" : "rgba(248, 113, 113, 0.35)",
              color: hovered ? "#ffffff" : "#f87171",
              background: hovered ? "rgba(220, 38, 38, 0.9)" : "transparent",
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const location = useLocation();
  const { cart, setCart, isOpen, setIsOpen, navigate } = UseAppContext();
  const baseRolePath = location.pathname.startsWith("/serviceprovider") ? "/serviceprovider" : "/farmer";
  const moduleRoutes = {
    Rentals: `${baseRolePath}/rentals`,
    Transport: `${baseRolePath}/transport`,
    Shop: `${baseRolePath}/shop`,
    Marketplace: `${baseRolePath}/marketplace`,
    "Cold Storage": `${baseRolePath}/coldstorage`,
    Other: `${baseRolePath}`,
  };

  const groupedCart = useMemo(
    () =>
      cart.reduce((acc, item) => {
        const moduleName = item.cartModule || "Other";
        if (!acc[moduleName]) {
          acc[moduleName] = [];
        }
        acc[moduleName].push(item);
        return acc;
      }, {}),
    [cart]
  );

  const orderedModules = MODULE_ORDER.filter((moduleName) => groupedCart[moduleName]?.length);
  const totalModules = orderedModules.length;
  const totalItems = cart.length;

  const handleBuyNow = (moduleName) => {
    window.alert(`Successfully checked out ${groupedCart[moduleName].length} item(s) from ${moduleName}.`);
    setCart((prev) => prev.filter((item) => (item.cartModule || "Other") !== moduleName));
  };

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => (item.id || item._id) !== id));
  };

  return (
    <div className="min-h-dvh bg-black">
      <SideNav />
      <div
        className={`flex min-h-dvh flex-col transition-all duration-300 ${
          isOpen ? "md:ml-[250px]" : "md:ml-[80px]"
        }`}
      >
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          <ModuleHeader
            title="Saved Cart"
            search=""
            onSearchChange={() => {}}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

            <div className="flex-1 overflow-y-auto p-6 kc-scrollbar md:p-7">
            {totalItems === 0 ? (
              <div className="flex min-h-[calc(100dvh-190px)] flex-col justify-center rounded-[24px] border border-dashed border-gold/25 bg-[radial-gradient(circle_at_top,rgba(255,240,133,0.12),rgba(0,0,0,0.92)_55%)] px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full border border-gold/20 bg-black/60 text-[#FFF085]">
                  <svg width="34" height="34" fill="none" viewBox="0 0 24 24">
                    <path d="M3 3h2l3.6 7.6L7 14h12M7 14l1.5-6h11l-2.5 6H7zm2 5a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="mt-6 text-[30px] font-black tracking-tight text-[#FFF085]">Your cart is empty</h2>
                <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-7 text-white/65">
                  Explore rentals, transport, shop, and cold storage modules to save the items you want to revisit later.
                </p>

                <div className="mx-auto mt-8 grid w-full max-w-[760px] gap-4 md:grid-cols-3">
                  <CartMetric label="Saved Items" value="0" />
                  <CartMetric label="Active Modules" value="0" accent="text-white" />
                  <CartMetric label="Next Step" value="Explore" accent="text-green-400" />
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => navigate(`${baseRolePath}/shop`)}
                    className="rounded-[12px] bg-[#D4AF37] px-6 py-3 text-[13px] font-black text-[#0a1a0c] transition hover:-translate-y-[1px] hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)]"
                  >
                    Browse Modules
                  </button>
                  <button
                    onClick={() => navigate(baseRolePath)}
                    className="rounded-[12px] border border-gold/25 bg-transparent px-6 py-3 text-[13px] font-bold text-[#FFF085] transition hover:border-gold/40 hover:bg-white/5"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <CartMetric label="Saved Items" value={String(totalItems).padStart(2, "0")} />
                  <CartMetric label="Active Modules" value={String(totalModules).padStart(2, "0")} accent="text-white" />
                  <CartMetric
                    label="Quick Summary"
                    value={orderedModules[0] || "Ready"}
                    accent="text-green-400"
                  />
                </div>

                <div className="rounded-[22px] border border-gold/18 bg-[#071209] px-5 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[18px] font-black text-[#FFF085]">Review Your Saved Selections</div>
                      <div className="mt-1 text-[13px] text-white/58">
                        Continue module-wise so your booking or purchase decisions stay organized.
                      </div>
                    </div>
                    <div className="rounded-full border border-gold/20 bg-black/50 px-4 py-2 text-[12px] font-semibold text-white/70">
                      {totalItems} item{totalItems !== 1 ? "s" : ""} across {totalModules} module{totalModules !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                {orderedModules.map((moduleName) => {
                  const items = groupedCart[moduleName];
                  return (
                    <section
                      key={moduleName}
                      className="rounded-[24px] border border-gold/22 bg-[#040404] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] md:p-6"
                    >
                      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-gold/15 pb-5">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-[24px] font-black text-[#FFF085]">{moduleName}</h2>
                            <span className="rounded-full border border-gold/20 bg-[#0a1a0c] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.5px] text-white/70">
                              {items.length} item{items.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <p className="mt-2 max-w-[720px] text-[13px] leading-6 text-white/58">
                            {moduleDescriptions[moduleName] || moduleDescriptions.Other}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => navigate(moduleRoutes[moduleName] || "/farmer")}
                            className="rounded-[12px] border border-gold/24 bg-transparent px-5 py-3 text-[12px] font-bold uppercase tracking-[0.45px] text-[#FFF085] transition hover:border-gold/45 hover:bg-white/5"
                          >
                            Open Module
                          </button>
                          <button
                            onClick={() => handleBuyNow(moduleName)}
                            className="rounded-[12px] bg-[#D4AF37] px-5 py-3 text-[12px] font-black uppercase tracking-[0.45px] text-[#0a1a0c] transition hover:-translate-y-[1px] hover:bg-white hover:shadow-[0_10px_20px_rgba(255,240,133,0.18)]"
                          >
                            Continue
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px]">
                        {items.map((item, index) => (
                          <CartItemCard
                            key={item.id || item._id || `${moduleName}-${index}`}
                            item={item}
                            onRemove={handleRemove}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
