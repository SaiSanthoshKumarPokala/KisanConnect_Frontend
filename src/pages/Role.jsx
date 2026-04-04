import { useState } from "react"
import { UseAppContext } from "../context/AppContext";
export default function Role() {

    const { role, navigate, setRole, axios } = UseAppContext();
    const [active, setActive] = useState("");
    const [roles, setRoles] = useState("");

    const Submit = async () => {
        try {
            if (roles == "") {
                window.alert("Select a role to proceed.")
            } else {
                const selectedRole = localStorage.getItem('role');
                setRole(selectedRole);
                const { data } = await axios.post('/api/user/role', {role });
                if (data.success) {
                    navigate("/userinfo");
                }
                else {
                    window.alert("Error, try again");
                }
            }
        } catch (error) {
            window.alert(error.message);
        }
    }

    const buttons = [
        { id: 1, name: "Farmer", desc: "Farming, Rental farming, pesticiding the farms, etc,.", image: "/farmericon.png", val: "farmer" },
        { id: 2, name: "Service Provider", desc: "Transportation, cold storage, farming products, etc,.", image: "/serviceprovider.png", val: "serviceprovider" }
    ]

    return (
        <>
            <div className="bg-darkgreen h-dvh font-montserrat">
                <div className="w-11/12 h-11/12 m-auto flex flex-col items-center justify-around text-gold font-bold gap-8">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl text-center">How do you want to use Kisan Connect?</h1>
                        <p className="text-lg text-center text-white font-normal">You can use this application for both roles. Selct one to get started with.</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 justify-evenly md:h-5/12">
                        {buttons.map((button) => (
                            <button key={button.id} value={button.val} className={`rounded-xl flex flex-col items-center justify-evenly py-4 h-full w-8/12 md:w-4/12 cursor-pointer transition-all ease-in duration-200 ${active === button.id ? "border-4 border-gold shadow-[10px_10px_1px_1px_rgba(212,175,55,0.5)] shadow-gold" : "border-white border-2 hover:shadow-[10px_10px_1px_1px_rgba(0,0,0,0.5)] shadow-white"}`} onClick={(e) => {
                                setActive(button.id); setRoles(button.name); setRole(button.val); localStorage.setItem('role', button.val);
                            }}>
                                <img src={button.image} alt="" />
                                <div className="flex flex-col items-center justify-center">
                                    <h1 className="text-center text-gold text-2xl">{button.name}</h1>
                                    <p className="text-center font-normal text-white text-sm">{button.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-xl text-gold">Selected Role: <b> {roles}</b></p>
                        <input type="submit" value="Next" className="text-xl font-bold bg-gold py-2 px-4 rounded-md text-darkgreen cursor-pointer" onClick={Submit} />
                    </div>
                </div>
            </div>
        </>
    )
}