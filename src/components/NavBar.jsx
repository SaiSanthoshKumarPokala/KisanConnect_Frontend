import { useState } from "react"
import { NavLink, Link } from "react-router"
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { UseAppContext } from "../context/AppContext";

export default function NavBar() {


    const { role, navigate, token, logout } = UseAppContext();
    const [open, setOpen] = useState(false);
    return (
        <>
            {/* For medium and large screens */}
            <nav className="hidden md:flex items-center justify-evenly p-4 bg-darkgreen backdrop-blur-xl font-montserrat z-10 border-b border-white/50">
                <div className="logo">
                    <Link to="/"><img src="/Kisan Connect Logo 1.png" className="size-18 rounded-full" alt="Logo" /></Link>
                </div>
                <div className="flex gap-6">
                    <NavLink to="/" className={({ isActive }) => `mx-2 text-white text-shadow-sm text-shadow-black/30 hover:text-gold hover:underline hover:underline-offset-8 font-bold ${isActive ? "p-2 underline underline-offset-8 " : "p-2 hover:underline hover:underline-offset-4"}`}>Home</NavLink>
                    <NavLink to="/about" className={({ isActive }) => `mx-2 text-white text-shadow-sm text-shadow-black/30 hover:text-gold hover:underline hover:underline-offset-8 font-bold ${isActive ? "p-2 underline underline-offset-8 " : "p-2 hover:underline hover:underline-offset-4"}`}>About</NavLink>
                    <NavLink to="/services" className={({ isActive }) => `mx-2 text-white text-shadow-sm text-shadow-black/30 hover:text-gold hover:underline hover:underline-offset-8 font-bold ${isActive ? "p-2 underline underline-offset-8 " : "p-2 hover:underline hover:underline-offset-4"}`}>Services</NavLink>
                    <NavLink to="/programs" className={({ isActive }) => `mx-2 text-white text-shadow-sm text-shadow-black/30 hover:text-gold hover:underline hover:underline-offset-8 font-bold ${isActive ? "p-2 underline underline-offset-8 " : "p-2 hover:underline hover:underline-offset-4"}`}>Programs</NavLink>
                    <NavLink to="/faqs" className={({ isActive }) => `mx-2 text-white text-shadow-sm text-shadow-black/30 hover:text-gold hover:underline hover:underline-offset-8 font-bold ${isActive ? "p-2 underline underline-offset-8 " : "p-2 hover:underline hover:underline-offset-4"}`}>Faqs</NavLink>
                </div>
                <div className="auth flex items-center gap-2 font-semibold">
                    {token ?
                        <div className="flex flex-row gap-2">
                            <button onClick={() => { navigate(`/${role}`) }} className="px-5 py-1.5 text-white text-xl rounded-xl border-gold border hover:cursor-pointer hover:bg-gold hover:text-darkgreen bg-darkgreen transition-all ease-in duration-100">Dashboard</button>
                            <button onClick={() => { logout() }} className="px-5 py-1.5 text-white text-xl rounded-xl border-gold border hover:cursor-pointer hover:bg-gold hover:text-darkgreen bg-darkgreen transition-all ease-in duration-100">Logout</button>
                        </div>
                        :
                        <Link to="/auth" className="px-5 py-1.5 text-white text-xl rounded-xl border-gold border hover:cursor-pointer hover:bg-gold hover:text-darkgreen bg-darkgreen transition-all ease-in duration-100">Login</Link>}
                </div>
            </nav>

            {/* For small screens */}
            <nav className="w-full flex flex-col md:hidden items-center p-4 font-montserrat z-100 bg-darkgreen text-gold border-b border-white/30">
                <div className="flex w-full flex-row items-center justify-between">
                    <div className="logo">
                        <Link to="/"><img src="/Kisan Connect Logo 1.png" className="size-18 rounded-full" alt="Logo" /></Link>
                    </div>
                    {!open && <div>
                        <button className="p-2 cursor-pointer active:transition-all active:ease-in active:duration-500" onClick={() => { setOpen(true) }}><Bars3Icon className="size-10" aria-label="Menu" /></button>
                    </div>}
                    {open &&
                        <button className="p-2 cursor-pointer transition-all ease-in duration-500" onClick={() => { setOpen(false) }}><XMarkIcon className="size-10" /></button>
                    }
                </div>
                {open &&
                    <div className="flex flex-col gap-4 items-start justify-center w-full h-full relative py-4 translate-x-0 transition-all duration-300">
                        <NavLink to="/" className={({ isActive }) => `px-2 text-shadow-sm text-shadow-black/30 ${isActive ? "underline underline-offset-4" : "px-2 hover:underline hover:underline-offset-4"}`}>Home</NavLink>
                        <NavLink to="/about" className={({ isActive }) => `px-2 text-shadow-sm text-shadow-black/30 ${isActive ? "underline underline-offset-4" : "px-2 hover:underline hover:underline-offset-4"}`}>About</NavLink>
                        <NavLink to="/services" className={({ isActive }) => `px-2 text-shadow-sm text-shadow-black/30 ${isActive ? "underline underline-offset-4" : "px-2 hover:underline hover:underline-offset-4"}`}>Services</NavLink>
                        <NavLink to="/programs" className={({ isActive }) => `px-2 text-shadow-sm text-shadow-black/30 ${isActive ? "underline underline-offset-4" : "px-2 hover:underline hover:underline-offset-4"}`}>Programs</NavLink>
                        <NavLink to="/faqs" className={({ isActive }) => `px-2 text-shadow-sm text-shadow-black/30 ${isActive ? "underline underline-offset-4" : "px-2 hover:underline hover:underline-offset-4"}`}>Faqs</NavLink>
                        {token ?
                            <button onClick={() => { navigate(`/${role}`) }} className="mx-2 underline underline-offset-4 text-shadow-sm text-shadow-black/30">Dashboard</button>
                            :
                            <Link to="/auth" className="mx-2 underline underline-offset-4 text-shadow-sm text-shadow-black/30">Login</Link>}
                    </div>}
            </nav>

        </>
    )
}
