import RentalsCard from "../components/RentalsCard";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import SideNav from "../components/SideNav";

export default function Rentals() {

    return (
        <>
            <NavBar />
            <SideNav />
            <div className="flex flex-col md:flex-row">
                <div className="filters w-3/12">

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-11/12 md:w-8/12 gap-8 m-auto my-8">
                    <RentalsCard />
                    <RentalsCard />
                    <RentalsCard />
                    <RentalsCard />
                    <RentalsCard />
                    <RentalsCard />
                </div>
            </div>
            <Footer />
        </>
    )
}