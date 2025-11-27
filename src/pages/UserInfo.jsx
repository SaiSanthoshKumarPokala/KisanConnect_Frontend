import { UserIcon, PhoneIcon, MapPinIcon, HomeIcon, CalendarIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import SideNav from "../components/SideNav";

export default function UserInfo() {
    return (
        <>
            <div className="min-h-dvh bg-[url(/userinfo.jpg)] bg-cover bg-center font-montserrat">
                <div className="backdrop-brightness-80 font-montserrat backdrop-blur-sm w-full min-h-dvh flex m-auto items-center justify-center text-gold font-bold p-6">
                    <div className="w-full md:w-10/12 h-11/12 p-6 flex flex-col m-auto items-center justify-center rounded-2xl bg-darkgreen/20 ">
                        <h1 className="text-2xl md:text-3xl font-bold p-2 text-gold text-center">Update yout details</h1>
                        <hr className="border-gold w-full" />
                        <div className="flex flex-col w-full md:w-10/12 lg:w-8/12">
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="name" className="text-lg">Full name</label>
                                <div className="flex flex-row gap-1 items-center bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <UserIcon className="size-6 fill-gold" />
                                    <input type="text" name="name" id="name" placeholder="Enter your full name" className="focus:outline-0 w-full font-normal text-black" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="dob" className="text-lg">Date of Birth</label>
                                <div className="flex flex-row gap-1 items-center bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <CalendarIcon className="size-6 fill-gold" />
                                    <input type="date" name="dob" id="dob" placeholder="Enter your Date of Birth" className="focus:outline-0 w-full font-normal text-black" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="phno" className="text-lg">Phone Number</label>
                                <div className="flex flex-row gap-1 items-center bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <PhoneIcon className="size-6 fill-gold" />
                                    <input type="tel" name="phno" id="phno" placeholder="Enter your phone number" className="focus:outline-0 w-full font-normal text-black" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="email" className="text-lg">Email</label>
                                <div className="flex flex-row gap-1 items-center bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <EnvelopeIcon className="size-6 fill-gold" />
                                    <input type="email" name="email" id="email" placeholder="Enter your Email" className="focus:outline-0 w-full font-normal text-black" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="address" className="text-lg">Address</label>
                                <div className="flex flex-row gap-1 items-center bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <HomeIcon className="size-6 fill-gold" />
                                    <input type="text" name="address" id="address" placeholder="Enter your Address" className="focus:outline-0 w-full font-normal text-black" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="pincode" className="text-lg">Pin Code</label>
                                <div className="flex flex-row gap-1 items-center bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <HomeIcon className="size-6 fill-gold" />
                                    <input type="text" name="pincode" id="pincode" placeholder="Enter your pincode" className="focus:outline-0 w-full font-normal text-black" />
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-0.5 p-2">
                                <label htmlFor="state" className="text-lg">State</label>
                                <div className="flex flex-row gap-1 items-center bg-white border-1 border-black w-full p-2 rounded-sm">
                                    <MapPinIcon className="size-6 fill-gold" />
                                    <select name="state" id="state" className="focus:outline-0 w-full font-normal text-black">
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
                    </div>
                </div>
            </div>
        </>
    )
}