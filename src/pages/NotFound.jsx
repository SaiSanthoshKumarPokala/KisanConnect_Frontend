import NavBar from "../components/NavBar";
import NotFounds from "/404.svg";
import { Link } from "react-router";
import { UseAppContext } from "../context/AppContext";

export default function NotFound() {

    const { role } = UseAppContext();

    return (
        <>
            <div className="h-dvh flex flex-col">
                <NavBar />
                <div className="h-dvh w-dvw m-auto items-center justify-evenly flex flex-col md:flex-row">
                    <div className="font-bold text-3xl text-white md:text-4xl lg:text-7xl flex flex-col items-center lg:items-start">
                        <p className="text-white">It looks like</p>
                        <p className="text-white">you are lost</p>
                        <p className="text-white">in space</p>
                        {role == "farmer" || role == "serviceprovider" ? <Link to={`/${role}`} className="px-6 py-4 text-darkgreen w-full text-center rounded-full text-xl lg:text-2xl my-6 border-gold/75 border-[1.2px] cursor-pointer bg-gold hover:bg-darkgreen hover:text-gold">Get back to home</Link> :
                            <Link to="/" className="px-6 py-4 text-darkgreen w-full text-center rounded-full text-xl lg:text-2xl my-6 border-gold/75 border-[1.2px] cursor-pointer bg-gold hover:bg-darkgreen hover:text-gold">Get back to home</Link>}
                    </div>
                    <img src={NotFounds} alt="Lost in space illustration" className="size-72 lg:size-100" />
                </div>
            </div>
        </>
    )
}
