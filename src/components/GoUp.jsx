import { ArrowUpIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"

export default function GoUp() {

    const [scrolled, setScrolled] = useState(false);
    // window.onscroll(setScrolled(true));
    document.onscroll(setScrolled(true))

    return (
        <>
            {scrolled && <button onClick={() => { window.scrollTo(0, 0) }} className="m-auto cursor-pointer items-center flex sticky bottom-4 rounded-full p-2 bg-gold"><ArrowUpIcon className="fill-white size-8" /></button>}
            {!scrolled && <button onClick={() => { window.scrollTo(0, 0) }} className="hidden cursor-pointer m-auto items-center sticky bottom-4 rounded-full p-2 bg-gold"><ArrowUpIcon className="fill-white size-8" /></button>}
        </>
    )
}