import NavBar from "../components/NavBar";
import { Link } from "react-router";
import Footer from "../components/Footer";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import SideNav from "../components/SideNav";

export default function Dashboard() {

    const Services = [
        { id: 1, title: "AI Took Kit", point: "The AI Tool Kit for Farmers provides intelligent recommendations for crop planning, disease detection, and resource management.", link: "/aitoolkit", image: "/aitoolkit.svg" },
        { id: 2, title: "Rentals", point: "Access farm equipment on demand with our easy-to-use Rentals service. Find tractors, tools, and machinery at affordable rates.", link: "/rentals", image: "/tractor.svg" },
        { id: 3, title: "Contract Farming", point: "Connect with trusted buyers through our Contract Farming service. Agreements, and expert support for stable, profitable farming.", link: "/contractfarming", image: "/contractdoc.svg" },
        { id: 4, title: "Shop", point: "Explore our Farmers' Shop for high-quality seeds, fertilizers, tools, and essentials-all in one place. Trusted products at fair prices to support productive farming.", link: "/shop", image: "/shop.svg" },
        { id: 5, title: "Transport", point: "Simplify crop movement with our Transport service, connecting farmers to reliable vehicles at fair rates. Ensure fast, safe, and hassle-free delivery.", link: "/transport", image: "/truck.svg" },
        { id: 6, title: "Cold Storage", point: "Protect your harvest with access to affordable, reliable cold storage facilities. Reduce spoilage, extend shelf life, and secure better market prices.", link: "/coldstorage", image: "/coldstorage.svg" }
    ]


    return (
        <>
            <div className="bg-darkgreen">
                <NavBar />
                <SideNav/>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-auto my-10 gap-10 md:gap-20 w-10/12 md:w-11/12 font-montserrat">
                    {Services.map((item) => (
                        <div key={item.id} className="group hover:shadow-2xl shadow-gold rounded-xl flex flex-col items-start justify-evenly bg-black text-white p-6 border-2 border-gold gap-2 transition-all ease-in duration-300">
                            <img src={item.image} alt="" className="size-20 mb-2" />
                            <h1 className="font-bold text-2xl">{item.title}</h1>
                            <p className="font-semibold text-sm">{item.point}</p>
                            <Link to={item.link} className="bg-white text-black rounded-xl p-4 hover:bg-gold w-full cursor-pointer flex flex-row items-center justify-between m-auto mt-6 transition-all ease-in duration-300">
                                <p className="font-semibold text-xl">Get Started</p>
                                <ArrowRightIcon className="fill-black size-6" />
                            </Link>
                        </div>
                    ))
                    }
                </div>
                <Footer />
            </div>
        </>
    )
}