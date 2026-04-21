import { Link } from "react-router";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";

export default function Dashboard() {

    const Services = [
        { id: 1, title: "AI Tool Kit", point: "The AI Tool Kit for Farmers provides intelligent recommendations for crop planning, disease detection, and resource management.", link: "aitoolkit", image: "/sparkles.svg" },
        { id: 2, title: "Rentals", point: "Access farm equipment on demand with our easy-to-use Rentals service. Find tractors, tools, and machinery at affordable rates.", link: "rentals", image: "/tractor.svg" },
        { id: 3, title: "Contract Farming", point: "Connect with trusted buyers through our Contract Farming service. Agreements, and expert support for stable, profitable farming.", link: "contract", image: "/contractdoc.svg" },
        { id: 4, title: "Shop", point: "Explore our Farmers' Shop for high-quality seeds, fertilizers, tools, and essentials-all in one place. Trusted products at fair prices to support productive farming.", link: "shop", image: "/shop.svg" },
        { id: 5, title: "Transport", point: "Simplify crop movement with our Transport service, connecting farmers to reliable vehicles at fair rates. Ensure fast, safe, and hassle-free delivery.", link: "transport", image: "/truck.svg" },
        { id: 6, title: "Cold Storage", point: "Protect your harvest with access to affordable, reliable cold storage facilities. Reduce spoilage, extend shelf life, and secure better market prices.", link: "coldstorage", image: "/coldstorage.svg" }
    ]

    const { isOpen, role } = UseAppContext();

    return (
        <>
            <div className="bg-black min-h-dvh">
                <SideNav />
                <div className={`min-h-dvh ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
                    <div className="mx-2 my-4 overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
                    <div className="flex flex-row flex-wrap items-center justify-center gap-8 p-6 font-montserrat md:p-8">
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
            </div>
        </>
    )
}
