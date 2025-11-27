export default function TransportCard() {

    return (
        <>

            <div className="rounded-xl flex flex-col md:flex-row border-2 border-gold bg-darkgreen/70 font-montserrat">
                <div className="w-full md:w-6/12">
                    <img src="/tractor.png" alt="Machine Image" className="size-52 lg:size-80 rounded-t-xl m-auto w-auto object-center" />
                </div>
                <div className="flex flex-col items-start justify-between p-4 w-full text-white bg-darkgreen rounded-b-xl">
                    <div className="flex flex-col items-start justify-be font-bold text-gold">
                        <h1 className="text-lg">Tractor</h1>
                        <p>Price: ₹50/- per km</p>
                        <div className="text-white font-normal">
                            <p className="">Owner: XYZ</p> 
                            <p className="">Capacity: X Tonnes</p> 
                            <p className="">Location: ABC</p> 
                            <p className="">Rating: 4 out of 5</p> 
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full h-fit mt-2 gap-2">
                        <button className="bg-gold hover:bg-gradient-to-r hover:from-gold hover:to-yellow-200 text-darkgreen font-bold py-2 px-2 cursor-pointer w-full text-nowrap lg:text-wrap rounded-lg">Rent now</button>
                        <button className="bg-gold hover:bg-gradient-to-r hover:from-gold hover:to-yellow-200 text-darkgreen font-bold py-2 px-2 cursor-pointer w-full text-nowrap lg:text-wrap rounded-lg">Add to cart</button>
                    </div>
                </div>
            </div>
        </>
    )
}