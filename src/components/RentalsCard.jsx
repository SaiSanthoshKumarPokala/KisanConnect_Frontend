export default function RentalsCard() {

    return (
        <>
            <div className="rounded-xl font-montserrat flex flex-col border-2 border-gold bg-darkgreen/70">
                <img src="/harvester.png" alt="Machine Image" className="size-56 lg:size-60 rounded-t-xl m-auto object-center" />
                <div className="flex flex-col items-start justify-evenly p-4 text-white bg-darkgreen rounded-b-xl">
                    <div className="flex flex-col items-start justify-evenly font-bold text-gold">
                        <h1 className="text-lg">Harvester</h1>
                        <p>Price: ₹2600/- per day</p>
                        <div className="text-white font-normal flex flex-col">
                            <p className="">Owner: XYZ</p>
                            <p>Rating: 4 out of 5</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full m-auto mt-2 gap-2">
                        <button className="bg-gold hover:bg-gradient-to-r hover:from-gold hover:to-yellow-200 text-darkgreen font-bold py-2 px-2 cursor-pointer w-full text-nowrap lg:text-wrap rounded-lg">Rent now</button>
                        <button className="bg-gold hover:bg-gradient-to-r hover:from-gold hover:to-yellow-200 text-darkgreen font-bold py-2 px-2 cursor-pointer w-full text-nowrap lg:text-wrap rounded-lg">Add to cart</button>
                    </div>
                </div>
            </div>
        </>
    )
}