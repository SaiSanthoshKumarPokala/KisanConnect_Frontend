import { NavLink } from "react-router"
import { MapPinIcon, EnvelopeIcon, PhoneIcon, UserIcon } from "@heroicons/react/16/solid"
import { useState } from "react"
import GoUp from "./GoUp";

export default function Footer() {

    const [mail, setMail] = useState("");


    return (
        <>
            <footer className="grid gap-4 lg:gap-0 md:grid-cols-2 md:gap-6 lg:grid-cols-4 p-12 md:p-6 lg:p-2 lg:py-6 bg-darkgreen border-t-2 border-gold font-montserrat">
                <div className="flex flex-row items-start md:justify-center gap-6 md:m-auto">
                    <div className="flex flex-row gap-4 md:gap-0 md:flex-col items-end md:items-start justify-center">
                        <a href="/"><img src="/Kisan Connect Logo 1.png" className="size-28 rounded-full" alt="Logo" /></a>
                        <div className="flex flex-col items-start justify-center">
                            <h1 className="font-extrabold text-gold text-3xl md:text-5xl">KISAN</h1>
                            <h1 className="font-extrabold text-white text-3xl md:text-5xl">CONNECT</h1>
                        </div>
                    </div>
                </div>
                <hr className="border-amber-50 md:hidden block" />
                <div className="flex flex-col h-full md:w-11/12 w-full md:m-auto text-white">
                    <h1 className="font-bold text-2xl text-gold">Join Our Newsletter</h1>
                    <p className="font-bold">Join our newsletter to get latest news and updates right into your mail inbox.</p>
                    <div className="flex flex-col items-start gap-0.5 py-2">
                        <label htmlFor="Email" className="text-white text-xl">Email Address</label>
                        <div className="flex flex-row gap-1 items-center bg-white border-1 border-black w-full p-2 rounded-sm">
                            <EnvelopeIcon className="size-8 fill-activetab" />
                            <input type="email" value={mail} name="Email" id="Email" placeholder="xyz@gmail.com" className="focus:outline-0 w-full font-normal text-black" onChange={(e) => setMail(e.target.value)} />
                        </div>
                    </div>
                    <input type="submit" value="Join" className="bg-gradient-to-r font-bold from-activetab to-yellow-200 cursor-pointer p-2 rounded-sm border-1 border-black text-black hover:scale-105 transition-all ease-in duration-200" />
                </div>
                <hr className="border-amber-50 md:hidden block" />

                <div className="flex flex-col h-full md:m-auto text-white md:w-8/12 lg:w-auto">
                    <h1 className="font-bold text-2xl text-gold">Quick Links</h1>
                    <div className="flex flex-col items-start justify-evenly h-full">
                        <NavLink to="/" className="hover:text-gold hover:underline hover:underline-offset-2 font-bold">Home</NavLink>
                        <NavLink to="/" className="hover:text-gold hover:underline hover:underline-offset-2 font-bold">About</NavLink>
                        <NavLink to="/" className="hover:text-gold hover:underline hover:underline-offset-2 font-bold">Services</NavLink>
                        <NavLink to="/" className="hover:text-gold hover:underline hover:underline-offset-2 font-bold">Programs</NavLink>
                        <NavLink to="/" className="hover:text-gold hover:underline hover:underline-offset-2 font-bold">Faqs</NavLink>
                    </div>
                </div>
                <hr className="border-amber-50 md:hidden block" />

                <div className="flex flex-col h-full md:m-auto text-white md:w-11/12 lg:w-auto">
                    <h1 className="font-bold text-2xl text-gold">Visit Us</h1>
                    <address className="flex flex-col items-start justify-evenly h-full">
                        <div className="flex flex-row gap-2"><MapPinIcon className="size-6 fill-gold" /><a href="https://www.google.com/maps" className="hover:text-gold hover:underline hover:underline-offset-2">XYZ</a></div>
                        {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.9350820591962!2d78.3903428193883!3d17.493917460251005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9186c9216501%3A0x5b92f2e1fd8fc012!2sJawaharlal%20Nehru%20Technological%20University%20Hyderabad!5e0!3m2!1sen!2sin!4v1763689740944!5m2!1sen!2sin" width="300" height="300" className="border:0;" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> */}
                        <div className="flex flex-row gap-2"><EnvelopeIcon className="size-6 fill-gold" /><a href="mailto:kisanconnect@farmer.in" className="hover:text-gold hover:underline hover:underline-offset-2">kisanconnect@farmer.in</a></div>
                        <div className="flex flex-row gap-2"><PhoneIcon className="size-6 fill-gold" /><a href="tel:+91 9999999999" className="hover:text-gold hover:underline hover:underline-offset-2">9999999999</a></div>
                        <div className="flex flex-row gap-2">
                            <a href="https://www.instagram.com/"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" className="m-1 fill-white hover:fill-gold" viewBox="0 0 24 24">
                                <path d="M 8 3 C 5.239 3 3 5.239 3 8 L 3 16 C 3 18.761 5.239 21 8 21 L 16 21 C 18.761 21 21 18.761 21 16 L 21 8 C 21 5.239 18.761 3 16 3 L 8 3 z M 18 5 C 18.552 5 19 5.448 19 6 C 19 6.552 18.552 7 18 7 C 17.448 7 17 6.552 17 6 C 17 5.448 17.448 5 18 5 z M 12 7 C 14.761 7 17 9.239 17 12 C 17 14.761 14.761 17 12 17 C 9.239 17 7 14.761 7 12 C 7 9.239 9.239 7 12 7 z M 12 9 A 3 3 0 0 0 9 12 A 3 3 0 0 0 12 15 A 3 3 0 0 0 15 12 A 3 3 0 0 0 12 9 z"></path>
                            </svg></a>
                            <a href="https://www.whatsapp.com/"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" className="m-1 fill-white hover:fill-gold" viewBox="0 0 24 24">
                                <path d="M19.077,4.928C17.191,3.041,14.683,2.001,12.011,2c-5.506,0-9.987,4.479-9.989,9.985 c-0.001,1.76,0.459,3.478,1.333,4.992L2,22l5.233-1.237c1.459,0.796,3.101,1.215,4.773,1.216h0.004 c5.505,0,9.986-4.48,9.989-9.985C22.001,9.325,20.963,6.816,19.077,4.928z M16.898,15.554c-0.208,0.583-1.227,1.145-1.685,1.186 c-0.458,0.042-0.887,0.207-2.995-0.624c-2.537-1-4.139-3.601-4.263-3.767c-0.125-0.167-1.019-1.353-1.019-2.581 S7.581,7.936,7.81,7.687c0.229-0.25,0.499-0.312,0.666-0.312c0.166,0,0.333,0,0.478,0.006c0.178,0.007,0.375,0.016,0.562,0.431 c0.222,0.494,0.707,1.728,0.769,1.853s0.104,0.271,0.021,0.437s-0.125,0.27-0.249,0.416c-0.125,0.146-0.262,0.325-0.374,0.437 c-0.125,0.124-0.255,0.26-0.11,0.509c0.146,0.25,0.646,1.067,1.388,1.728c0.954,0.85,1.757,1.113,2.007,1.239 c0.25,0.125,0.395,0.104,0.541-0.063c0.146-0.166,0.624-0.728,0.79-0.978s0.333-0.208,0.562-0.125s1.456,0.687,1.705,0.812 c0.25,0.125,0.416,0.187,0.478,0.291C17.106,14.471,17.106,14.971,16.898,15.554z"></path>
                            </svg></a>
                            <a href="https://www.facebook.com/"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" className="m-1 fill-white hover:fill-gold" viewBox="0 0 24 24">
                                <path d="M12,2C6.477,2,2,6.477,2,12c0,5.013,3.693,9.153,8.505,9.876V14.65H8.031v-2.629h2.474v-1.749 c0-2.896,1.411-4.167,3.818-4.167c1.153,0,1.762,0.085,2.051,0.124v2.294h-1.642c-1.022,0-1.379,0.969-1.379,2.061v1.437h2.995 l-0.406,2.629h-2.588v7.247C18.235,21.236,22,17.062,22,12C22,6.477,17.523,2,12,2z"></path>
                            </svg></a>
                            <a href="https://in.linkedin.com/"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" className="m-1 fill-white hover:fill-gold" viewBox="0 0 24 24">
                                <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9 V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977 C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z"></path>
                            </svg></a>
                        </div>
                    </address>
                </div>
            </footer >
        </>
    )
}