import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

export default function Services() {


    return (
        <>
            <div className="bg-darkgreen text-white font-montserrat">
                <NavBar />
                <div className="flex flex-col m-auto lg:text-lg md:w-10/12 gap-4 py-4">
                    <div className="flex flex-col items-center m-auto p-4 lg:p-6 rounded-xl bg-black border-gold border-2">
                        <h1 className="font-extrabold text-3xl text-center text-gold my-2">Contract Farming</h1>
                        <div className="grid grid-cols-[80vw] md:grid-cols-[30vw_40vw] m-auto justify-items-center py-4 content-center">
                            <img src="Contractfarming.png" alt="" className="object-center w-72 md:w-96 h-auto m-auto" />
                            <ul className="list-disc list-outside w-9/12">
                                <li>Connecting farmers and companies for mutual growth.</li>
                                <li>Through our contract farming service, farmers can partner directly with agricultural companies to cultivate crops with assured buy-back agreements.</li>
                                <li>We help streamline contracts, provide clarity on pricing and standards, and support farmers throughout the season. This ensures guaranteed markets, reduced risk, and improved income stability.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col items-center m-auto p-4 lg:p-6 rounded-xl bg-black border-gold border-2">
                        <h1 className="font-extrabold text-3xl text-center text-gold my-2">Rentals</h1>
                        <div className="grid grid-cols-[80vw] md:grid-cols-[40vw_30vw] m-auto justify-items-center py-4 content-center">
                            <img src="harvester.png" alt="" className="block md:hidden object-center w-72 md:w-96 h-auto m-auto" />
                            <ul className="list-disc list-outside w-9/12">
                                <li>Empower your farming with easy access to modern equipment.</li>
                                <li>Our machinery rental service allows farmers to book high-quality agricultural tools and machines—such as tractors, harvesters, tillers, and sprayers—whenever they need them.</li>
                                <li>No upfront investment, no maintenance worries. Just reliable machines delivered on time to help you improve productivity and reduce costs.</li>
                            </ul>
                            <img src="harvester.png" alt="" className="hidden md:block object-center w-72 md:w-96 h-auto m-auto" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center m-auto p-4 lg:p-6 rounded-xl bg-black border-gold border-2">
                        <h1 className="font-extrabold text-3xl text-center text-gold my-2">Transport</h1>
                        <div className="grid grid-cols-[80vw] md:grid-cols-[30vw_40vw] m-auto justify-items-center py-4 content-center">
                            <img src="DCM.png" alt="" className="object-center w-72 md:w-96 h-auto m-auto" />
                            <ul className="list-disc list-outside w-9/12">
                                <li>Move your produce, materials, or machinery with ease.</li>
                                <li>We provide dependable transportation services tailored for agricultural needs—whether it's delivering goods to markets, moving equipment between fields, or transporting raw materials to your farm.</li>
                                <li>Our fleet ensures timely, safe, and cost-efficient transport so your operations never slow down.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col items-center m-auto p-4 lg:p-6 rounded-xl bg-black border-gold border-2">
                        <h1 className="font-extrabold text-3xl text-center text-gold my-2">Fertilizers</h1>
                        <div className="grid grid-cols-[80vw] md:grid-cols-[40vw_30vw] m-auto justify-items-center py-4 content-center">
                            <img src="fertilizers.png" alt="" className="md:hidden block object-center w-72 md:w-96 h-auto m-auto" />
                            <ul className="list-disc list-outside w-9/12">
                                <li>Get all your essential farming inputs in one place.</li>
                                <li>Our platform makes it simple to browse, compare, and purchase fertilizers, pesticides, seeds, and other agri-supplies from trusted brands.</li>
                                <li>We ensure competitive prices, genuine products, and doorstep delivery—making farm management easier and more efficient for every grower.</li>
                            </ul>
                            <img src="fertilizers.png" alt="" className="hidden md:block object-center w-72 md:w-96 h-auto m-auto" />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}
