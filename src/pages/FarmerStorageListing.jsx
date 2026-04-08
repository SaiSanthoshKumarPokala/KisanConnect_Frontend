import { useState } from "react";
import ColdStorage1 from "../assets/ColdStorage/ColdStorage1.jpg";
import ColdStorage2 from "../assets/ColdStorage/ColdStorage2.webp";
import ColdStorage3 from "../assets/ColdStorage/ColdStorage3.webp";
import ColdStorage4 from "../assets/ColdStorage/ColdStorage4.webp";
import ColdStorage5 from "../assets/ColdStorage/ColdStorage5.webp";
import ColdStorage6 from "../assets/ColdStorage/ColdStorage6.webp";
import ColdStorage11 from "../assets/ColdStorage/Coldstorage1.1.jpg";
import ColdStorage12 from "../assets/ColdStorage/Coldstorage1.2.jpg";
import ColdStorage21 from "../assets/ColdStorage/Coldstorage2.1.webp";
import ColdStorage22 from "../assets/ColdStorage/Coldstorage2.2.webp";
import ColdStorage31 from "../assets/ColdStorage/Coldstorage3.1.jpg";
import ColdStorage32 from "../assets/ColdStorage/Coldstorage3.2.jpg";
import ColdStorage41 from "../assets/ColdStorage/Coldstorage4.1.jpg";
import ColdStorage42 from "../assets/ColdStorage/Coldstorage4.2.jpg";
import ColdStorage51 from "../assets/ColdStorage/Coldstorage5.1.webp";
import ColdStorage52 from "../assets/ColdStorage/Coldstorage5.2.webp";
import ColdStorage61 from "../assets/ColdStorage/Coldstorage6.1.jpg";
import ColdStorage62 from "../assets/ColdStorage/Coldstorage6.2.jpg";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import FarmerStorageContent from "../components/FarmerStorageContent";

const storages = [
  { id: 1, name: "Srinivasa Cold Storage", location: "Kompally, Hyderabad", distance: "3.2 km", price: 12, capacity: 850, available: 340, rating: 4.7, reviews: 124, status: "available", image: ColdStorage1, owner: "Srinivas Rao", established: "2016", operatingHours: "6:00 AM - 10:00 PM", produce: "Potato, tomato, leafy greens", description: "Farmers nearby usually prefer this facility for quick turnaround and easy unloading. It has a calm, organized setup and works especially well when produce needs short-term storage before the next market run.", gallery: [ColdStorage1, ColdStorage11, ColdStorage12] },
  { id: 2, name: "Raghavendra Agri Store", location: "Medchal, Hyderabad", distance: "6.1 km", price: 9, capacity: 1200, available: 90, rating: 4.2, reviews: 87, status: "limited", image: ColdStorage2, owner: "Raghavendra Reddy", established: "2014", operatingHours: "7:00 AM - 9:00 PM", produce: "Onion, maize, chillies", description: "This storage is more functional than fancy, but that is exactly why many growers rely on it. It handles heavier volumes well and is often chosen when cost control matters more than premium finishing.", gallery: [ColdStorage2, ColdStorage21, ColdStorage22] },
  { id: 3, name: "Green Valley Cooling", location: "Shamirpet, Hyderabad", distance: "8.4 km", price: 15, capacity: 600, available: 600, rating: 4.9, reviews: 210, status: "available", image: ColdStorage3, owner: "Meera Agro Infra", established: "2019", operatingHours: "24 Hours", produce: "Fruits, flowers, exotic vegetables", description: "A more premium cold storage option with cleaner presentation, tighter handling, and a stronger reputation for delicate produce. It is a good fit when quality preservation matters as much as availability.", gallery: [ColdStorage3, ColdStorage31, ColdStorage32] },
  { id: 4, name: "Bharat Cold Chambers", location: "Quthbullapur, Hyderabad", distance: "11 km", price: 7, capacity: 2000, available: 0, rating: 3.8, reviews: 45, status: "full", image: ColdStorage4, owner: "Bharat Logistics", established: "2012", operatingHours: "6:00 AM - 8:00 PM", produce: "Bulk grains, onion, seed stock", description: "This is the kind of large-capacity facility growers look at when they have serious volume to manage. It is usually packed during busy cycles because the pricing and scale make it attractive for bulk seasonal storage.", gallery: [ColdStorage4, ColdStorage41, ColdStorage42] },
  { id: 5, name: "Kisan FreshStore", location: "Bachupally, Hyderabad", distance: "13.5 km", price: 11, capacity: 750, available: 450, rating: 4.5, reviews: 163, status: "available", image: ColdStorage5, owner: "Kisan Fresh Cooperative", established: "2018", operatingHours: "5:30 AM - 11:00 PM", produce: "Milk products, fruits, vegetables", description: "A dependable middle-ground option that feels farmer-friendly in both pricing and operations. It is often used for mixed produce loads when flexibility and decent remaining capacity are both important.", gallery: [ColdStorage5, ColdStorage51, ColdStorage52] },
  { id: 6, name: "Surya Refrigeration Hub", location: "Dundigal, Hyderabad", distance: "17 km", price: 8, capacity: 1500, available: 200, rating: 4.0, reviews: 59, status: "limited", image: ColdStorage6, owner: "Surya Warehousing", established: "2015", operatingHours: "6:30 AM - 9:30 PM", produce: "Citrus, onion, dry fruits", description: "Known for practical storage at a manageable rate, this hub is useful when farmers want to hold produce a little longer without stretching budget too much. It feels more warehouse-like, but gets the job done reliably.", gallery: [ColdStorage6, ColdStorage61, ColdStorage62] },
];

export default function FarmerStorageListing() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("distance");
  const { isOpen, setIsOpen } = UseAppContext();

  return (
    <div className="bg-darkgreen min-h-dvh">
      <SideNav />
      <div className={`flex flex-col min-h-dvh transition-all duration-300 ${isOpen ? "md:ml-62.5" : "md:ml-20"}`}>
        <div className="flex flex-col mx-2 md:mx-6 my-4 border border-gold/30 rounded-2xl shadow-2xl bg-darkgreen font-montserrat flex-1 overflow-hidden">
          <FarmerStorageContent
            storages={storages}
            search={search}
            setSearch={setSearch}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>
    </div>
  );
}
