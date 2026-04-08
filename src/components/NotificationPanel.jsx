import { XMarkIcon } from "@heroicons/react/24/outline";
import { UseAppContext } from "../context/AppContext";
import { useLocation } from "react-router";

function Avatar({ label }) {
    return (
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-sm font-extrabold text-gold">
            {label}
        </div>
    );
}

export default function NotificationPanel() {
    const location = useLocation();
    const {
        role,
        notificationsOpen,
        setNotificationsOpen,
        serviceProviderNotifications,
        farmerNotifications,
        handleProviderNotificationAction,
    } = UseAppContext();

    const routeRole = location.pathname.startsWith("/serviceprovider")
        ? "serviceprovider"
        : location.pathname.startsWith("/farmer")
            ? "farmer"
            : "";

    const effectiveRole = routeRole || role;
    const notifications =
        effectiveRole === "serviceprovider"
            ? serviceProviderNotifications
            : farmerNotifications;

    return (
        <>
            <div
                className={`fixed inset-0 z-190 bg-black/35 backdrop-blur-[2px] transition ${notificationsOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
                onClick={() => setNotificationsOpen(false)}
            />

            <aside
                className={`fixed right-0 top-0 z-200 flex h-dvh w-full max-w-105 flex-col border-l border-gold/20 bg-black/85 shadow-[-24px_0_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform duration-300 ${notificationsOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="border-b border-gold/15 bg-linear-to-b from-gold/10 to-transparent px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/60">
                                Notifications
                            </p>
                            <h2 className="mt-2 text-2xl font-extrabold text-gold">
                                {effectiveRole === "serviceprovider" ? "Farmer Requests" : "Request Updates"}
                            </h2>
                            <p className="mt-2 text-sm text-white/65">
                                {effectiveRole === "serviceprovider"
                                    ? "Review incoming requests from farmers and respond without leaving the page."
                                    : "Track how service providers responded to your latest requests."}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setNotificationsOpen(false)}
                            className="rounded-full border border-gold/20 p-2 text-gold transition hover:bg-gold/10"
                        >
                            <XMarkIcon className="size-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-darkgreen px-5 py-5">
                    {notifications.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-gold/25 bg-black/30 p-8 text-center">
                            <div className="text-lg font-bold text-white">No notifications right now</div>
                            <div className="mt-2 text-sm text-white/60">
                                New request activity will appear here.
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((item) => {
                                const isProvider = effectiveRole === "serviceprovider";
                                const badgeText = isProvider
                                    ? item.module
                                    : item.status === "accepted"
                                        ? "Accepted"
                                        : "Rejected";

                                return (
                                    <div
                                        key={item.id}
                                        className="rounded-3xl border border-gold/20 bg-black/55 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
                                    >
                                        <div className="flex items-start gap-3">
                                            <Avatar label={isProvider ? item.farmerAvatar : item.providerAvatar} />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <div className="text-sm font-bold text-white">
                                                        {isProvider ? item.farmerName : item.providerName}
                                                    </div>
                                                    <span
                                                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${isProvider
                                                            ? "border-gold/30 text-gold"
                                                            : item.status === "accepted"
                                                                ? "border-green-400/40 text-green-400"
                                                                : "border-red-400/40 text-red-400"
                                                            }`}
                                                    >
                                                        {badgeText}
                                                    </span>
                                                </div>

                                                <div className="mt-2 text-sm font-semibold text-gold">{item.title}</div>
                                                <div className="mt-2 text-sm leading-6 text-white/65">{item.detail}</div>

                                                {isProvider && (
                                                    <div className="mt-4 flex gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleProviderNotificationAction(item.id, "accept")}
                                                            className="flex-1 rounded-xl bg-[#FFF085] px-4 py-3 text-sm font-bold text-black transition hover:brightness-95"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleProviderNotificationAction(item.id, "delete")}
                                                            className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-500"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
