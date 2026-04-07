import Google from "/google.svg";
import { useState } from "react";
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, UserCircleIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/solid";
import { UseAppContext } from "../context/AppContext";

export default function Authentication() {

    const { navigate, setToken, axios, fetchUser } = UseAppContext();
    const [auth, setAuth] = useState("signin");
    const [show, setShow] = useState("password");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const Login = async (e) => {
        try {
            e.preventDefault();

            const { data } = await axios.post('/api/user/login', {
                username,
                email,
                password
            });

            if (data.success) {

                localStorage.setItem('token', data.token);
                setToken(data.token);
                axios.defaults.headers.common['Authorization'] = `${data.token}`

                await fetchUser();

                window.alert("Logged in");
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const Register = async (e) => {
        try {
            e.preventDefault();
            e.stopPropagation();
            const { data } = await axios.post('/api/user/register', { username, email, password });
            if (password !== confirmpassword) {
                alert("Passwords do not match.");
                return;
            }
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            if (data.success) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                axios.defaults.headers.common['Authorization'] = `${data.token}`
                navigate('/role');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert(error.message);

        }
    }

    return (
        <>
            <div className="min-h-dvh bg-[url(/background.png)] bg-cover bg-center font-montserrat flex items-center justify-center font-bold py-6">
                <div className="bg-darkgreen/40 backdrop-blur-sm w-11/12 md:w-10/12 border rounded-md border-white m-auto items-center justify-center flex flex-col p-10">
                    <div className="rounded-full bg-white p-1 border border-black flex m-auto">
                        <button className={`py-1 px-4 rounded-full flex items-center gap-2 cursor-pointer font-semibold transition-all ease-in duration-300 ${auth == "signin" ? "bg-linear-to-r from-gold to-yellow-200 text-black" : ""}`} onClick={() => { setAuth("signin"); setEmail(""); setPassword(""); setConfirmPassword(""); setUsername(""); }}>
                            <UserCircleIcon className={`size-8 ${auth == "signin" ? "" : "fill-gold"}`} />Sign In</button>
                        <button className={`py-1 px-4 rounded-full flex items-center gap-2 cursor-pointer font-semibold transition-all ease-in duration-300 ${auth == "signup" ? "bg-linear-to-r from-gold to-yellow-200 text-black" : ""}`} onClick={() => { setAuth("signup"); setEmail(""); setPassword(""); setUsername(""); }}><UserCircleIcon className={`size-8 ${auth == "signup" ? "" : "fill-gold"}`} />Sign Up</button>
                    </div>
                    {auth == "signin" &&
                        <form className="flex flex-col m-auto gap-2">
                            <div className="flex flex-col items-center p-2 text-white">
                                <h1 className="text-3xl md:text-4xl ">Welcome back!</h1>
                                <p className="text-xl">You have been missed</p>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="username" className="text-white text-xl">Username</label>
                                <div className="flex flex-row gap-1 items-center bg-white border border-black w-full p-2 rounded-sm">
                                    <UserIcon className="size-6 fill-gold" />
                                    <input type="text" autoComplete="username" name="username" value={username} onChange={(e) => { setUsername(e.target.value) }} id="username" placeholder="Enter your username" className="focus:outline-0 w-full font-normal" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="email" className="text-white text-xl">Email Address</label>
                                <div className="flex flex-row gap-1 items-center bg-white border border-black w-full p-2 rounded-sm">
                                    <EnvelopeIcon className="size-6 fill-activetab" />
                                    <input type="email" autoComplete="email" name="email" value={email} id="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="Enter your Email ID" className="focus:outline-0 w-full font-normal" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2 group">
                                <label htmlFor="current-password" className="text-white text-xl">Password</label>
                                <div className="flex flex-row gap-1 items-center justify-between bg-white border border-black w-full p-2 rounded-sm">
                                    <div className="flex flex-row gap-1 items-center w-full">
                                        <LockClosedIcon className="size-6 fill-gold" />
                                        <input type={show} autoComplete="current-password" name="current-password" id="current-password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Enter your password" className="focus:outline-0 w-full font-normal" />
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
                            <input type="submit" value="Sign In" onClick={(e) => Login(e)} className="bg-linear-to-r from-gold to-yellow-200 cursor-pointer p-2 rounded-sm border border-black hover:scale-105 transition-all ease-in duration-200" />
                            <p className="font-bold text-white text-center">OR</p>
                            <button className="border-2 border-white rounded-sm flex text-xl gap-2 flex-row p-2 items-center justify-center cursor-pointer hover:scale-105 transition-all ease-in duration-200"><img src={Google} alt="" className="size-6" /><p className="text-white font-bold">Continue with Google</p></button>
                        </form>
                    }
                    {auth == "signup" &&
                        <form className="flex flex-col m-auto">
                            <div className="flex flex-col items-center p-2 text-white">
                                <h1 className="text-3xl md:text-4xl ">Create your Account</h1>
                                <p className="text-xl p-2">Let's get started!</p>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="username" className="text-white text-xl">Username</label>
                                <div className="flex flex-row gap-1 items-center bg-white border border-black w-full p-2 rounded-sm">
                                    <UserIcon className="size-6 fill-gold" />
                                    <input type="text" autoComplete="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Enter your username" className="focus:outline-0 w-full font-normal" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="email" className="text-white text-xl">Email Address</label>
                                <div className="flex flex-row gap-1 items-center bg-white border border-black w-full p-2 rounded-sm">
                                    <EnvelopeIcon className="size-6 fill-activetab" />
                                    <input type="email" autoComplete="email" name="email" value={email} id="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="Enter your Email ID" className="focus:outline-0 w-full font-normal" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2 group">
                                <label htmlFor="new-password" className="text-white text-xl">Password</label>
                                <div className="flex flex-row gap-1 items-center justify-between bg-white border border-black w-full p-2 rounded-sm">
                                    <div className="flex flex-row gap-1 items-center w-full">
                                        <LockClosedIcon className="size-6 fill-gold" />
                                        <input type={show} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} name="new-password" id="new-password" placeholder="Set password" className="focus:outline-0 w-full font-normal" />
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
                                <label htmlFor="confirm-password" className="text-white text-xl">Confirm Password</label>
                                <div className="flex flex-row gap-1 items-center justify-between bg-white border border-black w-full p-2 rounded-sm">
                                    <div className="flex flex-row gap-1 items-center w-full">
                                        <LockClosedIcon className="size-6 fill-gold" />
                                        <input type={show} autoComplete="new-password" name="confirm-password" id="confirm-password" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className="focus:outline-0 w-full font-normal" />
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
                            <input type="submit" value="Create Account" onClick={(e) => Register(e)} className="bg-linear-to-r from-gold to-yellow-200 cursor-pointer p-2 rounded-sm border border-black hover:scale-105 transition-all ease-in duration-200" />
                            <p className="p-2 font-bold text-white text-center">OR</p>
                            <button className="border-2 border-white rounded-sm flex text-xl gap-2 flex-row p-2 items-center justify-center cursor-pointer hover:scale-105 transition-all ease-in duration-200"><img src={Google} alt="" className="size-6" /><p className="text-white font-bold">Continue with Google</p></button>
                        </form>
                    }
                </div>
            </div>
        </>
    )
}
