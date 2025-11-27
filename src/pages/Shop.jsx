import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import SideNav from "../components/SideNav";

export default function Shop() {

    return (
        <>
            <NavBar className="bg-amber-300" />
            <SideNav />
            <div className="flex flex-col md:flex-row">
                <div className="w-3/12">
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-10/12 md:w-8/12 gap-8 m-auto my-4 font-montserrat">
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                </div>
            </div>
            <Footer />
        </>
    )
}