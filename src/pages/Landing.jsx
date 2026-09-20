import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import LandingHero from "../components/landing/LandingHero";
import LandingServiceCard from "../components/landing/LandingServiceCard";
import LandingAiSection from "../components/landing/LandingAiSection";
import LandingCta from "../components/landing/LandingCta";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { LANDING_SERVICES } from "../constants/landingData";
import { Link } from "react-router";

export default function Landing() {
  useDocumentTitle("Home");

  return (
    <div className="min-h-screen bg-darkgreen font-montserrat text-white">
      <NavBar />

      <main>
        <LandingHero />

        {/* Services Section */}
        <div id="services" className="relative font-montserrat bg-darkgreen h-auto">
          <div className="services pt-16 mb-8 flex gap-2 md:gap-4 items-center justify-center">
            <hr className="text-gold none md:w-3/12 border-gold" />
            <h2 className="bg-radial from-white to-gold bg-clip-text text-3xl md:text-3xl lg:text-4xl font-bold text-transparent text-center">
              SERVICES WE PROVIDE
            </h2>
            <hr className="text-gold none md:w-3/12 border-gold" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:w-11/12 m-auto w-9/12 py-6 justify-center">
            {LANDING_SERVICES.map((item) => (
              <LandingServiceCard key={item.id} service={item} />
            ))}
          </div>

          <div className="flex items-center justify-center p-4">
            <Link
              to="/services"
              className="px-4 py-2 text-white font-bold rounded-lg m-2 border-gold border cursor-pointer hover:bg-white hover:text-gold transition-all ease-in duration-100"
            >
              All Services
            </Link>
          </div>
        </div>

        <LandingAiSection />

        <LandingCta />
      </main>

      <Footer />
    </div>
  );
}