import { useMemo } from "react";
import SideNav from "../components/SideNav";
import ServiceCard from "../components/dashboard/ServiceCard";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  FARMER_SERVICES,
  SERVICE_PROVIDER_SERVICES,
} from "../constants/dashboardServices";

export default function Dashboard() {
  const { isOpen, role } = UseAppContext();
  const normalizedRole = role === "serviceprovider" ? "serviceprovider" : "farmer";

  useDocumentTitle(
    normalizedRole === "serviceprovider"
      ? "Service Provider Dashboard"
      : "Farmer Dashboard"
  );

  const services = useMemo(() => {
    return normalizedRole === "serviceprovider"
      ? SERVICE_PROVIDER_SERVICES
      : FARMER_SERVICES;
  }, [normalizedRole]);

  return (
    <div className="min-h-dvh bg-black">
      <SideNav />

      <div
        className={`min-h-dvh transition-[margin] duration-300 ${
          isOpen ? "md:ml-62.5" : "md:ml-20"
        }`}
      >
        <div className="mx-2 my-4 overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          <main className="flex flex-row flex-wrap items-stretch justify-center gap-6 p-6 font-montserrat md:p-8">
            {services.map((item) => (
              <ServiceCard
                key={item.id}
                service={item}
                role={normalizedRole}
              />
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}