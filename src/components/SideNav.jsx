import { XMarkIcon, Bars3Icon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline"
// import { TruckIcon, SparklesIcon, BuildingStorefrontIcon, CircleStackIcon, ShoppingBagIcon, DocumentTextIcon, Squares2X2Icon } from "@heroicons/react/24/solid";
import Dashboard from "/dashboard.svg"
import Truck from "/trucks.svg"
import Shopping from "/shops.svg"
import Sparkles from "/sparkles.svg"
import Document from "/document.svg"
import Building from "/coldstorages.svg"
import Market from "/shops.svg"
import { useState } from "react"
import { NavLink, Link, useLocation } from "react-router"
import { UseAppContext } from "../context/AppContext"
export default function SideNav() {

    const { role, axios, setRole, user, navigate } = UseAppContext();
    const location = useLocation();
    const routeRole = location.pathname.startsWith("/serviceprovider")
        ? "serviceprovider"
        : location.pathname.startsWith("/farmer")
            ? "farmer"
            : "";
    const effectiveRole = routeRole || role || "farmer";
    const profileInitials = (user?.name || "Profile")
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const switchRoleLocally = (nextRole) => {
        setRole(nextRole);
        localStorage.setItem('role', nextRole);
        navigate(`/${nextRole}`);
    }

    const changeRole = async () => {
        try {
            if (effectiveRole == "farmer") {
                const { data } = await axios.post(`/api/farmer/changerole`);
                if (data.success) {
                    setRole("serviceprovider");
                    localStorage.setItem('role', "serviceprovider");
                    alert(data.message);
                    navigate('/serviceprovider');
                } else {
                    alert(data.message);
                }
            } else if (effectiveRole == "serviceprovider") {
                const { data } = await axios.post(`/api/serviceprovider/changerole`);
                if (data.success) {
                    setRole("farmer");
                    localStorage.setItem('role', "farmer");
                    alert(data.message);
                    navigate('/farmer');
                } else {
                    alert(data.message);
                }
            }
        } catch (error) {
            if (effectiveRole == "farmer") {
                switchRoleLocally("serviceprovider");
            } else if (effectiveRole == "serviceprovider") {
                switchRoleLocally("farmer");
            }
        }
    }

    const Menu = [
        { path: `/${effectiveRole}/`, icon: Dashboard, name: "Dashboard", index: 1 },
        { path: `/${effectiveRole}/rentals`, icon: Truck, name: "Rentals", index: 2 },
        { path: `/${effectiveRole}/shop`, icon: Shopping, name: "Shop", index: 3 },
        { path: `/${effectiveRole}/marketplace`, icon: Market, name: "Marketplace", index: 4 },
        { path: `/${effectiveRole}/transport`, icon: Truck, name: "Transport", index: 5 },
        { path: `/${effectiveRole}/contract`, icon: Document, name: "Contract Farming", index: 6 },
        { path: `/${effectiveRole}/coldstorage`, icon: Building, name: "Cold Storage", index: 7 },
        { path: `/${effectiveRole}/aitoolkit`, icon: Sparkles, name: "AI Tool Kit", index: 8 }
    ]
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* For medium and large screens */}
            <div className="hidden md:flex md:flex-col w-fit h-dvh fixed top-0 left-0 p-6 bg-linear-to-b from-gold to-yellow-200 border-r border-darkgreen text-white font-bold z-10">
                    <div className="flex flex-row justify-between items-center">
                        <Link to="/" className="flex flex-row items-center gap-2">
                            <img src="/Kisan Connect Logo 1.png" className="size-16 rounded-full" alt="Logo" />
                            <div className="flex flex-col items-start justify-center text-xl">
                                <p className="font-bold text-darkgreen">KISAN</p>
                                <p className="font-bold text-darkgreen">CONNECT</p>
                            </div>
                        </Link>
                    </div>
                    {effectiveRole == "serviceprovider" ?
                        <div className="flex flex-col items-start justify-evenly my-4 gap-2 text-darkgreen">
                            {Menu.map((options) => (
                                <NavLink key={options.index} to={options.path} aria-label={options.name} className={({ isActive }) => `flex flex-row items-center gap-2 w-full ${isActive ? "p-2 bg-darkgreen/40 rounded-xl" : "p-2 hover:bg-darkgreen/40 hover:rounded-xl"}`} end>
                                    <img src={options.icon} alt="" className="size-8" />
                                    <p className="font-semibold">{options.name}</p>
                                </NavLink>
                            ))}
                            <div className="flex flex-col items-start justify-center gap-3 border-t border-darkgreen/60 pt-4 my-auto fixed bottom-4">
                                <Link to="/serviceprovider/profile" className="flex flex-row items-center justify-start gap-3 pt-2 px-2">
                                    <div className="flex size-11 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-br from-[#0f2d18] to-[#07150c] text-sm font-extrabold text-[#fff2a1] shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
                                        {profileInitials}
                                    </div>
                                    <p className="text-xl font-semibold text-darkgreen">Profile</p>
                                </Link>
                                <button onClick={() => { changeRole() }} className="group flex flex-row items-center justify-between gap-2 p-2 text-gold rounded-xl border-gold border cursor-pointer hover:bg-gold hover:text-darkgreen bg-darkgreen transition-all ease-in duration-100">
                                    <ArrowsRightLeftIcon className="size-8 stroke-gold group-hover:stroke-darkgreen" />
                                    <p>Switch to Farmer</p>
                                </button>
                            </div>
                        </div> :
                        <div className="flex flex-col items-start justify-evenly my-4 gap-2 text-darkgreen">
                            {Menu.map((options) => (
                                <NavLink key={options.index} to={options.path} aria-label={options.name} className={({ isActive }) => `flex flex-row items-center gap-2 w-full ${isActive ? "p-2 bg-darkgreen/40 rounded-xl" : "p-2 hover:bg-darkgreen/40 hover:rounded-xl"}`} end>
                                    <img src={options.icon} alt="" className="size-8 fill-darkgreen" />
                                    <p className="font-semibold">{options.name}</p>
                                </NavLink>
                            ))}
                            <div className="flex flex-col items-start justify-center gap-3 border-t border-darkgreen/60 pt-4 my-auto fixed bottom-4">
                                <Link to="/farmer/profile" className="flex flex-row items-center justify-start gap-3 pt-2 px-2">
                                    <div className="flex size-11 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-br from-[#0f2d18] to-[#07150c] text-sm font-extrabold text-[#fff2a1] shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
                                        {profileInitials}
                                    </div>
                                    <p className="text-xl font-semibold text-darkgreen">Profile</p>
                                </Link>
                                <button onClick={() => { changeRole() }} className="group flex flex-row items-center justify-between gap-2 p-2 text-gold rounded-xl border-gold border cursor-pointer hover:bg-gold hover:text-darkgreen bg-darkgreen transition-all ease-in duration-100">
                                    <ArrowsRightLeftIcon className="size-8 stroke-gold group-hover:stroke-darkgreen" />
                                    <p className="flex flex-col items-center">
                                        <span>Switch to Service </span>
                                        <span>Provider</span>
                                    </p>
                                </button>
                            </div>
                        </div>}
                </div>


            {/* For small screens */}
            {!open &&
                <div className="w-full flex flex-col md:hidden sticky top-0 items-center p-4 font-montserrat z-100 text-darkgreen bg-gold">
                    <div className="flex w-full flex-row items-center justify-between">
                        <div className="logo">
                            <Link to="/"><img src="/Kisan Connect Logo 1.png" className="size-14 rounded-full" alt="Logo" /></Link>
                        </div>
                        <div>
                            <button className="p-2 cursor-pointer" onClick={() => { setOpen(true) }}><Bars3Icon className="size-10" /></button>
                        </div>
                    </div>
                </div>}
            {open &&
                <div className="w-full flex flex-col md:hidden sticky top-0 items-center p-4 font-montserrat z-100 text-darkgreen bg-gold h-dvh">
                    <div className="flex w-full flex-row items-center justify-between">
                        <div className="logo">
                            <Link to="/"><img src="/Kisan Connect Logo 1.png" className="size-14 rounded-full" alt="Logo" /></Link>
                        </div>
                        <button className="p-2 cursor-pointer" onClick={() => { setOpen(false) }}><XMarkIcon className="size-10" /></button>
                    </div>
                    <div className="flex flex-col gap-2 items-start justify-start w-full h-full pb-4">
                        {effectiveRole == "serviceprovider" ?
                            <div className="flex flex-col items-start justify-start my-2 gap-2 w-full">
                                {Menu.map((options) => (
                                    <NavLink key={options.index} to={options.path} aria-label={options.name} className={({ isActive }) => `flex flex-row items-center gap-2 w-full ${isActive ? "p-2 bg-white/40 rounded-xl" : "p-2 hover:bg-white/40 hover:rounded-xl"}`} end>
                                        <img src={options.icon} alt="" className="size-8" />
                                        <p className="font-semibold">{options.name}</p>
                                    </NavLink>
                                ))}
                                <div className="flex flex-col items-start justify-start gap-3 border-t border-darkgreen/60 pt-4 w-full">
                                    <Link to="/serviceprovider/profile" className="flex flex-row items-center justify-start gap-3 pt-2 px-2 w-full">
                                        <div className="flex size-11 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-br from-[#0f2d18] to-[#07150c] text-sm font-extrabold text-[#fff2a1] shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
                                            {profileInitials}
                                        </div>
                                        <p className="text-xl font-semibold text-darkgreen">Profile</p>
                                    </Link>
                                    <button onClick={() => { changeRole() }} className="group flex flex-row items-center justify-start gap-2 p-2 text-gold rounded-xl border-gold border cursor-pointer hover:bg-gold hover:text-darkgreen bg-darkgreen transition-all ease-in duration-100 w-full">
                                        <ArrowsRightLeftIcon className="size-8 stroke-gold group-hover:stroke-darkgreen" />
                                        <p>Switch to Farmer</p>
                                    </button>
                                </div>
                            </div> :
                            <div className="flex flex-col items-start justify-evenly my-2 gap-2 w-full">
                                {Menu.map((options) => (
                                    <NavLink key={options.index} to={options.path} aria-label={options.name} className={({ isActive }) => `flex flex-row items-center gap-2 w-full ${isActive ? "p-2 bg-white/40 rounded-xl" : "p-2 hover:bg-white/40 hover:rounded-xl"}`} end>
                                        <img src={options.icon} alt="" className="size-8 fill-darkgreen" />
                                        <p className="font-semibold">{options.name}</p>
                                    </NavLink>
                                ))}
                                <div className="flex flex-col items-start justify-center gap-3 border-t border-darkgreen/60 pt-4 w-full">
                                    <Link to="/farmer/profile" className="flex flex-row items-center justify-start gap-3 pt-2 px-2 w-full">
                                        <div className="flex size-11 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-br from-[#0f2d18] to-[#07150c] text-sm font-extrabold text-[#fff2a1] shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
                                            {profileInitials}
                                        </div>
                                        <p className="text-xl font-semibold text-darkgreen">Profile</p>
                                    </Link>
                                    <button to={"/serviceprovider"} onClick={() => { changeRole() }} className="group flex flex-row items-center justify-start gap-2 p-2 text-gold rounded-xl border-gold border cursor-pointer hover:bg-gold hover:text-darkgreen bg-darkgreen transition-all ease-in duration-100 w-full">
                                        <ArrowsRightLeftIcon className="size-8 stroke-gold group-hover:stroke-darkgreen" />
                                        <p>Switch to Service Provider</p>
                                    </button>
                                </div>
                            </div>}
                    </div>
                </div>
            }
        </>
    );
}
