import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { UseAppContext } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "react-router";

// ─── Shared helpers ───────────────────────────────────────────────────────────
function Avatar({ label, color = "gold" }) {
  const styles = {
    gold:   { border: "border-gold/30",      bg: "bg-gold/10",      text: "text-gold" },
    red:    { border: "border-red-400/30",   bg: "bg-red-400/10",   text: "text-red-400" },
    blue:   { border: "border-blue-400/30",  bg: "bg-blue-400/10",  text: "text-blue-400" },
    green:  { border: "border-green-400/30", bg: "bg-green-400/10", text: "text-green-400" },
    purple: { border: "border-purple-400/30",bg: "bg-purple-400/10",text: "text-purple-400" },
    amber:  { border: "border-amber-400/30", bg: "bg-amber-400/10", text: "text-amber-400" },
    orange: { border: "border-orange-400/30",bg: "bg-orange-400/10",text: "text-orange-400" },
  };
  const s = styles[color] || styles.gold;
  return (
    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${s.border} ${s.bg} text-sm font-extrabold ${s.text} shrink-0`}>
      {label}
    </div>
  );
}

function fmt(d) { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
function fmtTime(d) { return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); }
function SectionHeading({ label }) { return <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-gold/50">{label}</p>; }

// ─── Payment status badge ─────────────────────────────────────────────────────
function PaymentBadge({ paid, paidAt }) {
  if (paid) {
    return (
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 8, padding: "5px 10px", width: "fit-content" }}>
        <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 800 }}>✓ Payment Done</span>
        {paidAt && <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>· {fmt(paidAt)}</span>}
      </div>
    );
  }
  return (
    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 8, padding: "5px 10px", width: "fit-content" }}>
      <span style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700 }}>⏳ Awaiting Payment</span>
    </div>
  );
}

// ─── Cold Storage deal card ───────────────────────────────────────────────────
function ColdStorageDealCard({ deal, effectiveRole, onPayClick }) {
  const initials = effectiveRole === "serviceprovider"
    ? (deal.farmerName || "FA").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : (deal.storage?.name || "CS").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((new Date(deal.endDate) - today) / (1000 * 60 * 60 * 24));

  // Calculate amount: quantity × price × days
  const days   = Math.max(1, Math.ceil((new Date(deal.endDate) - new Date(deal.startDate)) / (1000 * 60 * 60 * 24)));
  const price  = deal.storage?.price || 0;
  const amount = deal.quantity * price * days;
  const isPaid = deal.paymentStatus === "paid";

  return (
    <div className="rounded-[20px] border border-gold/20 bg-black/50 p-4">
      <div className="flex items-start gap-3">
        <Avatar label={initials} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-bold text-white">{effectiveRole === "serviceprovider" ? deal.farmerName : deal.storage?.name}</span>
            <span className="rounded-full border border-green-400/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-green-400">Cold Storage</span>
          </div>
          <p className="text-sm font-semibold text-gold">{effectiveRole === "serviceprovider" ? `${deal.cropName} at ${deal.storage?.name}` : `Your ${deal.cropName} at ${deal.storage?.name}`}</p>
          <p className="mt-1 text-sm text-white/60">{deal.quantity}T · {fmt(deal.startDate)} → {fmt(deal.endDate)}</p>
          {effectiveRole === "serviceprovider" && <p className="mt-0.5 text-xs text-white/40">{deal.farmerLocation} · {deal.farmerContact}</p>}
          <p className="mt-2 text-xs font-semibold text-gold/70">{daysLeft <= 0 ? "Ends today" : daysLeft === 1 ? "1 day remaining" : `${daysLeft} days remaining`}</p>

          {/* Payment section */}
          {effectiveRole === "farmer" ? (
            isPaid ? (
              <PaymentBadge paid paidAt={deal.paidAt} />
            ) : (
              <button
                onClick={() => onPayClick({ deal, module: "coldstorage", amount, label: `Cold Storage — ${deal.storage?.name}` })}
                style={{ marginTop: 10, border: "none", background: "linear-gradient(135deg,#FFF085 0%,#D4AF37 100%)", color: "#111", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                💳 Pay Now — ₹{amount.toLocaleString()}
              </button>
            )
          ) : (
            <PaymentBadge paid={isPaid} paidAt={deal.paidAt} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Transport deal card ──────────────────────────────────────────────────────
function TransportDealCard({ deal, effectiveRole, onPayClick }) {
  const initials = effectiveRole === "serviceprovider"
    ? (deal.farmerName || "FA").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : (deal.transport?.name || "TR").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((new Date(deal.pickupDate) - today) / (1000 * 60 * 60 * 24));

  const amount = (deal.transport?.price || 0) * (deal.distance || 1);
  const isPaid = deal.paymentStatus === "paid";

  return (
    <div className="rounded-[20px] border border-gold/20 bg-black/50 p-4">
      <div className="flex items-start gap-3">
        <Avatar label={initials} color="blue" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-bold text-white">{effectiveRole === "serviceprovider" ? deal.farmerName : deal.transport?.name}</span>
            <span className="rounded-full border border-blue-400/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">Transport</span>
          </div>
          <p className="text-sm font-semibold text-gold">{deal.cropName} · {deal.pickupLocation} → {deal.dropLocation}</p>
          <p className="mt-1 text-sm text-white/60">{deal.estimatedWeight} · {fmt(deal.pickupDate)}</p>
          {effectiveRole === "serviceprovider" && <p className="mt-0.5 text-xs text-white/40">{deal.farmerContact}</p>}
          <p className="mt-2 text-xs font-semibold text-gold/70">{daysLeft <= 0 ? "Pickup today" : daysLeft === 1 ? "Pickup tomorrow" : `${daysLeft} days until pickup`}</p>

          {effectiveRole === "farmer" ? (
            isPaid ? (
              <PaymentBadge paid paidAt={deal.paidAt} />
            ) : (
              <button
                onClick={() => onPayClick({ deal, module: "transport", amount, label: `Transport — ${deal.transport?.name}` })}
                style={{ marginTop: 10, border: "none", background: "linear-gradient(135deg,#FFF085 0%,#D4AF37 100%)", color: "#111", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                💳 Pay Now — ₹{amount.toLocaleString()}
              </button>
            )
          ) : (
            <PaymentBadge paid={isPaid} paidAt={deal.paidAt} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Rental deal card ─────────────────────────────────────────────────────────
function RentalDealCard({ deal, effectiveRole, onPayClick }) {
  const initials = effectiveRole === "serviceprovider"
    ? (deal.farmerName || "FA").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : (deal.rental?.name || "RE").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((new Date(deal.endDate) - today) / (1000 * 60 * 60 * 24));

  // price per day × number of days
  const days   = Math.max(1, Math.ceil((new Date(deal.endDate) - new Date(deal.startDate)) / (1000 * 60 * 60 * 24)));
  const amount = (deal.rental?.price || 0) * days;
  const isPaid = deal.paymentStatus === "paid";

  return (
    <div className="rounded-[20px] border border-gold/20 bg-black/50 p-4">
      <div className="flex items-start gap-3">
        <Avatar label={initials} color="green" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-bold text-white">{effectiveRole === "serviceprovider" ? deal.farmerName : deal.rental?.name}</span>
            <span className="rounded-full border border-green-400/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-green-400">Rental</span>
          </div>
          <p className="text-sm font-semibold text-gold">{effectiveRole === "serviceprovider" ? `${deal.rental?.name} rented by ${deal.farmerName}` : `Your rental: ${deal.rental?.name}`}</p>
          <p className="mt-1 text-sm text-white/60">{fmt(deal.startDate)} → {fmt(deal.endDate)} · {days} day{days !== 1 ? "s" : ""}</p>
          {deal.deliveryAddress && <p className="mt-0.5 text-xs text-white/40">📍 {deal.deliveryAddress}</p>}
          {effectiveRole === "serviceprovider" && <p className="mt-0.5 text-xs text-white/40">{deal.farmerContact}</p>}
          <p className="mt-2 text-xs font-semibold text-gold/70">{daysLeft <= 0 ? "Ends today" : daysLeft === 1 ? "1 day remaining" : `${daysLeft} days remaining`}</p>

          {effectiveRole === "farmer" ? (
            isPaid ? (
              <PaymentBadge paid paidAt={deal.paidAt} />
            ) : (
              <button
                onClick={() => onPayClick({ deal, module: "rentals", amount, label: `Rental — ${deal.rental?.name} (${days} days)` })}
                style={{ marginTop: 10, border: "none", background: "linear-gradient(135deg,#FFF085 0%,#D4AF37 100%)", color: "#111", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                💳 Pay Now — ₹{amount.toLocaleString()}
              </button>
            )
          ) : (
            <PaymentBadge paid={isPaid} paidAt={deal.paidAt} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Contract card ────────────────────────────────────────────────────────────
function ContractDealCard({ deal, effectiveRole }) {
  const contract = deal.contract || {};
  const initials = effectiveRole === "serviceprovider"
    ? (deal.name || "FA").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : (contract.company || "CF").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="rounded-[20px] border border-gold/20 bg-black/50 p-4">
      <div className="flex items-start gap-3">
        <Avatar label={initials} color="amber" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-bold text-white">{effectiveRole === "serviceprovider" ? deal.name : contract.company}</span>
            <span className="rounded-full border border-amber-400/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400">Contract</span>
          </div>
          <p className="text-sm font-semibold text-gold">{contract.crop}{contract.variety ? ` (${contract.variety})` : ""} · {contract.region}</p>
          <p className="mt-1 text-sm text-white/60">Season: {contract.season} · Duration: {contract.duration}</p>
          <p className="mt-0.5 text-sm text-white/60">Price: ₹{contract.priceMin}–{contract.priceMax} / quintal</p>
          {effectiveRole === "serviceprovider" && <p className="mt-0.5 text-xs text-white/40">{deal.land} acres · {deal.phone}</p>}
          <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5">
            <span className="text-[10px] font-bold text-amber-400">Active Contract</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Order card (shop / marketplace) ─────────────────────────────────────────
function OrderCard({ order, effectiveRole, type, t }) {
  const itemSummary = (order.items || []).map((i) => `${i.quantity}× ${i.name}`).join(", ");
  const paidAt  = order.paidAt || order.createdAt;
  const isShop  = type === "shop";
  const label   = isShop
    ? (effectiveRole === "farmer" ? "Purchased · Shop" : "New Order Received")
    : (effectiveRole === "farmer"  ? "New Sale"         : "Purchased · Marketplace");
  const color   = isShop ? "purple" : "orange";
  const badge   = isShop ? "Shop"   : "Marketplace";

  return (
    <div className="rounded-[20px] border border-gold/20 bg-black/50 p-4">
      <div className="flex items-start gap-3">
        <Avatar label={isShop ? "🛒" : "🌾"} color={color} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-bold text-white">{label}</span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${isShop ? "border-purple-400/40 text-purple-400" : "border-orange-400/40 text-orange-400"}`}>{badge}</span>
          </div>
          <p className="text-sm font-semibold text-gold mt-1">{itemSummary}</p>
          <p className="mt-1 text-sm text-white/60">Total: <span className="font-bold text-[#FFF085]">₹{(order.totalAmount || 0).toLocaleString()}</span></p>
          <p className="mt-1 text-xs text-white/40">{paidAt ? `${fmt(paidAt)} at ${fmtTime(paidAt)}` : "—"}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Rejected card ────────────────────────────────────────────────────────────
function RejectedCard({ booking, type, t }) {
  const name    = type === "transport" ? booking.transport?.name : booking.rental?.name;
  const initials = (name || "X").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const date    = type === "transport" ? fmt(booking.pickupDate) : `${fmt(booking.startDate)} → ${fmt(booking.endDate)}`;
  return (
    <div className="rounded-[20px] border border-red-400/20 bg-black/50 p-4">
      <div className="flex items-start gap-3">
        <Avatar label={initials} color="red" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-bold text-white">{name}</span>
            <span className="rounded-full border border-red-400/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-red-400">Rejected · {type === "transport" ? "Transport" : "Rental"}</span>
          </div>
          <p className="text-sm text-white/60">{date}</p>
          <p className="mt-2 text-xs text-red-400/70 font-medium">Your request was rejected. Try a different listing or dates.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function NotificationPanel() {
  const location = useLocation();
  const { t } = useLanguage();
  const {
    role, notificationsOpen, setNotificationsOpen,
    ongoingDeals, transportDeals, transportRejected,
    rentalDeals, rentalRejected, contractDeals,
    shopOrders, marketplaceOrders,
    refreshNotifications, payDeal, axios,
  } = UseAppContext();

  // Payment state
  const [payTarget, setPayTarget] = useState(null);
  const [paying,    setPaying]    = useState(false);

  const routeRole     = location.pathname.startsWith("/serviceprovider") ? "serviceprovider" : location.pathname.startsWith("/farmer") ? "farmer" : "";
  const effectiveRole = routeRole || role;

  useEffect(() => { if (notificationsOpen) refreshNotifications(); }, [notificationsOpen]);

  const today        = new Date(); today.setHours(0, 0, 0, 0);
  const threeDaysAgo = new Date(today); threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const activeColdDeals      = (ongoingDeals    || []).filter((d) => new Date(d.endDate)    >= today);
  const activeTransportDeals = (transportDeals  || []).filter((d) => new Date(d.pickupDate) >= today);
  const activeRentalDeals    = (rentalDeals     || []).filter((d) => new Date(d.endDate)    >= today);
  const activeContractDeals  = contractDeals    || [];
  const activeShopOrders     = (shopOrders      || []).filter((o) => new Date(o.paidAt || o.createdAt) >= threeDaysAgo);
  const activeMktOrders      = (marketplaceOrders || []).filter((o) => new Date(o.paidAt || o.createdAt) >= threeDaysAgo);
  const rejectedTransport    = effectiveRole === "farmer" ? (transportRejected || []) : [];
  const rejectedRentals      = effectiveRole === "farmer" ? (rentalRejected    || []) : [];

  const totalCount =
    activeColdDeals.length + activeTransportDeals.length +
    activeRentalDeals.length + activeContractDeals.length +
    activeShopOrders.length + activeMktOrders.length +
    rejectedTransport.length + rejectedRentals.length;

  // ── Razorpay payment flow ──────────────────────────────────────────────────
  const handlePayClick = async (target) => {
    if (paying) return;
    setPaying(true);
    setPayTarget(target);

    try {
      // Step 1: Create Razorpay order on backend
      const { data } = await axios.post("/api/buy/order", {
        product: [{ id: target.deal._id, name: target.label, price: target.amount, quantity: 1 }],
        amount:  target.amount,
      });

      if (!data.success) { window.alert(data.message); setPaying(false); setPayTarget(null); return; }

      // Step 2: Open Razorpay popup
      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      data.order.amount,
        currency:    data.order.currency || "INR",
        name:        "KisanConnect",
        description: target.label,
        order_id:    data.order.id,
        handler: async (response) => {
          try {
            // Step 3: Verify payment on backend
            const verify = await axios.post("/api/buy/verify", {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            });

            if (verify.data.success) {
              // Step 4: Mark booking as paid in the module (rentals/transport/coldstorage)
              await payDeal(target.module, target.deal._id, target.amount);
              window.alert("Payment successful! The service provider has been notified.");
            } else {
              window.alert("Payment verification failed: " + verify.data.message);
            }
          } catch (e) {
            window.alert("Verification error: " + e.message);
          } finally {
            setPaying(false);
            setPayTarget(null);
          }
        },
        prefill: { name: "", email: "", contact: "" },
        theme:   { color: "#D4AF37" },
        modal:   { ondismiss: () => { setPaying(false); setPayTarget(null); } },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      window.alert(error.message);
      setPaying(false);
      setPayTarget(null);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[190] bg-black/40 backdrop-blur-[2px] transition ${notificationsOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setNotificationsOpen(false)}
      />

      {/* Panel */}
      <aside className={`fixed right-0 top-0 z-[200] flex h-dvh w-full max-w-[420px] flex-col border-l border-gold/20 bg-black/80 shadow-[-24px_0_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform duration-300 ${notificationsOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="border-b border-gold/20 bg-gradient-to-b from-gold/10 to-transparent px-6 py-5 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/60">{t("notif_activity")}</p>
              <h2 className="mt-2 text-2xl font-extrabold text-gold">{t("notif_title")}</h2>
              <p className="mt-2 text-sm text-white/60">
                {effectiveRole === "serviceprovider" ? t("notif_sp_subtitle") : t("notif_farmer_subtitle")}
              </p>
            </div>
            <button type="button" onClick={() => setNotificationsOpen(false)} className="rounded-full border border-gold/20 p-2 text-gold transition hover:bg-gold/10">
              <XMarkIcon className="size-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#081D0C] px-5 py-5 space-y-6">
          {totalCount === 0 ? (
            <div className="rounded-[24px] border border-dashed border-gold/25 bg-black/30 p-8 text-center">
              <div className="text-lg font-bold text-white">{t("notif_empty")}</div>
              <div className="mt-2 text-sm text-white/60">{t("notif_empty_sub")}</div>
            </div>
          ) : (
            <>
              {activeShopOrders.length > 0 && (
                <div>
                  <SectionHeading label={t("notif_section_shop")} />
                  <div className="space-y-3">
                    {activeShopOrders.map((o) => <OrderCard key={o._id} order={o} effectiveRole={effectiveRole} type="shop" t={t} />)}
                  </div>
                </div>
              )}

              {activeMktOrders.length > 0 && (
                <div>
                  <SectionHeading label={t("notif_section_market")} />
                  <div className="space-y-3">
                    {activeMktOrders.map((o) => <OrderCard key={o._id} order={o} effectiveRole={effectiveRole} type="marketplace" t={t} />)}
                  </div>
                </div>
              )}

              {activeColdDeals.length > 0 && (
                <div>
                  <SectionHeading label={t("notif_section_cold")} />
                  <div className="space-y-3">
                    {activeColdDeals.map((d) => <ColdStorageDealCard key={d._id} deal={d} effectiveRole={effectiveRole} onPayClick={handlePayClick} />)}
                  </div>
                </div>
              )}

              {activeTransportDeals.length > 0 && (
                <div>
                  <SectionHeading label={t("notif_section_transport")} />
                  <div className="space-y-3">
                    {activeTransportDeals.map((d) => <TransportDealCard key={d._id} deal={d} effectiveRole={effectiveRole} onPayClick={handlePayClick} />)}
                  </div>
                </div>
              )}

              {activeRentalDeals.length > 0 && (
                <div>
                  <SectionHeading label={t("notif_section_rental")} />
                  <div className="space-y-3">
                    {activeRentalDeals.map((d) => <RentalDealCard key={d._id} deal={d} effectiveRole={effectiveRole} onPayClick={handlePayClick} />)}
                  </div>
                </div>
              )}

              {activeContractDeals.length > 0 && (
                <div>
                  <SectionHeading label={t("notif_section_contract")} />
                  <div className="space-y-3">
                    {activeContractDeals.map((d) => <ContractDealCard key={d._id} deal={d} effectiveRole={effectiveRole} />)}
                  </div>
                </div>
              )}

              {(rejectedTransport.length > 0 || rejectedRentals.length > 0) && (
                <div>
                  <SectionHeading label={t("notif_section_rejected")} />
                  <div className="space-y-3">
                    {rejectedTransport.map((b) => <RejectedCard key={b._id} booking={b} type="transport" t={t} />)}
                    {rejectedRentals.map((b)   => <RejectedCard key={b._id} booking={b} type="rental" t={t} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </aside>

    </>
  );
}
