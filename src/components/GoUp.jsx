import { ArrowUpIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"

export default function GoUp() {

    const [visible, setVisible] = useState(false);
    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset >= 200) {
                setVisible(true);
            }
            else {
                setVisible(false);
            }
        })
    }, [])

    return (
        <>
            {visible &&
                <button onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }} className="m-auto cursor-pointer fixed bottom-20 right-7 rounded-full p-3 bg-linear-to-r from-gold to-yellow-200 animate-bounce">
                    <ArrowUpIcon className="fill-darkgreen size-6" />
                </button>
            }
        </>
    )
}