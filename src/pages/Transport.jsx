import { useContext, useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import SideNav from "../components/SideNav";
import TransportCard from "../components/TransportCard";
import { FunnelIcon, MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { SidenavContext } from "../context/Contexts";
import { UseAppContext } from "../context/AppContext";
export default function Transport() {

    const [showfilters, setShowfilters] = useState(true);
const {isOpen, setIsOpen} = UseAppContext();


    return (
        <>
            <button className="flex md:hidden flex-row gap-1 cursor-pointer items-center bg-linear-to-br from-gold to-yellow-200 border border-black p-2 rounded-full bottom-2 left-2 fixed" onClick={() => setShowfilters(!showfilters)}>
                <FunnelIcon className="stroke-2 size-6 stroke-darkgreen fill-darkgreen" />
                <p>Filters</p>
            </button>
            <SideNav />
            <div className={`flex flex-col ${isOpen ? "md:ml-52" : "md:ml-16"}`}>
                {showfilters &&
                    <div className="filters md:sticky md:top-0 w-full h-fit m-auto bg-linear-to-r from-gold to-yellow-200 border-b border-darkgreen">
                        <div className="flex flex-row flex-wrap w-10/12 h-fit m-auto rounded-md items-center my-4 gap-2 justify-center">
                            <div className="flex flex-row gap-1 items-center bg-white border border-black p-2 rounded-full w-auto">
                                <MagnifyingGlassIcon className="size-6 stroke-2 stroke-gold" />
                                <input type="search" name="search" id="search" placeholder="Search" className="focus:outline-0 w-auto font-normal text-black" />
                            </div>
                            <div className="flex flex-row gap-1 items-center bg-white border border-black w-auto p-2 rounded-full">
                                <MapPinIcon className="size-6 stroke-2 stroke-gold" />
                                <select name="state" id="state" className="focus:outline-0 w-full font-normal text-black">
                                    <option value="select">State</option>
                                    <option value="telangana">Telangana</option>
                                    <option value="andhra pradesh">Andhra Pradesh</option>
                                    <option value="maharashtra">Maharashtra</option>
                                    <option value="karnataka">Karnataka</option>
                                    <option value="kerala">Kerala</option>
                                </select>
                            </div>
                        </div>

                    </div>}
                <div className="flex flex-col gap-4 w-11/12 md:w-10/12 lg:w-8/12 my-4 m-auto">
                    <TransportCard />
                    <TransportCard />
                    <TransportCard />
                    <TransportCard />
                    <TransportCard />
                    <TransportCard />
                    <TransportCard />
                </div>
            </div>
        </>
    )
}