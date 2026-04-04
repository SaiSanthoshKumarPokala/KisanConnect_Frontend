import NavBar from "../components/NavBar";
import Yield from "/yield.svg"
import Tick from "/tick.svg"
import Prize from "/prize.svg"
import Disease from "/disease.svg"
import Best from "/best.svg"
import Contract from "/contract.svg";
import Fertilizers from "/fertilizers.svg";
import Transport from "/transport.svg";
import Rentals from "/rentals.svg";
import Forward from "/Forward.svg";
import React from "react";
import { useState, useRef } from "react";
import Authentication from "./Authentication";
import Footer from "../components/Footer";
import { ChevronRightIcon, ArrowLongRightIcon, CheckIcon, CheckBadgeIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router";
import { Bars3Icon } from "@heroicons/react/16/solid";
import SideNav from "../components/SideNav";
import GoUp from "../components/GoUp";

export default function Landing() {

    const [isactive, setIsactive] = useState(1);

    const Services = [
        { id: 1, name: 'Contract Farming', point1: 'Access to Resources', point2: 'Flexibility and Efficiency', point3: 'Types of Agreements', icon: Contract, link: '/' },
        { id: 2, name: 'Rentals', point1: 'Rentals are good', point2: 'Rentals are efficient', point3: 'Rentals can have disadvantage', icon: Rentals, link: '/' },
        { id: 3, name: 'Transport Services', point1: 'Transport services are good', point2: 'Transpor services are efficient', point3: 'Transport services ', icon: Transport, link: '/' },
        { id: 4, name: 'Fertilizers', point1: 'Fertilizers are good', point2: 'Fertilizers are efficient', point3: 'Fertilizers services', icon: Fertilizers, link: '/' }
    ];

    const AIToolKit = [
        { id: 1, name: 'Yield Prediction', desc: 'Yield prediction is good for nothing', point1: 'How to predict a yield', point2: 'How to not predict a yield', point3: 'How to not predict a yield', icon: Yield, isactive: true },
        { id: 2, name: 'Prize Prediction', desc: 'Yield prediction is good for nothing', point1: 'How to predict a yield', point2: 'How to not predict a yield', point3: 'How to not predict a yield', icon: Prize, isactive: false },
        { id: 3, name: 'Crop Disease Detection', desc: 'Yield prediction is good for nothing', point1: 'How to predict a yield', point2: 'How to not predict a yield', point3: 'How to not predict a yield', icon: Disease, isactive: false },
        { id: 4, name: 'Best Crop Analysis', desc: 'Yield prediction is good for nothing', point1: 'How to predict a yield', point2: 'How to not predict a yield', point3: 'How to not predict a yield', icon: Best, isactive: false }
    ];

    return (
        <>
            {/* <Authentication/> */}
            {/* <img src="/hero.png" alt="" className="absolute h-dvh w-[2000px] object-cover md:object-cover md:w-dvw md:h-lvh bg-black" /> */}
            {/* For medium and large screens */}
            <div className="hidden md:block relative font-montserrat bg-[url(/hero.png)] bg-cover bg-center bg-darkgreen">
                <NavBar />
                <div>
                    <div className="flex flex-col items-center justify-center h-150 gap-4">
                        <h1 className="font-extrabold text-3xl md:text-5xl text-center text-white mx-6">GROW MORE THAN JUST CROPS</h1>
                        <div className="flex flex-col items-center justify-center text-center px-4">
                            <p className="font-bold md:text-xl text-gold">We provide the resources and support  </p>
                            <p className="font-bold md:text-xl text-gold">to help you achieve your goals, season after season.</p>
                        </div>
                        <div className="flex gap-8 m-4">
                            <Link to={"/auth"} className="px-4 py-2 text-white font-bold rounded-xl m-2 border-gold/75 border-[1.2px] cursor-pointer bg-darkgreen
                             hover:bg-linear-to-r hover:from-gold hover:to-yellow-200 hover:text-darkgreen transition-all ease-in duration-100">Get Started</Link>
                            <Link to={"#services"} className="px-4 py-2 text-white font-bold rounded-xl m-2 border-white border-[1.2px] cursor-pointer hover:bg-white hover:text-gold hover:border-gold transition-all ease-in duration-100">Know more</Link>
                        </div>
                    </div>
                </div>
                <div className="relative bottom-0 h-20 bg-linear-to-b from-darkgreen/10 to-darkgreen">
                </div>
            </div>
            {/* For small screens */}
            <div className="block md:hidden font-montserrat bg-[url(/hero.png)] bg-cover bg-center bg-darkgreen">
                <NavBar />
                <div>
                    <div className="flex flex-col items-center justify-center h-150 gap-4">
                        <h1 className="font-extrabold text-3xl md:text-4xl lg:text-5xl text-center text-white mx-6">GROW MORE THAN JUST CROPS</h1>
                        <div className="flex flex-col items-center justify-center text-center px-4">
                            <p className="font-bold md:text-xl bg-linear-to-r from-gold to-yellow-200 bg-clip-text text-transparent">We provide the resources and support  </p>
                            <p className="font-bold md:text-xl bg-linear-to-r from-gold to-yellow-200 bg-clip-text text-transparent">to help you achieve your goals, season after season.</p>
                        </div>
                        <div className="flex gap-8 m-4">
                            <Link to="/auth" className="px-4 py-2 text-white font-bold rounded-xl m-2 border-gold/75 border-[1.2px] cursor-pointer bg-darkgreen">Get Started</Link>
                            <Link to={"#services"} className="px-4 py-2 text-white font-bold rounded-xl m-2 border-white border-[1.2px] cursor-pointer">Know more</Link>
                        </div>
                    </div>
                    <div className="relative bottom-0 h-20 bg-linear-to-b from-darkgreen/10 to-darkgreen">
                    </div>
                </div>
            </div>

            <div className="relative font-montserrat bg-darkgreen h-auto">
                <div className="services pt-16 mb-8 flex gap-2 md:gap-4 items-center justify-center">
                    <hr className=" text-gold none md:w-3/12" />
                    <h1 className="bg-radial from-white to-gold bg-clip-text text-3xl md:text-3xl lg:text-4xl font-bold text-transparent text-center">SERVICES WE PROVIDE</h1>
                    <hr className=" text-gold none md:w-3/12" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:w-11/12 m-auto w-9/12 py-6 justify-center ">
                    {
                        Services.map((item) => (
                            <div key={item.id} className="group border-gold border rounded-3xl bg-black px-8 md:px-6 py-10 hover:bg-linear-to-br hover:from-gradstart hover:to-black hover:bg-darkgreen cursor-pointer">
                                <div className="flex flex-col gap-4 justify-between h-full">
                                    <img src={item.icon} className="size-16" />
                                    <h1 className="font-bold text-white text-2xl">{item.name}</h1>
                                    <hr className="text-gold" />
                                    <div className="flex-col flex h-full justify-between gap-4">
                                        <ul className="text-lightblack font-semibold">
                                            <li className="flex flex-row gap-2 whitespace-pre-wrap"><CheckBadgeIcon className="fill-gold size-6 shrink-0" /> {item.point1}</li>
                                            <li className="flex flex-row gap-2 whitespace-pre-wrap"><CheckBadgeIcon className="fill-gold size-6 shrink-0" /> {item.point2}</li>
                                            <li className="flex flex-row gap-2 whitespace-pre-wrap"><CheckBadgeIcon className="fill-gold size-6 shrink-0" /> {item.point3}</li>
                                        </ul>
                                        <button className="px-4 py-2 flex items-center gap-2 border w-fit rounded-lg border-gold text-gold cursor-pointer font-bold group-hover:bg-gold group-hover:text-white">Read More <ChevronRightIcon className="size-6 group-hover:translate-x-2 transition-transform ease-in duration-300" />
                                        {/* <ArrowLongRightIcon className="size-6 hidden group-hover:block" />  */}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="flex items-center justify-center p-4">
                    <Link to={"/services"} className="px-4 py-2 text-white font-bold rounded-lg m-2 border-gold border cursor-pointer hover:bg-white hover:text-gold transition-all ease-in duration-100">All Services</Link>
                </div>
            </div>
            <div className="relative h-auto font-montserrat bg-darkgreen md:px-10 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 mx-6 md:px-12 gap-2 md:gap-10 items-center">
                    <div className="flex flex-col p-6 gap-2 items-start">
                        <h1 className="font-bold bg-linear-0 from-gold to-yellow-200 bg-clip-text text-transparent text-2xl md:text-3xl">About us</h1>
                        <p className="font-semibold text-3xl md:text-4xl text-white">Empowering</p>
                        <p className="font-semibold text-3xl md:text-4xl text-white">Agriculture through</p>
                        <p className="font-semibold text-3xl md:text-4xl text-white">Technology.</p>
                    </div>
                    <div className="flex p-6">
                        <p className="text-white">Empowering agriculture through technology is about transforming an ancient practice into a modern, data-driven science. It's about giving farmers, regardless of their scale, the tools to move from reactive to proactive farming.</p>
                    </div>
                </div>
                <h1 className="font-bold text-2xl md:text-4xl text-center m-6 text-white"><span className="text-3xl md:text-5xl">I</span>NSIDE THE <span className="bg-linear-to-r from-gold to-yellow-200 bg-clip-text text-transparent">AI TOOL KIT</span></h1>
                <div className="flex flex-col md:flex-row m-auto justify-center-center p-4 w-11/12 md:w-11/12 lg:w-8/12 gap-1 md:gap-0.5">
                    <div className="flex flex-col w-full md:w-8/12 lg:w-6/12 bg-black rounded-md border-gold/70 border">
                        {
                            AIToolKit.map((item) => (
                                <div id={item.id} key={item.id} className={`flex flex-row items-center gap-4 p-4 cursor-pointer rounded-md ${isactive == item.id ? "bg-linear-to-r from-gold to-yellow-200 text-black" : "bg-black text-white"}`} onClick={() => setIsactive(item.id)}>
                                    <div className="image rounded-full bg-white">
                                        <img src={item.icon} alt="" className="p-2" />
                                    </div>
                                    <p className="font-bold text-xl">{item.name}</p>
                                </div>
                            ))
                        }
                    </div>
                    <div className="bg-black/42 border border-gold/70 w-full rounded-md bg-[url(/ai_bg.png)] bg-cover bg-center">
                        <div className="flex flex-col p-6">
                            <h1 className="text-3xl pb-1.25 font-bold bg-linear-to-r from-gold to-yellow-200 bg-clip-text text-transparent">{AIToolKit[isactive - 1].name}</h1>
                            <p className="text-xl text-white">{AIToolKit[isactive - 1].desc}</p>
                            <h3 className="text-white pt-4 pb-2 font-bold text-xl">You will learn:</h3>
                            <ul className="text-white">
                                <li className="flex flex-row gap-4 items-center"><CheckIcon className="size-6 fill-activetab shrink-0" /> {AIToolKit[isactive - 1].point1}</li>
                                <li className="flex flex-row gap-4 items-center"><CheckIcon className="size-6 fill-activetab shrink-0" /> {AIToolKit[isactive - 1].point2}</li>
                                <li className="flex flex-row gap-4 items-center"><CheckIcon className="size-6 fill-activetab shrink-0" /> {AIToolKit[isactive - 1].point3}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[url(/farmer.png)] bg-cover bg-top font-montserrat bg-black relative">
                <div className="flex flex-col items-center justify-center text-center h-110.75 gap-4">
                    <h1 className="text-white font-bold text-3xl md:text-4xl lg:text-5xl">Grow with Us, Thrive Tomorrow</h1>
                    <p className="text-white w-10/12 md:w-7/12 lg:w-5/12 md:text-lg">We empower you with agro education. Unlock expert knowledge and reliable support. Connect with fellow farmers to share insights and boost your harvest. </p>
                    <Link to={"/auth"} className="px-4 py-2 text-white font-bold rounded-xl m-2 border-white border-[1.2px] cursor-pointer hover:bg-white hover:text-gold hover:border-gold transition-all ease-in duration-100">Join Now</Link>
                </div>
            </div>
            <Footer />
        </>
    );
}