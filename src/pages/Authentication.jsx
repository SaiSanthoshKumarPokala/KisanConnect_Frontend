import Google from "/google.svg";
import Background from "/background.png";
import { useState } from "react";
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, UserCircleIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/solid";

export default function Authentication() {


    const [auth, setAuth] = useState("signin");
    const [show, setShow] = useState("password");

    return (
        <>
            <div className="min-h-dvh bg-[url(/background.png)] bg-cover bg-center font-montserrat flex items-center justify-center font-bold">
                <div className="bg-darkgreen/40 backdrop-blur-sm w-11/12 md:w-10/12 border-1 rounded-md border-white m-auto items-center justify-center flex flex-col p-10">
                    <div className="rounded-full bg-white p-1 border-1 border-black flex m-auto">
                        <button className={`py-1 px-4 rounded-full flex items-center gap-2 cursor-pointer font-semibold transition-all ease-in duration-300 ${auth == "signin" ? "bg-gradient-to-r from-gold to-yellow-200 text-black" : ""}`} onClick={() => { setAuth("signin") }}>
                            <UserCircleIcon className={`size-8 ${auth == "signin" ? "" : "fill-gold"}`} />Sign In</button>
                        <button className={`py-1 px-4 rounded-full flex items-center gap-2 cursor-pointer font-semibold transition-all ease-in duration-300 ${auth == "signup" ? "bg-gradient-to-r from-gold to-yellow-200 text-black" : ""}`} onClick={() => { setAuth("signup") }}><UserCircleIcon className={`size-8 ${auth == "signup" ? "" : "fill-gold"}`} />Sign Up</button>
                    </div>
                    {auth == "signin" &&
                        <div className="flex flex-col m-auto gap-2">
                            <div className="flex flex-col items-center p-2 text-white">
                                <h1 className="text-3xl md:text-4xl ">Welcome back!</h1>
                                <p className="text-xl">You have been missed</p>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="username" className="text-white text-xl">Username</label>
                                <div className="flex flex-row gap-1 items-center bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <UserIcon className="size-6 fill-gold" />
                                    <input type="text" name="username" id="username" placeholder="Enter your username" className="focus:outline-0 w-full font-normal" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2 group">
                                <label htmlFor="password" className="text-white text-xl">Password</label>
                                <div className="flex flex-row gap-1 items-center justify-between bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <div className="flex flex-row gap-1 items-center w-full">
                                        <LockClosedIcon className="size-6 fill-gold" />
                                        <input type={show} name="password" id="password" placeholder="Enter your password" className="focus:outline-0 w-full font-normal" />
                                    </div>
                                    {show == "password" &&
                                        <button onClick={() => { setShow("text") }}>
                                            <EyeIcon className="size-6 fill-gold" />
                                        </button>
                                    }
                                    {show == "text" &&
                                        <button onClick={() => { setShow("password") }}>
                                            <EyeSlashIcon className="size-6 fill-gold" />
                                        </button>
                                    }
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 p-2 items-center">
                                <input type="checkbox" name="terms" id="terms" required className="size-6 accent-gold" />
                                <label htmlFor="terms" className="text-white font-normal">I agree to the Terms of Service and Privacy policy</label>
                            </div>
                            <input type="submit" value="Sign In" className="bg-gradient-to-r from-gold to-yellow-200 cursor-pointer p-2 rounded-sm border-1 border-black hover:scale-105 transition-all ease-in duration-200" />
                            <p className="font-bold text-white text-center">OR</p>
                            <button className="border-2 border-white rounded-sm flex text-xl gap-2 flex-row p-2 items-center justify-center cursor-pointer hover:scale-105 transition-all ease-in duration-200"><img src={Google} alt="" className="size-6" /><p className="text-white font-bold">Continue with Google</p></button>
                        </div>
                    }
                    {auth == "signup" &&
                        <form className="flex flex-col m-auto">
                            <div className="flex flex-col items-center p-2 text-white">
                                <h1 className="text-3xl md:text-4xl ">Create your Account</h1>
                                <p className="text-xl p-2">Let's get started!</p>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="username" className="text-white text-xl">Username</label>
                                <div className="flex flex-row gap-1 items-center bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <UserIcon className="size-6 fill-gold" />
                                    <input type="text" name="username" id="username" placeholder="Enter your username" className="focus:outline-0 w-full font-normal" />
                                </div>
                            </div>
                            {/* <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="email" className="text-white text-xl">Email Address</label>
                                <div className="flex flex-row gap-1 items-center bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <EnvelopeIcon className="size-6 fill-activetab" />
                                    <input type="email" name="email" id="email" placeholder="Enter your Email ID" className="focus:outline-0 w-full font-normal" />
                                </div>
                            </div> */}
                            {/* <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="role" className="text-white text-xl">Role</label>
                                <div className="flex flex-row gap-1 items-center bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <UserIcon className="size-6 fill-activetab" />
                                    <input type="role" name="role" id="role" placeholder="Enter your Role" className="focus:outline-0 w-full font-normal" />
                                </div>
                            </div> */}
                            <div className="flex flex-col items-start gap-0.5 p-2 group">
                                <label htmlFor="password" className="text-white text-xl">Password</label>
                                <div className="flex flex-row gap-1 items-center justify-between bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <div className="flex flex-row gap-1 items-center w-full">
                                        <LockClosedIcon className="size-6 fill-gold" />
                                        <input type={show} name="password" id="password" placeholder="Enter your password" className="focus:outline-0 w-full font-normal" />
                                    </div>
                                    {show == "password" &&
                                        <button onClick={() => { setShow("text") }}>
                                            <EyeIcon className="size-6 fill-gold" />
                                        </button>
                                    }
                                    {show == "text" &&
                                        <button onClick={() => { setShow("password") }}>
                                            <EyeSlashIcon className="size-6 fill-gold" />
                                        </button>
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2 group">
                                <label htmlFor="confirmpassword" className="text-white text-xl">Confirm Password</label>
                                <div className="flex flex-row gap-1 items-center justify-between bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <div className="flex flex-row gap-1 items-center w-full">
                                        <LockClosedIcon className="size-6 fill-gold" />
                                        <input type={show} name="confirmpassword" id="confirmpassword" placeholder="Re-enter your password" className="focus:outline-0 w-full font-normal" />
                                    </div>
                                    {show == "password" &&
                                        <button onClick={() => { setShow("text") }}>
                                            <EyeIcon className="size-6 fill-gold" />
                                        </button>
                                    }
                                    {show == "text" &&
                                        <button onClick={() => { setShow("password") }}>
                                            <EyeSlashIcon className="size-6 fill-gold" />
                                        </button>
                                    }
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 p-2 items-center">
                                <input type="checkbox" name="terms" id="terms" required className="size-4" />
                                <label htmlFor="terms" className="text-white font-normal">I agree to the Terms of Service and Privacy policy</label>
                            </div>
                            <input type="submit" value="Create Account" className="bg-gradient-to-r from-gold to-yellow-200 cursor-pointer p-2 rounded-sm border-1 border-black hover:scale-105 transition-all ease-in duration-200" />
                            <p className="p-2 font-bold text-white text-center">OR</p>
                            <button className="border-2 border-white rounded-sm flex text-xl gap-2 flex-row p-2 items-center justify-center cursor-pointer hover:scale-105 transition-all ease-in duration-200"><img src={Google} alt="" className="size-6" /><p className="text-white font-bold">Continue with Google</p></button>
                        </form>
                    }
                </div>
            </div>
        </>
    )
}