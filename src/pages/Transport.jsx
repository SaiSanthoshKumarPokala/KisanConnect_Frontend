import { useMemo, useState } from "react";
import SideNav from "../components/SideNav";
import TransportCard from "../components/TransportCard";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import { UseAppContext } from "../context/AppContext";
import image1 from "../assets/Transport/image1.webp";
import image2 from "../assets/Transport/image2.webp";
import image3 from "../assets/Transport/image3.jpeg";
import image4 from "../assets/Transport/image4.webp";
import image5 from "../assets/Transport/image5.webp";
import image6 from "../assets/Transport/image6.webp";

const TRANSPORT_UI_DATA = [
  {
    id: 1,
    name: "Agri Freight Mini Truck",
    vehicleType: "Trucks",
    location: "Hyderabad, Telangana",
    state: "telangana",
    price: "Rs. 350",
    priceLabel: "Rs. 350 / km",
    capacity: "8 Tonnes",
    rating: 4.3,
    owner: "Ravi Kumar",
    availability: "Available",
    description: "Reliable short-haul option for mandi trips and local farm pickups.",
    image: image1,
  },
  {
    id: 2,
    name: "FieldLink Heavy Carrier",
    vehicleType: "Trucks",
    location: "Guntur, Andhra Pradesh",
    state: "andhra pradesh",
    price: "Rs. 420",
    priceLabel: "Rs. 420 / km",
    capacity: "12 Tonnes",
    rating: 4.7,
    owner: "Venkat Logistics",
    availability: "Available",
    description: "Heavy-duty transport for longer interstate crop movement.",
    image: image2,
  },
  {
    id: 3,
    name: "Harvest Tempo XL",
    vehicleType: "Tempo",
    location: "Nashik, Maharashtra",
    state: "maharashtra",
    price: "Rs. 210",
    priceLabel: "Rs. 210 / km",
    capacity: "3 Tonnes",
    rating: 4.5,
    owner: "Anita Transport",
    availability: "Limited",
    description: "Compact carrier suited for produce pickups from tighter rural roads.",
    image: image3,
  },
  {
    id: 4,
    name: "Kisan Cargo Van",
    vehicleType: "Vans",
    location: "Mysuru, Karnataka",
    state: "karnataka",
    price: "Rs. 180",
    priceLabel: "Rs. 180 / km",
    capacity: "1.5 Tonnes",
    rating: 4.2,
    owner: "Arjun Patel",
    availability: "Available",
    description: "Fast and practical for smaller deliveries and quick supply runs.",
    image: image4,
  },
  {
    id: 5,
    name: "Cold Chain Reefer Van",
    vehicleType: "Reefer",
    location: "Thrissur, Kerala",
    state: "kerala",
    price: "Rs. 390",
    priceLabel: "Rs. 390 / km",
    capacity: "4 Tonnes",
    rating: 4.8,
    owner: "Sowmya Cold Logistics",
    availability: "Available",
    description: "Temperature-controlled movement for perishables and delicate produce.",
    image: image5,
  },
  {
    id: 6,
    name: "Bulk Transit Hauler",
    vehicleType: "Trucks",
    location: "Warangal, Telangana",
    state: "telangana",
    price: "Rs. 460",
    priceLabel: "Rs. 460 / km",
    capacity: "15 Tonnes",
    rating: 4.6,
    owner: "Naveen Freight",
    availability: "Available",
    description: "Built for high-volume shipments when capacity matters most.",
    image: image6,
  },
];

export default function Transport() {
  const { isOpen, setIsOpen } = UseAppContext();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [stateLocation, setStateLocation] = useState("select");
  const filters = ["All", "Trucks", "Tempo", "Vans", "Reefer"];

  const filteredTransport = useMemo(() => {
    return TRANSPORT_UI_DATA.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.owner.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      const matchesCategory = activeFilter === "All" || item.vehicleType === activeFilter;
      const matchesState = stateLocation === "select" || item.state === stateLocation;

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [activeFilter, search, stateLocation]);

  const resultLabel =
    activeFilter === "All" ? "showing all transport options" : `showing ${activeFilter.toLowerCase()}`;
  const stateLabel = stateLocation === "select" ? "all states" : stateLocation;

  return (
    <div className="min-h-dvh bg-darkgreen">
      <SideNav />
      <div
        className={`flex min-h-dvh flex-col transition-all duration-300 ${
          isOpen ? "md:ml-[250px]" : "md:ml-[80px]"
        }`}
      >
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          <ModuleHeader
            title="Transport Services"
            search={search}
            onSearchChange={setSearch}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />
          <ModuleFilters
            filters={filters}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            state={stateLocation}
            setState={setStateLocation}
          />

          <div className="flex flex-wrap items-center gap-2 px-6 pt-4">
            <span className="font-montserrat text-sm font-bold text-white">
              {filteredTransport.length} vehicle{filteredTransport.length !== 1 ? "s" : ""} found
            </span>
            <span className="font-montserrat text-xs text-white/60">
              . {resultLabel} in {stateLabel}
            </span>
            {search.trim() && (
              <span className="font-montserrat text-xs text-[#FFF085]">
                . matching "{search.trim()}"
              </span>
            )}
          </div>

          {filteredTransport.length === 0 ? (
            <div className="px-6 py-10 font-montserrat text-sm text-white/70">
              No transport options match your current search and filters.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px] p-6">
              {filteredTransport.map((vehicle) => (
                <TransportCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
