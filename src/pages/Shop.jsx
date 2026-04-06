import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import ModuleFilters from "../components/ModuleFilters";
import { UseAppContext } from "../context/AppContext";

const SHOP_UI_DATA = [
  {
    _id: "ui-1",
    name: "Premium Urea",
    seller: "GreenLeaf Agro Store",
    price: 500,
    rating: 4.6,
    category: "Fertilizers",
    state: "telangana",
    image: "/urea.png",
    description: "Balanced nitrogen support for strong vegetative crop growth.",
  },
  {
    _id: "ui-2",
    name: "Hybrid Paddy Seeds",
    seller: "Kisan Seed House",
    price: 820,
    rating: 4.8,
    category: "Seeds",
    state: "andhra pradesh",
    image: "/seeds.webp",
    description: "High-yield seed variety suited for strong germination rates.",
  },
  {
    _id: "ui-3",
    name: "Crop Shield Pesticide",
    seller: "Agri Protect",
    price: 680,
    rating: 4.4,
    category: "Pesticides",
    state: "maharashtra",
    image: "/fertilizers.png",
    description: "Protective treatment for common seasonal pest pressure.",
  },
  {
    _id: "ui-4",
    name: "Power Sprayer Kit",
    seller: "Field Tools Hub",
    price: 2450,
    rating: 4.5,
    category: "Equipment",
    state: "karnataka",
    image: "/shop.avif",
    description: "Durable spraying setup for field care and quick application cycles.",
  },
  {
    _id: "ui-5",
    name: "Organic Soil Booster",
    seller: "Nature Root Supplies",
    price: 740,
    rating: 4.7,
    category: "Fertilizers",
    state: "kerala",
    image: "/fertilizers.svg",
    description: "Organic nutrient blend for healthier soil structure and recovery.",
  },
  {
    _id: "ui-6",
    name: "Vegetable Seed Pack",
    seller: "FreshGrow Traders",
    price: 360,
    rating: 4.3,
    category: "Seeds",
    state: "telangana",
    image: "/seeds.webp",
    description: "Mixed seed pack for kitchen-garden and market crop planting.",
  },
];

export default function Shop() {
  const { isOpen, setIsOpen } = UseAppContext();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [stateLocation, setStateLocation] = useState("select");
  const [products] = useState([]);
  const filters = ["All", "Fertilizers", "Seeds", "Pesticides", "Equipment"];

  const displayProducts = products.length > 0 ? products : SHOP_UI_DATA;

  const filteredProducts = useMemo(() => {
    return displayProducts.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.seller.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      const matchesCategory = activeFilter === "All" || item.category === activeFilter;
      const matchesState = stateLocation === "select" || item.state === stateLocation;

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [activeFilter, displayProducts, search, stateLocation]);

  const resultLabel =
    activeFilter === "All" ? "showing all products" : `showing ${activeFilter.toLowerCase()}`;
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
            title="Shop Community"
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
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
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

          {filteredProducts.length === 0 ? (
            <div className="px-6 py-10 font-montserrat text-sm text-white/70">
              No products match your current search and filters.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[18px] p-6">
              {filteredProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  name={item.name}
                  seller={item.seller}
                  price={item.price}
                  rating={item.rating}
                  category={item.category}
                  image={item.image}
                  description={item.description}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
