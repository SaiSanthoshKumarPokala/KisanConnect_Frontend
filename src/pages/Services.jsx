import Footer from "../components/Footer";
import GoUp from "../components/GoUp";
import NavBar from "../components/NavBar";
import SideNav from "../components/SideNav";

export default function Services() {


    return (
        <>
            <div className="bg-darkgreen text-white font-montserrat">
                <NavBar />
                <SideNav />
                <div className="grid grid-rows-4">
                    <div className="grid grid-cols-[80vw] md:grid-cols-[40vw_40vw] m-auto justify-items-center py-4 border-b-2 border-gold content-center">
                        <div className="flex flex-col items-center m-auto">
                            <h1 className="font-extrabold text-3xl text-center">Contract Farming</h1>
                            <p>This is contract farming.</p>
                        </div>
                        <img src="Contractfarming.png" alt="" className="object-center w-72 md:w-96 h-auto m-auto" />
                    </div>
                    <div className="grid grid-cols-[80vw] md:grid-cols-[40vw_40vw] m-auto justify-items-center py-4 border-b-2 border-gold content-center">
                        <img src="harvester.png" alt="" className="object-center w-72 md:w-96 h-auto m-auto" />
                        <div className="flex flex-col items-center m-auto">
                            <h1 className="font-extrabold text-3xl text-center">Rentals</h1>
                            <p>This is contract farming.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-[80vw] md:grid-cols-[40vw_40vw] m-auto justify-items-center py-4 border-b-2 border-gold content-center">
                        <div className="flex flex-col items-center m-auto">
                            <h1 className="font-extrabold text-3xl text-center">Transport</h1>
                            <p>This is contract farming.</p>
                        </div>
                        <img src="DCM.png" alt="" className="object-center w-72 md:w-96 h-auto m-auto" />
                    </div>
                    <div className="grid grid-cols-[80vw] md:grid-cols-[40vw_40vw] m-auto justify-items-center py-4">
                        <img src="fertilizers.png" alt="" className="object-center w-72 md:w-96 h-auto m-auto" />
                        <div className="flex flex-col items-center m-auto">
                            <h1 className="font-extrabold text-3xl text-center">Fertilizers</h1>
                            <p>This is contract farming.</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}