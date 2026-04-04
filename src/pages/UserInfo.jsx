import { UserIcon, PhoneIcon, MapPinIcon, HomeIcon, CalendarIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router";
import SideNav from "../components/SideNav";
import { useState } from "react";
import { UseAppContext } from "../context/AppContext";

export default function UserInfo() {

    const {navigate, role, axios} = UseAppContext();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [dateofbirth, setDateofbirth] = useState(new Date());
    const [pincode, setPincode] = useState("");
    const [state, setstate] = useState("");

    const SubmitDetails = async () => {
        try {
            const response  = await axios.post(`/api/${role}/submitdetails`, {
                email, name, dateofbirth, phonenumber, address, pincode, state
            });
            if (response.data.success) {
                window.alert(response.data.message);
                navigate(`/${role}/`);
            }
            else{
                window.alert("An Error occurred in response. Try again.");
            }
        } catch (error) {
            console.log(error.message);
                window.alert("An Error occurred in request. Try again.");
        }
    }

    return (
        <>
            <div className="min-h-dvh bg-[url(/background.png)] bg-cover bg-center font-montserrat bg-darkgreen">
                <div className="backdrop-brightness-80 font-montserrat backdrop-blur-sm w-full min-h-dvh flex m-auto items-center justify-center text-gold font-bold p-6">
                    <div className="w-full md:w-11/12 lg:w-10/12 h-11/12 p-6 flex flex-col m-auto items-center justify-center rounded-2xl bg-darkgreen/20 ">
                        <h1 className="text-2xl md:text-3xl font-bold p-2 text-gold text-center">Update yout details</h1>
                        <hr className="border-gold w-full" />
                        <div className="flex flex-col w-full md:w-10/12 lg:w-8/12">
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="name" className="text-lg">Full name</label>
                                <div className="flex flex-row gap-1 items-center bg-white border border-black w-full p-2 rounded-sm">
                                    <UserIcon className="size-6 fill-gold" />
                                    <input type="text" name="name" id="name" value={name} onChange={(e) => { setName(e.target.value) }} placeholder="Enter your full name" className="focus:outline-0 w-full font-normal text-black" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="dob" className="text-lg">Date of Birth</label>
                                <div className="flex flex-row gap-1 items-center bg-white border border-black w-full p-2 rounded-sm">
                                    <CalendarIcon className="size-6 fill-gold" />
                                    <input type="date" name="dob" id="dob" value={dateofbirth} onChange={(e) => { setDateofbirth(e.target.value) }} placeholder="Enter your Date of Birth" className="focus:outline-0 w-full font-normal text-black" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="phno" className="text-lg">Phone Number</label>
                                <div className="flex flex-row gap-1 items-center bg-white border border-black w-full p-2 rounded-sm">
                                    <PhoneIcon className="size-6 fill-gold" />
                                    <input type="tel" name="phno" id="phno" value={phonenumber} onChange={(e) => { setPhonenumber(e.target.value) }} placeholder="Enter your phone number" className="focus:outline-0 w-full font-normal text-black" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="email" className="text-lg">Email</label>
                                <div className="flex flex-row gap-1 items-center bg-white border border-black w-full p-2 rounded-sm">
                                    <EnvelopeIcon className="size-6 fill-gold" />
                                    <input type="email" name="email" id="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Enter your Email" className="focus:outline-0 w-full font-normal text-black" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="address" className="text-lg">Address</label>
                                <div className="flex flex-row gap-1 items-center bg-white border border-black w-full p-2 rounded-sm">
                                    <HomeIcon className="size-6 fill-gold" />
                                    <input type="text" name="address" id="address" value={address} onChange={(e) => { setAddress(e.target.value) }} placeholder="Enter your Address" className="focus:outline-0 w-full font-normal text-black" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="pincode" className="text-lg">Pin Code</label>
                                <div className="flex flex-row gap-1 items-center bg-white border border-black w-full p-2 rounded-sm">
                                    <MapPinIcon className="size-6 fill-gold" />
                                    <input type="text" name="pincode" id="pincode" value={pincode} onChange={(e) => { setPincode(e.target.value) }} placeholder="Enter your pincode" className="focus:outline-0 w-full font-normal text-black" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="state" className="text-lg">State</label>
                                <div className="flex flex-row gap-1 items-center bg-white border border-black w-full p-2 rounded-sm">
                                    <MapPinIcon className="size-6 fill-gold" />
                                    <select name="state" id="state" value={state} onChange={(e) => { setstate(e.target.value) }} className="focus:outline-0 w-full font-normal text-black">
                                        <option value="select">Select</option>
                                        <option value="telangana">Telangana</option>
                                        <option value="andhra pradesh">Andhra Pradesh</option>
                                        <option value="maharashtra">Maharashtra</option>
                                        <option value="karnataka">Karnataka</option>
                                        <option value="kerala">Kerala</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button onClick={SubmitDetails} className="text-xl mt-4 w-auto font-bold bg-gold py-2 px-4 rounded-md text-darkgreen cursor-pointer" >Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}