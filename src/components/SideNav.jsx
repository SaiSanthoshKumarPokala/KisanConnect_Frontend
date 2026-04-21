import { XMarkIcon, Bars3Icon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import Dashboard from "/dashboard.svg";
import Truck from "/trucks.svg";
import Shopping from "/shops.svg";
import Sparkles from "/sparkles.svg";
import Document from "/document.svg";
import Building from "/coldstorages.svg";
import Market from "/shops.svg";
import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router";
import { UseAppContext } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function SideNav() {
    const { role, axios, setRole, user, navigate, isOpen, setIsOpen } = UseAppContext();
    const { t } = useLanguage();
    const location = useLocation();

    const routeRole = location.pathname.startsWith("/serviceprovider")
        ? "serviceprovider"
        : location.pathname.startsWith("/farmer")
            ? "farmer"
            : "";
    const effectiveRole = routeRole || role || "farmer";

    const profileInitials = (user?.name || "Profile")
        .split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

    const switchRoleLocally = (nextRole) => {
        setRole(nextRole);
        localStorage.setItem("role", nextRole);
        navigate(`/${nextRole}`);
    };

    const changeRole = async () => {
        try {
            if (effectiveRole === "farmer") {
                const { data } = await axios.post("/api/farmer/changerole");
                if (data.success) { setRole("serviceprovider"); localStorage.setItem("role", "serviceprovider"); alert(data.message); navigate("/serviceprovider"); }
                else { alert(data.message); }
            } else {
                const { data } = await axios.post("/api/serviceprovider/changerole");
                if (data.success) { setRole("farmer"); localStorage.setItem("role", "farmer"); alert(data.message); navigate("/farmer"); }
                else { alert(data.message); }
            }
        } catch (error) {
            if (effectiveRole === "farmer") switchRoleLocally("serviceprovider");
            else switchRoleLocally("farmer");
        }
    };

    const Menu = [
        { path: `/${effectiveRole}/`,           icon: Dashboard, labelKey: "nav_dashboard", index: 1 },
        { path: `/${effectiveRole}/rentals`,     icon: Truck,     labelKey: "nav_rentals",   index: 2 },
        { path: `/${effectiveRole}/shop`,        icon: Shopping,  labelKey: "nav_shop",      index: 3 },
        { path: `/${effectiveRole}/marketplace`, icon: Market,    labelKey: "nav_marketplace",index: 4 },
        { path: `/${effectiveRole}/transport`,   icon: Truck,     labelKey: "nav_transport", index: 5 },
        { path: `/${effectiveRole}/contract`,    icon: Document,  labelKey: "nav_contract",  index: 6 },
        { path: `/${effectiveRole}/coldstorage`, icon: Building,  labelKey: "nav_coldstorage",index: 7 },
        { path: `/${effectiveRole}/aitoolkit`,   icon: Sparkles,  labelKey: "nav_aitoolkit", index: 8 },
    ];

    const [mobileOpen, setMobileOpen] = useState(false);
    const profilePath = effectiveRole === "serviceprovider" ? "/serviceprovider/profile" : "/farmer/profile";

    return (
        <>
            {/* ── Desktop Sidebar ── */}
            <div
                className={`hidden md:flex md:flex-col h-dvh fixed top-0 left-0 bg-linear-to-b from-gold to-yellow-200 border-r border-darkgreen text-white font-bold z-10 transition-all duration-300 overflow-hidden
                    ${isOpen ? "w-[250px] p-6" : "w-[80px] p-4 items-center"}`}
            >
                {isOpen ? (
                    /* ── EXPANDED ── */
                    <>
                        <div className="flex flex-row justify-between items-center mb-4">
                            <Link to="/" className="flex flex-row items-center gap-2">
                                <img src="/Kisan Connect Logo 1.png" className="size-16 rounded-full" alt="Logo" />
                                <div className="flex flex-col items-start justify-center text-xl">
                                    <p className="font-bold text-darkgreen">KISAN</p>
                                    <p className="font-bold text-darkgreen">CONNECT</p>
                                </div>
                            </Link>
                            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-xl hover:bg-darkgreen/10 cursor-pointer transition-colors" aria-label="Close sidebar">
                                <XMarkIcon className="size-6 text-darkgreen" />
                            </button>
                        </div>

                        <div className="flex flex-col items-start justify-evenly my-4 gap-2 text-darkgreen flex-1">
                            {Menu.map((options) => (
                                <NavLink
                                    key={options.index}
                                    to={options.path}
                                    aria-label={t(options.labelKey)}
                                    className={({ isActive }) =>
                                        `flex flex-row items-center gap-2 w-full ${isActive ? "p-2 bg-darkgreen/40 rounded-xl" : "p-2 hover:bg-darkgreen/40 hover:rounded-xl"}`
                                    }
                                    end
                                >
                                    <img src={options.icon} alt="" className="size-8" />
                                    <p className="font-semibold">{t(options.labelKey)}</p>
                                </NavLink>
                            ))}
                        </div>

                        {/* Language Switcher */}
                        <div className="mb-3">
                            <LanguageSwitcher collapsed={false} />
                        </div>

                        <div className="flex flex-col items-start justify-center gap-3 border-t border-darkgreen/60 pt-4">
                            <Link to={profilePath} className="flex flex-row items-center justify-start gap-3 pt-2 px-2">
                                <div className="flex size-11 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-br from-[#0f2d18] to-[#07150c] text-sm font-extrabold text-[#fff2a1] shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
                                    {profileInitials}
                                </div>
                                <p className="text-xl font-semibold text-darkgreen">{t("nav_profile")}</p>
                            </Link>
                            <button
                                onClick={() => changeRole()}
                                className="group flex flex-row items-center justify-between gap-2 p-2 text-gold rounded-xl border-gold border cursor-pointer hover:bg-gold hover:text-darkgreen bg-darkgreen transition-all ease-in duration-100 w-full"
                            >
                                <ArrowsRightLeftIcon className="size-8 stroke-gold group-hover:stroke-darkgreen" />
                                {effectiveRole === "serviceprovider" ? (
                                    <p>{t("nav_switch_farmer")}</p>
                                ) : (
                                    <p className="flex flex-col items-start text-left">
                                        <span>Switch to Service</span>
                                        <span>Provider</span>
                                    </p>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    /* ── COLLAPSED ── */
                    <>
                        <button onClick={() => setIsOpen(true)} className="p-2 rounded-xl hover:bg-darkgreen/10 cursor-pointer transition-colors mb-4" aria-label="Open sidebar">
                            <Bars3Icon className="size-7 text-darkgreen" />
                        </button>

                        <Link to="/" className="mb-4">
                            <img src="/Kisan Connect Logo 1.png" className="size-10 rounded-full" alt="Logo" />
                        </Link>

                        <div className="flex flex-col items-center gap-1 flex-1">
                            {Menu.map((options) => (
                                <NavLink
                                    key={options.index}
                                    to={options.path}
                                    aria-label={t(options.labelKey)}
                                    className={({ isActive }) =>
                                        `flex items-center justify-center p-2 w-full rounded-xl ${isActive ? "bg-darkgreen/40" : "hover:bg-darkgreen/20"}`
                                    }
                                    end
                                >
                                    <img src={options.icon} alt={t(options.labelKey)} className="size-7" />
                                </NavLink>
                            ))}
                        </div>

                        {/* Collapsed Language Switcher */}
                        <div className="mb-2">
                            <LanguageSwitcher collapsed={true} />
                        </div>

                        <div className="flex flex-col items-center gap-2 border-t border-darkgreen/60 pt-3 mt-auto">
                            <Link to={profilePath} className="flex items-center justify-center p-1">
                                <div className="flex size-9 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-br from-[#0f2d18] to-[#07150c] text-xs font-extrabold text-[#fff2a1]">
                                    {profileInitials}
                                </div>
                            </Link>
                            <button onClick={() => changeRole()} className="p-2 rounded-xl hover:bg-darkgreen/10 cursor-pointer transition-colors" aria-label="Switch role">
                                <ArrowsRightLeftIcon className="size-6 text-darkgreen" />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* ── Mobile Sidebar ── */}
            {!mobileOpen && (
                <div className="w-full flex flex-col md:hidden sticky top-0 items-center p-4 font-montserrat z-100 text-darkgreen bg-gold">
                    <div className="flex w-full flex-row items-center justify-between">
                        <Link to="/"><img src="/Kisan Connect Logo 1.png" className="size-14 rounded-full" alt="Logo" /></Link>
                        <button className="p-2 cursor-pointer" onClick={() => setMobileOpen(true)}>
                            <Bars3Icon className="size-10" />
                        </button>
                    </div>
                </div>
            )}
            {mobileOpen && (
                <div className="w-full flex flex-col md:hidden sticky top-0 items-center p-4 font-montserrat z-100 text-darkgreen bg-gold h-dvh">
                    <div className="flex w-full flex-row items-center justify-between">
                        <Link to="/"><img src="/Kisan Connect Logo 1.png" className="size-14 rounded-full" alt="Logo" /></Link>
                        <button className="p-2 cursor-pointer" onClick={() => setMobileOpen(false)}>
                            <XMarkIcon className="size-10" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 items-start justify-start w-full h-full pb-4 overflow-y-auto">
                        <div className="flex flex-col items-start justify-evenly my-2 gap-2 w-full">
                            {Menu.map((options) => (
                                <NavLink
                                    key={options.index}
                                    to={options.path}
                                    aria-label={t(options.labelKey)}
                                    className={({ isActive }) =>
                                        `flex flex-row items-center gap-2 w-full ${isActive ? "p-2 bg-white/40 rounded-xl" : "p-2 hover:bg-white/40 hover:rounded-xl"}`
                                    }
                                    end
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <img src={options.icon} alt="" className="size-8" />
                                    <p className="font-semibold">{t(options.labelKey)}</p>
                                </NavLink>
                            ))}

                            {/* Mobile Language Switcher */}
                            <div className="w-full mt-2">
                                <LanguageSwitcher collapsed={false} />
                            </div>

                            <div className="flex flex-col items-start justify-center gap-3 border-t border-darkgreen/60 pt-4 w-full mt-auto">
                                <Link to={profilePath} onClick={() => setMobileOpen(false)} className="flex flex-row items-center justify-start gap-3 pt-2 px-2 w-full">
                                    <div className="flex size-11 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-br from-[#0f2d18] to-[#07150c] text-sm font-extrabold text-[#fff2a1] shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
                                        {profileInitials}
                                    </div>
                                    <p className="text-xl font-semibold text-darkgreen">{t("nav_profile")}</p>
                                </Link>
                                <button onClick={() => changeRole()} className="group flex flex-row items-center justify-start gap-2 p-2 text-gold rounded-xl border-gold border cursor-pointer hover:bg-gold hover:text-darkgreen bg-darkgreen transition-all ease-in duration-100 w-full">
                                    <ArrowsRightLeftIcon className="size-8 stroke-gold group-hover:stroke-darkgreen" />
                                    <p>{effectiveRole === "serviceprovider" ? t("nav_switch_farmer") : t("nav_switch_sp")}</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
