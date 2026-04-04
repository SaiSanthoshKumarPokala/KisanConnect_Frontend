import { XMarkIcon, Bars3Icon, UserCircleIcon, ArrowsRightLeftIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline"
// import { TruckIcon, SparklesIcon, BuildingStorefrontIcon, CircleStackIcon, ShoppingBagIcon, DocumentTextIcon, Squares2X2Icon } from "@heroicons/react/24/solid";
import Dashboard from "/dashboard.svg"
import Truck from "/trucks.svg"
import Shopping from "/shops.svg"
import Sparkles from "/sparkles.svg"
import Document from "/document.svg"
import Building from "/coldstorages.svg"
import { useState, useRef, useContext, useEffect } from "react"
import { NavLink, Link, useLocation } from "react-router"
import { UseAppContext } from "../context/AppContext"


export default function SideNav() {

    const { logout, role, axios, setRole, user, navigate, isOpen, setIsOpen } = UseAppContext();

    // console.log(role);
    const changeRole = async () => {
        try {
            if (role == "farmer") {
                const { data } = await axios.post(`/api/farmer/changerole`);
                if (data.success) {
                    setRole("serviceprovider");
                    localStorage.setItem('role', "serviceprovider");
                    alert(data.message);
                    navigate('/serviceprovider');
                } else {
                    alert(data.message);
                }
            } else if (role == "serviceprovider") {
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
            window.alert(error.message);
        }
    }

    const Menu = [
        { path: `/${role}/`, icon: Dashboard, name: "Dashboard", index: 1 },
        { path: `/${role}/rentals`, icon: Truck, name: "Rentals", index: 2 },
        { path: `/${role}/shop`, icon: Shopping, name: "Shop", index: 3 },
        { path: `/${role}/transport`, icon: Truck, name: "Transport", index: 4 },
        { path: `/${role}/contractfarming`, icon: Document, name: "Contract Farming", index: 5 },
        { path: `/${role}/coldstorage`, icon: Building, name: "Cold Storage", index: 6 },
        { path: `/${role}/aitoolkit`, icon: Sparkles, name: "AI Tool Kit", index: 7 }
    ]

    // const ServideProviderMenu = [
    //     { path: "/serviceprovider", icon: Dashboard, name: "Dashboard", index: 1 },
    //     { path: "/serviceprovider/rentals", icon: Truck, name: "Rentals", index: 2 },
    //     { path: "/serviceprovider/shop", icon: Shopping, name: "Shop", index: 3 },
    //     { path: "/serviceprovider/transport", icon: Truck, name: "Transport", index: 4 },
    //     { path: "/serviceprovider/contractfarming", icon: Document, name: "Contract Farming", index: 5 },
    //     { path: "/serviceprovider/coldstorage", icon: Building, name: "Cold Storage", index: 6 },
    //     { path: "/serviceprovider/aitoolkit", icon: Sparkles, name: "AI Tool Kit", index: 7 }
    // ]

    const [open, setOpen] = useState(false);


    return (
        <>
            {/* For medium and large screens */}
            {!isOpen &&
                <div className="hidden md:flex md:flex-col items-center w-fit h-dvh fixed p-4 bg-linear-to-b from-gold to-yellow-200 border-r border-darkgreen text-white font-bold z-10">
                    <Bars3Icon onClick={() => { setIsOpen(!isOpen) }} className="size-8 absolute -right-4 top-2 p-1 bg-darkgreen/80 rounded-full stroke-white stroke-2 cursor-pointer" />
                    {role == "serviceprovider" ?
                        <div className="flex flex-col items-center justify-evenly my-4 gap-2 text-darkgreen">
                            <Link to="/"><img src="/Kisan Connect Logo 1.png" className="size-12 rounded-full cursor-pointer border-b border-darkgreen" alt="Logo" /></Link>
                            {Menu.map((options) => (
                                <NavLink key={options.index} to={options.path} aria-label={options.name} className={({ isActive }) => `${isActive ? "p-2 bg-darkgreen/40 rounded-xl" : "p-2 hover:bg-darkgreen/40 hover:rounded-xl"}`} end>
                                    <img src={options.icon} alt="" className="size-8 fill-darkgreen" />
                                </NavLink>
                            ))}
                            <div className="flex flex-col items-center justify-center gap-2 border-t border-darkgreen m-auto">
                                <Link className="hover:rounded-xl cursor-pointer p-2 m-auto">
                                    <UserCircleIcon className="size-10" />
                                </Link>
                                <button onClick={() => { logout() }} className="group p-2 hover:bg-red-400 rounded-xl m-auto cursor-pointer"><ArrowLeftEndOnRectangleIcon className="size-8 stroke-red-600 group-hover:stroke-white" /></button>
                                <button onClick={() => { changeRole() }} className="group text-center gap-2 p-2 rounded-xl hover:cursor-pointer hover:bg-darkgreen transition-all ease-in duration-100 m-auto"><ArrowsRightLeftIcon className="size-8 stroke-darkgreen group-hover:stroke-gold" /></button>
                                {/* <Link to={"/farmer"} onClick={()=>{changeRole()}} className="group text-center gap-2 p-2 rounded-xl hover:cursor-pointer hover:bg-darkgreen transition-all ease-in duration-100 m-auto"><ArrowsRightLeftIcon className="size-8 stroke-darkgreen group-hover:stroke-gold" /></Link> */}
                            </div>
                        </div>
                        :
                        <div className="flex flex-col items-center justify-evenly my-4 gap-2 text-darkgreen">
                            <Link to="/"><img src="/Kisan Connect Logo 1.png" className="size-12 rounded-full cursor-pointer border-b border-darkgreen" alt="Logo" /></Link>
                            {Menu.map((options) => (
                                <NavLink key={options.index} to={options.path} aria-label={options.name} className={({ isActive }) => `${isActive ? "p-2 bg-darkgreen/40 rounded-xl" : "p-2 hover:bg-darkgreen/40 hover:rounded-xl"}`} end>
                                    <img src={options.icon} alt="" className="size-8 fill-darkgreen" />
                                </NavLink>
                            ))}
                            <div className="flex flex-col items-center justify-center gap-2 border-t border-darkgreen m-auto">
                                <Link className="hover:rounded-xl cursor-pointer p-2 m-auto">
                                    <UserCircleIcon className="size-10" />
                                </Link>
                                <button onClick={() => { logout() }} className="group p-2 hover:bg-red-400 rounded-xl m-auto cursor-pointer"><ArrowLeftEndOnRectangleIcon className="size-8 stroke-red-600 group-hover:stroke-white" /></button>
                                <button to={"/serviceprovider"} onClick={() => { changeRole() }} className="group text-center gap-2 p-2 rounded-xl hover:cursor-pointer hover:bg-darkgreen transition-all ease-in duration-100 m-auto"><ArrowsRightLeftIcon className="size-8 stroke-darkgreen group-hover:stroke-gold" /></button>
                            </div>
                        </div>
                    }
                </div>}
            {isOpen &&
                <div className="hidden md:flex md:flex-col w-fit h-dvh fixed p-6 bg-linear-to-b from-gold to-yellow-200 border-r border-darkgreen text-white font-bold z-10">
                    <div className="flex flex-row justify-between items-center">
                        <Link to="/" className="flex flex-row items-center gap-2">
                            <img src="/Kisan Connect Logo 1.png" className="size-16 rounded-full" alt="Logo" />
                            <div className="flex flex-col items-start justify-center text-xl">
                                <p className="font-bold text-darkgreen">KISAN</p>
                                <p className="font-bold text-darkgreen">CONNECT</p>
                            </div>
                        </Link>
                        <Bars3Icon onClick={() => { setIsOpen(!isOpen) }} className="size-8 relative -right-10 p-1 bg-darkgreen/80 rounded-full stroke-white cursor-pointer" />
                    </div>
                    {role == "serviceprovider" ?
                        <div className="flex flex-col items-start justify-evenly my-4 gap-2 text-darkgreen">
                            {Menu.map((options) => (
                                <NavLink key={options.index} to={options.path} aria-label={options.name} className={({ isActive }) => `flex flex-row items-center gap-2 w-full ${isActive ? "p-2 bg-darkgreen/40 rounded-xl" : "p-2 hover:bg-darkgreen/40 hover:rounded-xl"}`} end>
                                    <img src={options.icon} alt="" className="size-8" />
                                    <p className="font-semibold">{options.name}</p>
                                </NavLink>
                            ))}
                            <div className="flex flex-col items-start justify-center gap-2 border-t border-darkgreen my-auto fixed bottom-4">
                                <Link className="flex flex-row items-center justify-between pt-2 pl-2 gap-2">
                                    <UserCircleIcon className="size-10" />
                                    <p className="text-xl text-darkgreen">Username</p>
                                </Link>
                                <button onClick={() => { logout() }} className="group flex flex-row items-center justify-start gap-2 p-2 hover:bg-red-300 rounded-xl cursor-pointer w-full">
                                    <ArrowLeftEndOnRectangleIcon className="size-8 stroke-red-600" />
                                    <p className="text-red-600">Logout</p>
                                </button>
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
                            <div className="flex flex-col items-start justify-center gap-2 border-t border-darkgreen my-auto fixed bottom-4">
                                <Link className="flex flex-row items-center justify-between gap-2 pt-2 pl-2">
                                    <UserCircleIcon className="size-10" />
                                    <p className="text-xl text-darkgreen">Username</p>
                                </Link>
                                <button onClick={() => { logout() }} className="group flex flex-row items-center justify-start gap-2 p-2 hover:bg-red-300 rounded-xl cursor-pointer w-full">
                                    <ArrowLeftEndOnRectangleIcon className="size-8 stroke-red-600" />
                                    <p className="text-red-600">Logout</p>
                                </button>
                                <button onClick={() => { changeRole() }} className="group flex flex-row items-center justify-between gap-2 p-2 text-gold rounded-xl border-gold border cursor-pointer hover:bg-gold hover:text-darkgreen bg-darkgreen transition-all ease-in duration-100">
                                    <ArrowsRightLeftIcon className="size-8 stroke-gold group-hover:stroke-darkgreen" />
                                    <p className="flex flex-col items-center">
                                        <span>Switch to Service </span>
                                        <span>Provider</span>
                                    </p>
                                </button>
                            </div>
                        </div>}
                </div>}


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
                        {role == "serviceprovider" ?
                            <div className="flex flex-col items-start justify-start my-2 gap-2 w-full">
                                {Menu.map((options) => (
                                    <NavLink key={options.index} to={options.path} aria-label={options.name} className={({ isActive }) => `flex flex-row items-center gap-2 w-full ${isActive ? "p-2 bg-white/40 rounded-xl" : "p-2 hover:bg-white/40 hover:rounded-xl"}`} end>
                                        <img src={options.icon} alt="" className="size-8" />
                                        <p className="font-semibold">{options.name}</p>
                                    </NavLink>
                                ))}
                                <div className="flex flex-col items-start justify-start gap-2 border-t border-darkgreen w-full">
                                    <Link className="flex flex-row items-center justify-start pt-2 gap-2 w-full">
                                        <UserCircleIcon className="size-10" />
                                        <p className="text-xl text-darkgreen">Username</p>
                                    </Link>
                                    <button onClick={() => { logout() }} className="group flex flex-row items-center justify-start gap-2 p-2 bg-red-300 rounded-xl cursor-pointer w-full">
                                        <ArrowLeftEndOnRectangleIcon className="size-8 stroke-red-600" />
                                        <p className="text-red-600">Logout</p>
                                    </button>
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
                                <div className="flex flex-col items-start justify-center gap-2 border-t border-darkgreen w-full">
                                    <Link className="flex flex-row items-center justify-start gap-2 pt-2 w-full">
                                        <UserCircleIcon className="size-10" />
                                        <p className="text-xl text-darkgreen">Username</p>
                                    </Link>
                                    <button onClick={() => { logout() }} className="group flex flex-row items-center justify-start gap-2 p-2 bg-red-300 rounded-xl cursor-pointer w-full">
                                        <ArrowLeftEndOnRectangleIcon className="size-8 stroke-red-600" />
                                        <p className="text-red-600">Logout</p>
                                    </button>
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
    )
}