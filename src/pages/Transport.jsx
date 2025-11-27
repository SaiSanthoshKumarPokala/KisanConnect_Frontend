import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import SideNav from "../components/SideNav";
import TransportCard from "../components/TransportCard";

export default function Transport() {

    return (
        <>
            <NavBar />
            <SideNav />
            <div className="flex flex-col md:flex-row font-montserrat">
                <div className="w-3/12"></div>
                <div className="flex flex-col gap-4 w-11/12 md:w-8/12 my-8 m-auto">
                    <TransportCard />
                    <TransportCard />
                    <TransportCard />
                    <TransportCard />
                    <TransportCard />
                    <TransportCard />
                    <TransportCard />
                </div>
            </div>
            <Footer />
        </>
    )
}