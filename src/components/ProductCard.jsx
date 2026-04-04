import { UserCircleIcon } from "@heroicons/react/24/solid"

export default function ProductCard(props) {

    return (
        <>
            <div className="rounded-xl font-montserrat flex flex-col border-2 border-gold">
                <div className="bg-darkgreen/70 rounded-t-xl">
                    <img src="/urea.png" alt="Product Image" className="size-52 lg:size-72 rounded-t-xl m-auto" />
                </div>
                <div className="flex flex-col items-start justify-evenly p-4 text-white bg-darkgreen rounded-b-xl">
                    <div className="flex flex-row items-center w-full justify-between font-bold text-gold">
                        <h1 className="text-lg">{props.name}</h1>
                        <p>Price - ₹{props.price} /-</p>
                    </div>
                    {/* <p className="">Seller - {props.seller}</p> */}
                    <p className="">Rating - {props.rating}</p>
                    <div className="flex gap-1 flex-row items-center">
                        <UserCircleIcon className="size-10" />
                        <p>Sold by Shop Name</p>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full m-auto mt-2 gap-2">
                        <button className="bg-gold hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 text-darkgreen font-bold py-2 px-2 cursor-pointer w-full text-nowrap lg:text-wrap rounded-lg">Buy now</button>
                        <button className="bg-gold hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 text-darkgreen font-bold py-2 px-2 cursor-pointer w-full text-nowrap lg:text-wrap rounded-lg">Add to cart</button>
                    </div>
                </div>
            </div>
        </>
    )
}