import { ChevronLeftIcon, ChevronRightIcon, XCircleIcon } from "@heroicons/react/24/outline"
import { useState, useRef } from "react"
import { NavLink, Link } from "react-router"

export default function SideNav() {


    const [isOpen, setIsOpen] = useState(false);
    const dial = useRef(null);

    return (
        <>
            <div className="font-montserrat group p-2 rounded-tr-2xl rounded-br-2xl bg-gradient-to-bl from-gold to-yellow-200 relative top-2 text-white font-bold left-0 flex flex-row items-center w-fit cursor-pointer"
                onClick={() => { dial.current.show(); setIsOpen(true) }} >
                <p className="text-darkgreen">Dashboard</p>
                <ChevronRightIcon className="size-8 p-2 rounded-tr-2xl rounded-br-2xl fill-darkgreen stroke-2 stroke-darkgreen group-hover:stroke-white group-hover:fill-white group-hover:translate-x-2 transition-all ease-in duration-300" />
            </div>
            <dialog ref={dial} closedby="any" className="w-fit h-dvh absolute p-6 bg-gradient-to-br from-gold to-yellow-200 left-0 -top-0 rounded-r-xl text-white font-bold z-10">
                <div className="flex flex-row justify-between items-center gap-8">
                    <Link to="/dashboard" className="text-2xl hover:underline hover:underline-offset-2">Dashboard</Link>
                    <XCircleIcon className="size-8 cursor-pointer hover:rotate-90 hover:fill-darkgreen transition-all ease-in duration-300" onClick={() => { dial.current.close(); setIsOpen(false) }} />
                </div>
                <div className="flex flex-col items-start justify-evenly my-4 gap-4 text-darkgreen">
                    <Link to="/aitoolkit" className="mx-2 hover:underline hover:underline-offset-4">AI Toolkit</Link>
                    <Link to="/rentals" className="mx-2 hover:underline hover:underline-offset-4">Rentals</Link>
                    <Link to="/shop" className="mx-2 hover:underline hover:underline-offset-4">Shop</Link>
                    <Link to="/transport" className="mx-2 hover:underline hover:underline-offset-4">Transport</Link>
                    <Link to="/coldstorage" className="mx-2 hover:underline hover:underline-offset-4">Cold Storage</Link>
                    <Link to="/contractfarming" className="mx-2 hover:underline hover:underline-offset-4">Contract Farming</Link>
                </div>
            </dialog>
        </>
    )
}