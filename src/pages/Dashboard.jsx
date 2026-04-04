import NavBar from "../components/NavBar";
import { Link } from "react-router";
import Footer from "../components/Footer";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useContext, useEffect } from "react";
import SideNav from "../components/SideNav";
import { SidenavContext, RoleContext } from "../context/Contexts";
import { UseAppContext } from "../context/AppContext";

export default function Dashboard() {

    const Services = [
        { id: 1, title: "AI Took Kit", point: "The AI Tool Kit for Farmers provides intelligent recommendations for crop planning, disease detection, and resource management.", link: "/aitoolkit", image: "/aitoolkit.svg" },
        { id: 2, title: "Rentals", point: "Access farm equipment on demand with our easy-to-use Rentals service. Find tractors, tools, and machinery at affordable rates.", link: "/rentals", image: "/tractor.svg" },
        { id: 3, title: "Contract Farming", point: "Connect with trusted buyers through our Contract Farming service. Agreements, and expert support for stable, profitable farming.", link: "/contractfarming", image: "/contractdoc.svg" },
        { id: 4, title: "Shop", point: "Explore our Farmers' Shop for high-quality seeds, fertilizers, tools, and essentials-all in one place. Trusted products at fair prices to support productive farming.", link: "/shop", image: "/shop.svg" },
        { id: 5, title: "Transport", point: "Simplify crop movement with our Transport service, connecting farmers to reliable vehicles at fair rates. Ensure fast, safe, and hassle-free delivery.", link: "/transport", image: "/truck.svg" },
        { id: 6, title: "Cold Storage", point: "Protect your harvest with access to affordable, reliable cold storage facilities. Reduce spoilage, extend shelf life, and secure better market prices.", link: "/coldstorage", image: "/coldstorage.svg" }
    ]

    const { isOpen, setIsOpen, role, setRole } = UseAppContext();

    return (
        <>
            <div className="bg-darkgreen">
                <SideNav />
                <div className={`min-h-dvh m-auto ${isOpen ? "md:ml-52" : "md:ml-16"}`}>
                    <div className={`flex flex-row flex-wrap items-center justify-center w-11/12 gap-8 m-auto py-4 font-montserrat`}>
                        {Services.map((item) => (
                            <Link to={`/${role}/${item.link}`} key={item.id} className="group hover:shadow-[10px_10px_1px_1px] shadow-gold rounded-xl flex flex-col items-start justify-evenly bg-black text-white p-6 border-2 border-gold gap-2 transition-all ease-in duration-300 w-90">
                                <img src={item.image} alt="" className="size-20 mb-2" />
                                <h1 className="font-bold text-2xl">{item.title}</h1>
                                <p className="font-semibold text-sm">{item.point}</p>
                                <div className="bg-white text-black rounded-xl p-4 hover:bg-gold w-full cursor-pointer flex flex-row items-center justify-between m-auto mt-6 transition-all ease-in duration-300">
                                    <p className="font-semibold text-xl">Get Started</p>
                                    <ArrowRightIcon className="fill-black size-6" />
                                </div>
                            </Link>
                        ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}