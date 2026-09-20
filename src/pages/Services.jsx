import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ServiceDetailCard from "../components/services/ServiceDetailCard";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { SERVICES_LIST } from "../constants/servicesData";

export default function Services() {
  useDocumentTitle("Services");

  return (
    <div className="min-h-screen bg-darkgreen font-montserrat text-white">
      <NavBar />

      <main className="mx-auto flex w-11/12 max-w-6xl flex-col gap-6 py-8 md:py-12">
        {SERVICES_LIST.map((service) => (
          <ServiceDetailCard key={service.id} service={service} />
        ))}
      </main>

      <Footer />
    </div>
  );
}