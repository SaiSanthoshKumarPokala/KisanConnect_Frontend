import { useRef, useState } from "react";
import { XCircleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function RentalsServiceCard(){

    const edit = useRef(null);
    const [lostitem, setLostitem] = useState("");
    const [name, setName] = useState("");
    const [year, setYear] = useState("1st");
    const [dept, setDept] = useState("CSE");
    const [desc, setDesc] = useState("");
    const [whatsappNo, setWhatsappNo] = useState("");

    return (
        <>
            <div className="rounded-xl font-montserrat flex flex-col border-2 border-gold bg-darkgreen/70 min-w-72 max-w-80">
                <img src="/harvester.png" alt="Machine Image" className="size-56 lg:size-60 rounded-t-xl m-auto object-center" />
                <div className="flex flex-col items-start justify-evenly p-4 text-white bg-darkgreen rounded-b-xl">
                    <div className="flex flex-col items-start justify-evenly font-bold text-gold">
                        <h1 className="text-lg">Harvester</h1>
                        <p>Price: ₹2600/- per day</p>
                        <div className="text-white font-normal flex flex-col">
                            <p className="">Status: Idle</p>
                            <p>Rating: 4 out of 5</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full m-auto mt-2 gap-2">
                        <button className="flex flex-row items-center gap-2 bg-gold hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 text-darkgreen font-bold py-2 px-2 cursor-pointer w-full text-nowrap lg:text-wrap rounded-lg" onClick={()=>{ edit.current.showModal()}}><PencilIcon className="size-6"/> Edit</button>
                        <button className="flex flex-row items-center gap-2 bg-red-500 hover:bg-linear-to-r hover:from-red-600 hover:to-red-400 text-white font-bold py-2 px-2 cursor-pointer w-full text-nowrap lg:text-wrap rounded-lg"><TrashIcon className="size-6"/> Remove</button>
                    </div>
                </div>
            </div>
            <dialog ref={edit} className="m-auto p-6 rounded-md bg-white/50 backdrop-blur-2xl backdrop:backdrop-blur-lg">
                <form>
                    <div className="flex flex-col gap-4 font-bold">
                        <div className="flex flex-row items-center justify-end">
                            <p>Close</p>
                            <button type="button" className="cursor-pointer" onClick={() => { edit.current.close() }}>
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
                            <button type="submit" className="p-2 px-4 rounded-r-full rounded-l-full rounded-md border-2 transition-colors ease-in duration-200 hover:bg-green-600 hover:text-white cursor-pointer border-black" onClick={()=>{}}>Update</button>
                        </div>
                    </div>
                </form>
            </dialog>
        </>
    )
}