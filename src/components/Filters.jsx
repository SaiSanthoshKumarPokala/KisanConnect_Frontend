import { useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Filters() {

    const dialref = useRef(null);
    return (
        <>
            <button className="rounded-full bg-gold text-darkgreen px-4 py-2 m-auto" onClick={()=>{dialref.current.showModal()}}>Open</button>
            <dialog ref={dialref} className="m-auto p-6 rounded-md bg-white/50 backdrop-blur-lg backdrop:backdrop-blur-lg">
                <div className="flex flex-col gap-4">
                            <button type="button" className="cursor-pointer flex items-center justify-end" onClick={() => { dialref.current.close() }}>
                                <XMarkIcon className="size-8 cursor-pointer stroke-darkgreen" />
                            </button>                    <div>

                    </div>
                    <div className="flex flex-row items-center justify-end gap-4">
                        <button className="rounded-full bg-gold text-darkgreen px-4 py-2">Apply</button>
                        <button className="rounded-full bg-darkgreen text-gold px-4 py-2" onClick={()=>{dialref.current.close()}}>Cancel</button>
                    </div>
                </div>
            </dialog>
        </>
    )
}