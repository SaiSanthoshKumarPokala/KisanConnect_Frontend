import { useMemo, useState } from "react";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import RentalsCard from "../components/RentalsCard";
import image1 from "../assets/Rentals/image1.webp";
import image2 from "../assets/Rentals/image2.webp";
import image3 from "../assets/Rentals/image3.jpeg";
import image4 from "../assets/Rentals/image4.webp";
import image5 from "../assets/Rentals/image5.webp";

const RENTALS_UI_DATA = [
  {
    id: 1,
    name: "Mahindra 575 DI",
    category: "Tractors",
    location: "Kompally, Hyderabad",
    state: "telangana",
    price: 2200,
    horsepower: 47,
    rating: 4.8,
    owner: "Rajesh Kumar",
    availability: "Available",
    description: "Reliable tractor for ploughing, haulage, and long field days.",
    image: image1,
  },
  {
    id: 2,
    name: "John Deere 5310",
    category: "Tractors",
    location: "Guntur, Andhra Pradesh",
    state: "andhra pradesh",
    price: 2600,
    horsepower: 55,
    rating: 4.7,
    owner: "Venkat Rao",
    availability: "Available",
    description: "High-torque machine suited for heavier tilling and transport work.",
    image: image2,
  },
  {
    id: 3,
    name: "Harvester Prime X9",
    category: "Harvesters",
    location: "Nashik, Maharashtra",
    state: "maharashtra",
    price: 5400,
    horsepower: 98,
    rating: 4.9,
    owner: "Meera Agro Infra",
    availability: "Available",
    description: "Fast, clean harvesting support for peak-season grain and paddy work.",
    image: image3,
  },
  {
    id: 4,
    name: "FieldMax Mini Harvester",
    category: "Harvesters",
    location: "Mysuru, Karnataka",
    state: "karnataka",
    price: 4900,
    horsepower: 88,
    rating: 4.5,
    owner: "Arjun Patel",
    availability: "Limited",
    description: "Compact harvester that handles medium-size farms with ease.",
    image: image4,
  },
  {
    id: 5,
    name: "Turbo Seeder 2000",
    category: "Implements",
    location: "Thrissur, Kerala",
    state: "kerala",
    price: 1400,
    horsepower: 28,
    rating: 4.6,
    owner: "Sowmya Naik",
    availability: "Available",
    description: "Uniform row sowing with quick setup for busy planting schedules.",
    image: image5,
  },
  {
    id: 6,
    name: "RotaKing Cultivator",
    category: "Implements",
    location: "Warangal, Telangana",
    state: "telangana",
    price: 1100,
    horsepower: 24,
    rating: 4.4,
    owner: "Naveen Goud",
    availability: "Available",
    description: "Budget-friendly option for rapid soil preparation before planting.",
    image: image2,
  },
];

export default function Rentals() {
  const { isOpen, setIsOpen } = UseAppContext();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [stateLocation, setStateLocation] = useState("select");
  const filters = ["All", "Tractors", "Harvesters", "Implements"];

  const filteredRentals = useMemo(() => {
    return RENTALS_UI_DATA.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.owner.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      const matchesCategory = activeFilter === "All" || item.category === activeFilter;
      const matchesState = stateLocation === "select" || item.state === stateLocation;

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [activeFilter, search, stateLocation]);

  const resultLabel =
    activeFilter === "All" ? "showing all equipment" : `showing ${activeFilter.toLowerCase()}`;
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
            title="Machine Rentals"
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
              {filteredRentals.length} machine{filteredRentals.length !== 1 ? "s" : ""} found
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

          {filteredRentals.length === 0 ? (
            <div className="px-6 py-10 font-montserrat text-sm text-white/70">
              No machines match your current search and filters.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px] p-6">
              {filteredRentals.map((item) => (
                <RentalsCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
