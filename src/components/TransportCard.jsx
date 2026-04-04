import { UserIcon } from "@heroicons/react/24/solid"
import Rating from "./Rating"

export default function TransportCard() {

    return (
        <>

            <div className="rounded-xl flex md:flex-row border-2 border-gold bg-darkgreen/70 font-montserrat">
                <div className="w-6/12 md:w-6/12">
                    {/* <img src="/DCM.png" alt="Machine Image" className="size-52 lg:size-80 rounded-t-xl m-auto w-auto object-contain" /> */}
                    <UserIcon className="size-full" />
                </div>
                <div className="flex flex-col items-start justify-between p-4 w-full text-white bg-darkgreen rounded-b-xl">
                    <div className="flex flex-col items-start justify-be font-bold text-gold">
                        <h1 className="text-lg">Truck</h1>
                        <p>Price: ₹350/- per km</p>
                        <div className="text-white font-normal">
                            <p className="">Owner: Ravi</p>
                            <p className="">Capacity: 8 Tonnes</p>
                            <p className="">Location: Hyderabad</p>
                            <Rating average={4.3} href={'#'} totalCount={10} />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full h-fit mt-2 gap-2">
                        <button className="bg-gold hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 text-darkgreen font-bold py-2 px-2 cursor-pointer w-full text-nowrap lg:text-wrap rounded-lg">Book now</button>
                        <button className="bg-gold hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 text-darkgreen font-bold py-2 px-2 cursor-pointer w-full text-nowrap lg:text-wrap rounded-lg">Add to cart</button>
                    </div>
                </div>
            </div>
        </>
    )
}