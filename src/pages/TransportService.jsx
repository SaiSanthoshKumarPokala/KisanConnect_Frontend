import { useState, useRef, useContext } from "react"
import NavBar from "../components/NavBar";
import SideNav from "../components/SideNav";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";
import TransportServiceCard from "../components/TransportServiceCard";
import { SidenavContext } from "../context/Contexts";
import { UseAppContext } from "../context/AppContext";
export default function RentalsService() {

const {isOpen, setIsOpen} = UseAppContext();
    const add = useRef(null);
    const [lostitem, setLostitem] = useState("");
    const [name, setName] = useState("");
    const [year, setYear] = useState("1st");
    const [dept, setDept] = useState("CSE");
    const [desc, setDesc] = useState("");
    const [whatsappNo, setWhatsappNo] = useState("");
    const [isEmpty, setisEmpty] = useState(false);

    return (
        <>
            <SideNav />
            {isEmpty ? <div className={`items-center justify-center h-dvh flex flex-col m-auto gap-6 p-10 text-center ${isOpen ? "md:ml-52" : "md:ml-16"}`}>
                <p className="font-bold text-xl text-darkgreen text-wrap">You don't provide any transport service yet. Get started by adding one.
                </p>
                <button onClick={() => { add.current.showModal() }} className="group border-2 h-80 w-45 flex flex-col items-center justify-center border-gold hover:text-gold hover:bg-darkgreen/70 text-darkgreen font-bold py-2 px-6 cursor-pointer rounded-xl">
                    <PlusCircleIcon className="size-8 text-darkgreen group-hover:text-gold" />
                    <p className="font-bold text-darkgreen group-hover:text-gold text-2xl">Add</p>
                </button>
            </div> :
                <div className={`${isOpen ? "md:ml-52" : "md:ml-16"}`}>
                    <div className={`flex flex-row flex-wrap items-center justify-center py-4 w-10/12 md:w-11/12 gap-8 m-auto`}>
                        <TransportServiceCard />
                        <TransportServiceCard />
                        <TransportServiceCard />
                        <TransportServiceCard />
                        <TransportServiceCard />
                        <button onClick={() => { add.current.showModal() }} className="flex flex-col items-center justify-center border-2 border-gold cursor-pointer hover:bg-darkgreen/70 rounded-xl h-100 w-55 lg:h-105 lg:w-60">
                            <PlusCircleIcon className="size-8 text-gold" />
                            <p className="font-bold text-gold text-2xl">Add more</p>
                        </button>
                    </div>
                </div>
            }
            <dialog ref={add} className="m-auto p-6 rounded-md bg-white/50 backdrop-blur-2xl backdrop:backdrop-blur-lg">
                <form>
                    <div className="flex flex-col gap-4 font-bold">
                        <div className="flex flex-row items-center justify-end">
                            <p>Close</p>
                            <button type="button" className="cursor-pointer" onClick={() => { add.current.close() }}>
                                <XCircleIcon className="size-8 cursor-pointer hover:rotate-90 transition-all ease-in duration-200 hover:scale-105 hover:fill-red-500 hover:stroke-white" />
                            </button>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <label htmlFor="Name">Name: </label>
                            <input type="text" name="Name" id="Name" value={name} onChange={(e) => setName(e.target.value)} className="border-b-2 focus:outline-none border-b-black" />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <label htmlFor="Year">Year: </label>
                            <select name="Year" id="Year" className="focus:outline-none" value={year} onChange={(e) => setYear(e.target.value)}>
                                <option value="1st">1st</option>
                                <option value="2nd">2nd</option>
                                <option value="3rd">3rd</option>
                                <option value="4th">4th</option>
                            </select>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <label htmlFor="Department">Department: </label>
                            <select name="Department" id="Department" className="focus:outline-none" value={dept} onChange={(e) => setDept(e.target.value)}>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="MECH">MECH</option>
                            </select>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <label htmlFor="Whatsapp">Whatsapp Number: </label>
                            <input type="text" name="Whatsapp" id="Whatsapp" value={whatsappNo} onChange={(e) => setWhatsappNo(e.target.value)} className="focus:outline-none border-b-2 border-b-black" />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <label htmlFor="LostItem">Lost Item: </label>
                            <input type="text" name="LostItem" id="LostItem" value={lostitem} onChange={(e) => setLostitem(e.target.value)} className="focus:outline-none border-b-2 border-b-black" />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <label htmlFor="Description">Description: </label>
                            <input type="text" name="Description" id="Description" value={desc} onChange={(e) => setDesc(e.target.value)} className="focus:outline-none border-b-2 border-b-black" />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <label htmlFor="Photo">Photo: </label>
                            <input type="file" name="Photo" id="Photo" accept="image/*" className="focus:outline-none file:border-2 file:p-1 file:bg-gray-300 hover:file:bg-gray-400 file:cursor-pointer file:rounded-md" onChange={(e) => fileChange(e)} />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="p-2 px-4 rounded-r-full rounded-l-full rounded-md border-2 transition-colors ease-in duration-200 hover:bg-green-600 hover:text-white cursor-pointer border-black" onClick={() => { }}>Confirm</button>
                        </div>
                    </div>
                </form>
            </dialog>
        </>
    )
}